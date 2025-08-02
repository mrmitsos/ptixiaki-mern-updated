import React from "react";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      {/* Εμφάνιση του header σε όλες τις σελίδες */}
      <Header />

      {/* Κύριο περιεχόμενο της σελίδας με padding */}
      <main className="py-3">
        <Container>
          {/* Το Outlet αποδίδει το στοιχείο της διαδρομής που έχει καθοριστεί δυναμικά στο React Router */}
          <Outlet />
        </Container>
      </main>

      {/* Εμφάνιση του footer σε όλες τις σελίδες */}
      <Footer />

      {/* Εμφάνιση ειδοποιήσεων Toast */}
      <ToastContainer />
    </>
  );
}

export default App;
