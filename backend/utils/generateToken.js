import jwt from "jsonwebtoken";

// Δημιουργεί JWT token και το αποθηκεύει ως cookie στον client
const generateToken = (res, userId) => {
  // Υπογραφή του JWT με το userId ως payload και μυστικό κλειδί από το περιβάλλον
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Ισχύει για 30 ημέρες
  });

  // Ορισμός του token ως HTTP-only cookie (μη προσβάσιμο από JavaScript στον client)
  res.cookie("jwt", token, {
    httpOnly: true, // Μόνο για HTTP, όχι JS
    secure: process.env.NODE_ENV !== "development", // Μόνο μέσω HTTPS εκτός αν είμαστε σε dev mode
    sameSite: "strict", // Αποτροπή αποστολής σε cross-site αιτήματα
    maxAge: 30 * 24 * 60 * 60 * 1000, // Διάρκεια ζωής cookie: 30 ημέρες
  });
};

export default generateToken;
