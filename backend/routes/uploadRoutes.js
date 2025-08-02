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
function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/; // Τύποι εικόνων που επιτρέπονται
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/; // Έλεγχος τύπου MIME

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Έλεγχος επέκτασης
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true); // Επιτρέπεται το αρχείο
  } else {
    cb(new Error("Images only!"), false); // Απορρίπτεται αν δεν είναι εικόνα
  }
}

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

// Route για ανέβασμα μιας εικόνας
router.post("/", (req, res) => {
  uploadSingleImage(req, res, function (error) {
    if (error) {
      res.status(400).send({ message: error.message });
    }

    res.status(200).send({
      message: "Image uploaded successfully",
      image: `/${req.file.path}`,
    });
  });
});

/* OLD ONE
router.post("/", upload.single("image"), (req, res) => {
  res.send({
    message: "Image uploaded",
    image: `/${req.file.path}`, // Επιστρέφει το μονοπάτι της αποθηκευμένης εικόνας
  });
});
*/

export default router;
