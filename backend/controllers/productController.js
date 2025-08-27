import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// Λήψη όλων των προϊόντων με σελιδοποίηση και αναζήτηση
// GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT; // αριθμός προϊόντων ανά σελίδα
  const page = Number(req.query.pageNumber) || 1; // τρέχουσα σελίδα

  // Αν υπάρχει λέξη κλειδί αναζήτησης, δημιουργούμε regex για εύρεση στο όνομα προϊόντος
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  // Μετράμε πόσα προϊόντα υπάρχουν που πληρούν τα κριτήρια
  const count = await Product.countDocuments({ ...keyword });

  // Βρίσκουμε τα προϊόντα με όριο σελίδας και παράλειψη ανάλογα με τη σελίδα
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // Επιστρέφουμε τα προϊόντα μαζί με πληροφορίες για σελίδα και συνολικές σελίδες
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// Λήψη ενός προϊόντος με βάση το id
// GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error("Δεν βρέθηκε το προϊόν");
  }
});

// Δημιουργία νέου προϊόντος (με προεπιλεγμένα δείγματα)
// POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.png",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });

  // Αποθηκεύουμε το νέο προϊόν στη βάση δεδομένων
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// Ενημέρωση υπάρχοντος προϊόντος
// PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    // Ενημερώνουμε τα πεδία του προϊόντος με τα νέα δεδομένα
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    // Αποθηκεύουμε τις αλλαγές στη βάση
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Δεν βρέθηκε το προϊόν");
  }
});

// Διαγραφή προϊόντος
// DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ message: "Το προϊόν διαγράφηκε" });
  } else {
    res.status(404);
    throw new Error("Δεν βρέθηκε το προϊόν");
  }
});

// Δημιουργία νέας κριτικής για προϊόν
// POST /api/products/:id/reviews
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    // Ελέγχουμε αν ο χρήστης έχει ήδη κάνει κριτική σε αυτό το προϊόν
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Έχεις ήδη κάνει κριτική σε αυτό το προϊόν");
    }

    // Δημιουργούμε την κριτική
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    // Προσθέτουμε την κριτική στη λίστα κριτικών του προϊόντος
    product.reviews.push(review);

    // Ενημερώνουμε τον αριθμό κριτικών
    product.numReviews = product.reviews.length;

    // Υπολογίζουμε τον μέσο όρο αξιολόγησης (rating)
    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Η κριτική προστέθηκε" });
  } else {
    res.status(404);
    throw new Error("Δεν βρέθηκε το προϊόν");
  }
});

// Λήψη των κορυφαίων προϊόντων με βάση την αξιολόγηση
// GET /api/products/top
const getTopProducts = asyncHandler(async (req, res) => {
  // Βρίσκουμε τα 3 προϊόντα με την υψηλότερη βαθμολογία
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.status(200).json(products);
});

export {
  getProductById,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};
