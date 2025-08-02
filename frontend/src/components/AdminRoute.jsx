import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  // Παίρνει το userInfo από το state του Redux (auth slice)
  const { userInfo } = useSelector((state) => state.auth);

  // Αν υπάρχει χρήστης και είναι admin, εμφανίζει το περιεχόμενο που βρίσκεται μέσα στη διαδρομή (Outlet)
  // Διαφορετικά, ανακατευθύνει τον χρήστη στη σελίδα login
  return userInfo && userInfo.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoute;
