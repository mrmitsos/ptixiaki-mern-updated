import mongoose from "mongoose";
import dotenv from "dotenv";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

// Function to import sample data into the database
const importData = async () => {
  try {
    // Clear existing data from collections
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Insert sample users into the User collection
    const createdUsers = await User.insertMany(users);

    // Get the ID of the first user (assumed to be admin)
    const adminUser = createdUsers[0]._id;

    // Attach admin user ID to each product as the owner
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    // Insert the sample products into the Product collection
    await Product.insertMany(sampleProducts);

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error("You made a mistake");
    process.exit(1);
  }
};

// Function to destroy all data in the database
const destroyData = async () => {
  try {
    // Delete all documents from the collections
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error("You made a mistake");
    process.exit(1);
  }
};

// Check command line argument to determine whether to import or destroy data
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
