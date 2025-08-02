import express from "express";
const router = express.Router();

import {
  authUser, // Συνδεθείτε χρήστης
  registerUser, // Εγγραφή χρήστη
  logoutUser, // Αποσύνδεση χρήστη
  getUserProfile, // Προβολή προφίλ χρήστη
  updateUserProfile, // Ενημέρωση προφίλ χρήστη
  getUsers, // Λήψη όλων των χρηστών (μόνο admin)
  deleteUser, // Διαγραφή χρήστη (admin)
  getUserById, // Λήψη χρήστη με ID (admin)
  updateUser, // Ενημέρωση χρήστη με ID (admin)
} from "../controllers/userController.js";

import { admin, protect } from "../middleware/authMiddleware.js";

// Δημιουργία νέου χρήστη (εγγραφή) ή προβολή λίστας χρηστών (admin μόνο)
router.route("/").post(registerUser).get(protect, admin, getUsers);

// Αποσύνδεση χρήστη
router.post("/logout", logoutUser);

// Σύνδεση χρήστη
router.post("/auth", authUser);

// Προβολή και ενημέρωση προφίλ του συνδεδεμένου χρήστη
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Προβολή, διαγραφή και ενημέρωση χρήστη με συγκεκριμένο ID (admin μόνο)
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
