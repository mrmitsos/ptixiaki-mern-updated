import mongoose from "mongoose";

// Σχήμα για τις κριτικές προϊόντων
const reviewSchema = mongoose.Schema(
  {
    // Ο χρήστης που έκανε την κριτική (αναφορά σε User)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true, // Όνομα χρήστη που έκανε την κριτική
    },
    rating: {
      type: Number,
      required: true, // Αξιολόγηση προϊόντος (π.χ. 1-5)
    },
    comment: {
      type: String,
      required: true, // Σχόλιο/κριτική
    },
  },
  {
    timestamps: true, // Προσθήκη πεδίων createdAt, updatedAt
  }
);

// Σχήμα για τα προϊόντα
const productSchema = new mongoose.Schema(
  {
    // Ο χρήστης που δημιούργησε/προσέθεσε το προϊόν (αναφορά σε User)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true, // Όνομα προϊόντος
    },
    image: {
      type: String,
      required: true, // URL ή διαδρομή εικόνας προϊόντος
    },
    brand: {
      type: String,
      required: true, // Μάρκα προϊόντος
    },
    category: {
      type: String,
      required: true, // Κατηγορία προϊόντος
    },
    description: {
      type: String,
      required: true, // Περιγραφή προϊόντος
    },
    reviews: [reviewSchema], // Πίνακας με τις κριτικές προϊόντος
    rating: {
      type: Number,
      required: true,
      default: 0, // Μέση βαθμολογία προϊόντος
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0, // Αριθμός κριτικών
    },
    price: {
      type: Number,
      required: true,
      default: 0, // Τιμή προϊόντος
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0, // Διαθέσιμο απόθεμα
    },
  },
  {
    timestamps: true, // Προσθήκη πεδίων createdAt, updatedAt
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
