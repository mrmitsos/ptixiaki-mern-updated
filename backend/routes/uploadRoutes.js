import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

// Ρυθμίσεις αποθήκευσης αρχείων με multer
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Φάκελος όπου θα αποθηκεύονται τα αρχεία
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    // Όνομα αρχείου: πεδίο + timestamp + επέκταση αρχικού αρχείου
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Συνάρτηση για έλεγχο τύπου αρχείου (μόνο εικόνες jpg, jpeg, png)
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/; // Τύποι εικόνων που επιτρέπονται
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Έλεγχος επέκτασης
  const mimetype = filetypes.test(file.mimetype); // Έλεγχος τύπου MIME

  if (extname && mimetype) {
    return cb(null, true); // Επιτρέπεται το αρχείο
  } else {
    cb("Images only!"); // Απορρίπτεται αν δεν είναι εικόνα
  }
}

const upload = multer({
  storage,
  // Μπορείς να προσθέσεις εδώ τον έλεγχο τύπου με fileFilter: checkFileType
});

// Route για ανέβασμα μιας εικόνας
router.post("/", upload.single("image"), (req, res) => {
  res.send({
    message: "Image uploaded",
    image: `/${req.file.path}`, // Επιστρέφει το μονοπάτι της αποθηκευμένης εικόνας
  });
});

export default router;
