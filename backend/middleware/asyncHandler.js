// Συνάρτηση που βοηθάει στη διαχείριση ασύγχρονων συναρτήσεων (middleware)
// Παίρνει μια ασύγχρονη συνάρτηση και χειρίζεται αυτόματα τα λάθη με το catch
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
