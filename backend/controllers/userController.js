import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
//import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

// Έλεγχος αυθεντικοποίησης χρήστη (login)
// POST auth/login
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  // Ελέγχουμε αν ο χρήστης υπάρχει και αν ο κωδικός είναι σωστός
  if (user && (await user.matchPassword(password))) {
    // Δημιουργούμε token και το στέλνουμε στο cookie
    generateToken(res, user._id);

    // Επιστρέφουμε βασικά στοιχεία χρήστη
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    // Σε περίπτωση λάθους στα στοιχεία
    res.status(401);
    throw new Error("Λάθος email ή κωδικός");
  }
});

// Εγγραφή νέου χρήστη
// POST user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Ελέγχουμε αν ο χρήστης υπάρχει ήδη
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Ο χρήστης υπάρχει ήδη");
  }

  // Δημιουργούμε νέο χρήστη
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    // Δημιουργούμε token μετά την επιτυχή εγγραφή
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Λάθος στα δεδομένα χρήστη");
  }
});

// Αποσύνδεση χρήστη και καθαρισμός cookie
// POST logout
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // Άμεση λήξη cookie
  });

  res.status(200).json({ message: "Αποσυνδεθήκατε επιτυχώς" });
});

// Λήψη προφίλ του τρέχοντος χρήστη
// GET profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("Δεν βρέθηκε ο χρήστης");
  }
});

// Ενημέρωση προφίλ χρήστη
// PUT profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Ενημερώνουμε όσα πεδία στάλθηκαν, αλλιώς κρατάμε τα παλιά
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Αν στάλθηκε νέο password, το ενημερώνουμε
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("Δεν βρέθηκε ο χρήστης");
  }
});

// Λήψη όλων των χρηστών (για admin)
// GET users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// Λήψη χρήστη με βάση το id
// GET users/:id
const getUserById = asyncHandler(async (req, res) => {
  // Επιλέγουμε όλα τα πεδία εκτός από το password
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("Δεν βρέθηκε ο χρήστης");
  }
});

// Διαγραφή χρήστη (εκτός admin)
// DELETE users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Δεν μπορεί να διαγραφεί admin");
    }
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: "Ο χρήστης διαγράφηκε επιτυχώς" });
  } else {
    res.status(404);
    throw new Error("Δεν βρέθηκε ο χρήστης");
  }
});

// Ενημέρωση χρήστη (για admin)
// PUT users/:id
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("Δεν βρέθηκε ο χρήστης");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
