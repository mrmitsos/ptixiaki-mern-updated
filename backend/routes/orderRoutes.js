import express from "express";
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
} from "../controllers/orderController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

// Δημιουργία νέας παραγγελίας (προστατευμένη διαδρομή - απαιτεί σύνδεση)
router
  .route("/")
  .post(protect, addOrderItems)
  // Λήψη όλων των παραγγελιών (μόνο admin)
  .get(protect, admin, getOrders);

// Λήψη παραγγελιών του συνδεδεμένου χρήστη
router.route("/mine").get(protect, getMyOrders);

// Λήψη παραγγελίας με βάση το id (προστατευμένη διαδρομή)
router.route("/:id").get(protect, getOrderById);

// Ενημέρωση παραγγελίας ως πληρωμένη (προστατευμένη διαδρομή)
router.route("/:id/pay").put(protect, updateOrderToPaid);

// Ενημέρωση παραγγελίας ως παραδομένη (μόνο admin)
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

export default router;
