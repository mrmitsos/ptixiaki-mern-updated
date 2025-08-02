import mongoose from "mongoose";
import dotenv from "dotenv";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";

// Φορτώνει τις μεταβλητές περιβάλλοντος από το .env αρχείο
dotenv.config();

// Σύνδεση στη βάση δεδομένων
connectDB();

// Συνάρτηση εισαγωγής δεδομένων στη βάση
const importData = async () => {
  try {
    // Διαγραφή όλων των υπαρχόντων εγγραφών στις συλλογές
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Εισαγωγή χρηστών από το αρχείο data/users.js
    const createdUsers = await User.insertMany(users);

    // Λήψη του ID του πρώτου χρήστη (υποτίθεται ότι είναι διαχειριστής)
    const adminUser = createdUsers[0]._id;

    // Συσχέτιση του admin χρήστη με κάθε προϊόν
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    // Εισαγωγή προϊόντων στη βάση δεδομένων
    await Product.insertMany(sampleProducts);

    console.log("Data Imported!");
    process.exit(); // Τερματισμός της διεργασίας με επιτυχία
  } catch (error) {
    console.error("You made a mistake");
    process.exit(1); // Τερματισμός με αποτυχία
  }
};

// Συνάρτηση διαγραφής όλων των δεδομένων από τη βάση
const destroyData = async () => {
  try {
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

// Εκτέλεση της κατάλληλης συνάρτησης ανάλογα με την εντολή (π.χ., node seeder -d)
if (process.argv[2] === "-d") {
  destroyData(); // Διαγραφή
} else {
  importData(); // Εισαγωγή
}
