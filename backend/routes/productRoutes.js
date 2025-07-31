import express from "express";
const router = express.Router();
import {
  getProductById,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(getProducts).post(protect, admin, createProduct);
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

/*
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
