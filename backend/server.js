import express from "express";
import dotenv from "dotenv";
// Load environment variables into process.env
dotenv.config();
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const port = process.env.PORT;

connectDB(); //Connect to Mongodb

// Create an instance of an Express application
const app = express();

// Define a simple route for the root URL
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/products", productRoutes);

// Define a route to get all products
app.get("/api/products", (req, res) => {
  res.json(products); // Respond with the full list of products in JSON format
});

// Define a route to get a single product by ID
app.get("/api/products/:id", (req, res) => {
  // Find the product that matches the provided ID
  const product = products.find((p) => p._id === req.params.id);
  res.json(product); // Respond with the matching product, or undefined if not found
});

app.use(notFound);
app.use(errorHandler);

// Start the server and listen on the specified port
app.listen(port, () => console.log(`Server running on port ${port}`));
