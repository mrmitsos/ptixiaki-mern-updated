import express from "express";
import dotenv from "dotenv";

// Φορτώνει τις μεταβλητές περιβάλλοντος στο process.env
dotenv.config();

import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import path from "path";

// Λήψη της πόρτας από το αρχείο περιβάλλοντος (.env)
const port = process.env.PORT;

// Σύνδεση στη MongoDB
connectDB();

// Δημιουργία instance της εφαρμογής Express
const app = express();

// Middleware για ανάλυση JSON σωμάτων αιτημάτων
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware για ανάγνωση των cookies
app.use(cookieParser());

// Απλή βασική διαδρομή για έλεγχο λειτουργίας του API
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Ρυθμίσεις routes για προϊόντα, χρήστες, παραγγελίες και αποστολές αρχείων
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

// Διαδρομή για λήψη των ρυθμίσεων του PayPal Client ID
app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

// Ορισμός του __dirname (τρέχων φάκελος) για χρήση με static αρχεία
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Middleware για περιπτώσεις που δεν βρέθηκε η διαδρομή
app.use(notFound);

// Middleware για κεντρικό χειρισμό σφαλμάτων
app.use(errorHandler);

// Εκκίνηση του διακομιστή και ακρόαση στην ορισμένη πόρτα
app.listen(port, () => console.log(`Server running on port ${port}`));
