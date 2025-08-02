import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { calcPrices } from "../utils/calcPrices.js";
import { verifyPayPalPayment, checkIfNewTransaction } from "../utils/paypal.js";

// Δημιουργία νέας παραγγελίας
// POST /api/routes
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  // Έλεγχος αν υπάρχουν προϊόντα στην παραγγελία
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("Δεν υπάρχουν προϊόντα στην παραγγελία");
  } else {
    // ΣΗΜΕΙΩΣΗ: Δεν εμπιστευόμαστε τις τιμές που έρχονται από τον πελάτη.
    // Πρέπει να λαμβάνουμε τις τιμές μόνο από τη βάση δεδομένων για να αποτρέψουμε
    // τον πελάτη να αλλάξει τις τιμές μέσω του frontend (hack client-side κώδικα).

    // Φέρνουμε τα προϊόντα από τη βάση δεδομένων με βάση τα IDs που έστειλε ο πελάτης
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    // Δημιουργούμε νέα λίστα με τα προϊόντα της παραγγελίας, αντικαθιστώντας την τιμή με αυτή από τη βάση
    const dbOrderItems = orderItems.map((itemFromClient) => {
      // Βρίσκουμε το αντίστοιχο προϊόν από τη βάση δεδομένων
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );
      return {
        ...itemFromClient,
        product: itemFromClient._id, // Αναφορά στο προϊόν με το ID του
        price: matchingItemFromDB.price, // Τιμή από τη βάση δεδομένων
        _id: undefined, // Αφαιρούμε το _id από το αντικείμενο παραγγελίας
      };
    });

    // Υπολογίζουμε τις τιμές της παραγγελίας (προϊόντα, φόρος, αποστολή, σύνολο)
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    // Δημιουργούμε νέο αντικείμενο παραγγελίας με όλα τα στοιχεία
    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id, // Ο χρήστης που έκανε την παραγγελία
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    // Αποθηκεύουμε την παραγγελία στη βάση δεδομένων
    const createdOrder = await order.save();

    // Επιστρέφουμε την παραγγελία με status 201 Created
    res.status(201).json(createdOrder);
  }
});

// Λήψη παραγγελιών του τρέχοντος χρήστη
// GET /api/orders/myorders
const getMyOrders = asyncHandler(async (req, res) => {
  // Αναζητούμε τις παραγγελίες με βάση το user id
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

// Λήψη παραγγελίας με βάση το id της
// GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  // Βρίσκουμε την παραγγελία και γεμίζουμε τα στοιχεία του χρήστη (name, email)
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Η παραγγελία δεν βρέθηκε");
  }
});

// Ενημέρωση παραγγελίας ως πληρωμένη
// PUT /api/orders/:id/pay
const updateOrderToPaid = asyncHandler(async (req, res) => {
  // ΣΗΜΕΙΩΣΗ: Εδώ πρέπει να επιβεβαιώσουμε ότι η πληρωμή έγινε πράγματι μέσω PayPal πριν
  // σημειώσουμε την παραγγελία ως πληρωμένη
  const { verified, value } = await verifyPayPalPayment(req.body.id);
  if (!verified) throw new Error("Η πληρωμή δεν επαληθεύτηκε");

  // Έλεγχος αν η συναλλαγή έχει χρησιμοποιηθεί ξανά (προστασία από διπλές εγγραφές)
  const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
  if (!isNewTransaction) throw new Error("Η συναλλαγή έχει ήδη χρησιμοποιηθεί");

  // Βρίσκουμε την παραγγελία με βάση το ID από τα params
  const order = await Order.findById(req.params.id);

  if (order) {
    // Έλεγχος αν το ποσό που πληρώθηκε είναι σωστό (ίδιο με το συνολικό ποσό της παραγγελίας)
    const paidCorrectAmount = order.totalPrice.toString() === value;
    if (!paidCorrectAmount) throw new Error("Λάθος ποσό πληρώθηκε");

    // Σημειώνουμε την παραγγελία ως πληρωμένη και καταγράφουμε την ώρα πληρωμής
    order.isPaid = true;
    order.paidAt = Date.now();

    // Αποθηκεύουμε τα στοιχεία πληρωμής που επιστρέφει το PayPal
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    // Αποθηκεύουμε τις αλλαγές στη βάση δεδομένων
    const updatedOrder = await order.save();

    // Επιστρέφουμε την ενημερωμένη παραγγελία ως απάντηση
    res.json(updatedOrder);
  } else {
    // Αν δεν βρεθεί η παραγγελία, επιστρέφουμε 404 με κατάλληλο μήνυμα σφάλματος
    res.status(404);
    throw new Error("Η παραγγελία δεν βρέθηκε");
  }
});

// Ενημέρωση παραγγελίας ως παραδομένη
// PUT /api/orders/:id/deliver
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true; // Ορίζουμε την παραγγελία ως παραδομένη
    order.deliveredAt = Date.now(); // Καταγράφουμε την ημερομηνία παράδοσης

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Η παραγγελία δεν βρέθηκε");
  }
});

// Λήψη όλων των παραγγελιών (για admin)
// GET /api/orders
const getOrders = asyncHandler(async (req, res) => {
  // Αναζητούμε όλες τις παραγγελίες και γεμίζουμε τα στοιχεία του χρήστη (id, name)
  const orders = await Order.find({}).populate("user", "id name");
  res.status(200).json(orders);
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
