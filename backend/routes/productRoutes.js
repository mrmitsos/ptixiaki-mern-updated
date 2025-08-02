import express from "express";
const router = express.Router();
import {
  getProductById,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

// Λήψη όλων των προϊόντων (δημόσια διαδρομή)
router
  .route("/")
  .get(getProducts)
  // Δημιουργία νέου προϊόντος (προστατευμένη διαδρομή, μόνο admin)
  .post(protect, admin, createProduct);

// Λήψη των κορυφαίων προϊόντων
router.get("/top", getTopProducts);

// Λήψη, ενημέρωση ή διαγραφή προϊόντος με βάση το id
router
  .route("/:id")
  .get(checkObjectId, getProductById) // Λήψη προϊόντος με βάση το ID
  .put(protect, admin, checkObjectId, updateProduct) // Ενημέρωση προϊόντος (μόνο admin)
  .delete(protect, admin, checkObjectId, deleteProduct); // Διαγραφή προϊόντος (μόνο admin)

// Δημιουργία κριτικής για προϊόν (προστατευμένη διαδρομή)
router.route("/:id/reviews").post(protect, checkObjectId, createProductReview);

/* 
// Παρατηρημένα παλιά routes που έχουν αντικατασταθεί από τους controllers
// Define a route to get all products
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const products = await Product.find({}); // pass empty object to get all of them
    res.json(products); // respond with the full list of products in JSON format
  })
);

// Define a route to get a single product by ID
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    // find the product that matches the provided ID
    // const product = products.find((p) => p._id === req.params.id);

    const product = await Product.findById(req.params.id);

    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Resource not found");
    }
    // res.json(product); // respond with the matching product, or undefined if not found
  })
);
*/

export default router;
