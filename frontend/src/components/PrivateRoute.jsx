import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  // Παίρνουμε τα στοιχεία του χρήστη από το Redux store
  const { userInfo } = useSelector((state) => state.auth);

  // Αν υπάρχει userInfo (δηλαδή ο χρήστης είναι συνδεδεμένος), εμφανίζουμε τα υποστοιχεία (παιδιά routes)
  // Αλλιώς, κάνουμε ανακατεύθυνση στη σελίδα login
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
