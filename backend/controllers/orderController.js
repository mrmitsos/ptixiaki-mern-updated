import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";

// Δημιουργία νέας παραγγελίας
// POST /api/routes
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // Ελέγχουμε αν υπάρχουν παραγγελίες προς αποστολή
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("Δεν υπάρχουν αντικείμενα παραγγελίας");
  } else {
    // Δημιουργούμε ένα νέο αντικείμενο παραγγελίας
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id, // Αντιστοιχούμε το _id του προϊόντος
        _id: undefined, // Αφαιρούμε το _id από το αντικείμενο ώστε να δημιουργηθεί νέο
      })),
      user: req.user._id, // Ο χρήστης που έκανε την παραγγελία
      shippingAddress, // Διεύθυνση αποστολής
      paymentMethod, // Μέθοδος πληρωμής
      itemsPrice, // Τιμή αντικειμένων
      taxPrice, // Φόρος
      shippingPrice, // Κόστος αποστολής
      totalPrice, // Συνολικό κόστος
    });

    // Αποθηκεύουμε την παραγγελία στη βάση δεδομένων
    const createOrder = await order.save();
    res.status(201).json(createOrder);
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
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true; // Ορίζουμε την παραγγελία ως πληρωμένη
    order.paidAt = Date.now(); // Καταγράφουμε την ημερομηνία πληρωμής
    order.paymentResult = {
      // Αποθηκεύουμε τα στοιχεία πληρωμής
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    res.status(400);
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
