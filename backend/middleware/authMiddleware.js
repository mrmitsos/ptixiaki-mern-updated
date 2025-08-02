import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

// Middleware που απαιτεί να είναι ο χρήστης αυθεντικοποιημένος
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Διαβάζουμε το JWT από το cookie με όνομα 'jwt'
  token = req.cookies.jwt;

  if (token) {
    try {
      // Επαληθεύουμε το token με το μυστικό κλειδί
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Φέρνουμε τον χρήστη από τη βάση με βάση το id που υπάρχει μέσα στο token
      // Αποφεύγουμε να στείλουμε το password
      req.user = await User.findById(decoded.userId).select("-password");

      // Προχωράμε στο επόμενο middleware ή route handler
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Μη εξουσιοδοτημένη πρόσβαση, το token απέτυχε");
    }
  } else {
    res.status(401);
    throw new Error("Μη εξουσιοδοτημένη πρόσβαση, δεν βρέθηκε token");
  }
});

// Middleware που απαιτεί ο χρήστης να είναι admin
const admin = (req, res, next) => {
  // Ελέγχουμε αν ο χρήστης είναι αυθεντικοποιημένος και αν έχει δικαιώματα admin
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Μη εξουσιοδοτημένη πρόσβαση ως admin");
  }
};

export { protect, admin };
