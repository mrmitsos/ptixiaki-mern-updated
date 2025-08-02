import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Σχήμα για τον χρήστη
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Όνομα χρήστη
    },
    email: {
      type: String,
      required: true, // Email χρήστη
      unique: true, // Πρέπει να είναι μοναδικό
    },
    password: {
      type: String,
      required: true, // Κωδικός πρόσβασης (hashed)
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false, // Αν ο χρήστης είναι διαχειριστής (admin)
    },
  },
  {
    timestamps: true, // Προσθέτει createdAt και updatedAt
  }
);

// Μέθοδος για σύγκριση του κωδικού που πληκτρολόγησε ο χρήστης με τον κρυπτογραφημένο στο DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware πριν την αποθήκευση: κρυπτογραφεί τον κωδικό αν έχει αλλάξει
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10); // Δημιουργία salt για το hash
  this.password = await bcrypt.hash(this.password, salt); // Κρυπτογράφηση κωδικού
});

const User = mongoose.model("User", userSchema);

export default User;
