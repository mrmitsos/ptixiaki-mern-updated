import mongoose from "mongoose";

/* async γιατί επιστρέφει ένα promise */
const connectDB = async () => {
  try {
    // Περιμένουμε να συνδεθεί με τη βάση δεδομένων χρησιμοποιώντας το URI από το περιβάλλον
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // Αν η σύνδεση πετύχει, εμφανίζουμε μήνυμα επιτυχίας με το host της σύνδεσης
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Αν υπάρξει σφάλμα κατά τη σύνδεση, το εμφανίζουμε και τερματίζουμε την εφαρμογή
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
