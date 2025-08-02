// Middleware για διαχείριση αιτήματος που δεν βρέθηκε (404)
// Δημιουργεί ένα σφάλμα με μήνυμα που περιλαμβάνει το αρχικό URL που ζητήθηκε
const notFound = (req, res, next) => {
  const error = new Error(`Δεν βρέθηκε - ${req.originalUrl}`);
  res.status(404);
  next(error); // περνάει το σφάλμα στον επόμενο error handler
};

// Γενικός error handler middleware
const errorHandler = (err, req, res, next) => {
  // Αν δεν έχει ήδη οριστεί status code, βάζει 500 (εσωτερικό σφάλμα server)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Επιστρέφει το μήνυμα σφάλματος και, αν δεν είναι σε παραγωγή, και το stack trace
  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? "" : err.stack,
  });
};

export { notFound, errorHandler };
