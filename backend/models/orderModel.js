import mongoose from "mongoose";

// Σχήμα για τις παραγγελίες
const orderSchema = mongoose.Schema(
  {
    // Ο χρήστης που έκανε την παραγγελία (αναφορά σε User)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // Λίστα με τα αντικείμενα της παραγγελίας
    orderItems: [
      {
        name: {
          type: String,
          required: true, // Όνομα προϊόντος
        },
        qty: {
          type: Number,
          required: true, // Ποσότητα
        },
        image: {
          type: String,
          required: true, // Εικόνα προϊόντος
        },
        price: {
          type: Number,
          required: true, // Τιμή προϊόντος
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product", // Αναφορά στο προϊόν
        },
      },
    ],
    // Διεύθυνση αποστολής
    shippingAddress: {
      address: {
        type: String,
        required: true, // Διεύθυνση
      },
      city: {
        type: String,
        required: true, // Πόλη
      },
      postalCode: {
        type: String,
        required: true, // ΤΚ
      },
      country: {
        type: String,
        required: true, // Χώρα
      },
    },
    paymentMethod: {
      type: String,
      required: true, // Τρόπος πληρωμής
    },
    // Αποτέλεσμα πληρωμής (προαιρετικά)
    paymentResult: {
      id: { type: String }, // Αναγνωριστικό πληρωμής
      status: { type: String }, // Κατάσταση πληρωμής
      update_time: { type: String }, // Ώρα ενημέρωσης
      email_address: { type: String }, // Email πληρωτή
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0, // Συνολική τιμή αντικειμένων
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0, // Φόρος
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0, // Κόστος αποστολής
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0, // Τελική τιμή παραγγελίας
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false, // Αν έχει πληρωθεί
    },
    paidAt: {
      type: Date, // Ημερομηνία πληρωμής
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false, // Αν έχει παραδοθεί
    },
    deliveredAt: {
      type: Date, // Ημερομηνία παράδοσης
    },
  },
  {
    timestamps: true, // Αυτόματη προσθήκη createdAt και updatedAt
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
