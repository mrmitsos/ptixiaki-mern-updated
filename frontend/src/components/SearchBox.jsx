import React from "react";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams(); // Παίρνουμε το keyword από το URL (αν υπάρχει)
  const [keyword, setKeyword] = useState(urlKeyword || ""); // Αρχικό state από το URL ή κενό

  // Συνάρτηση που καλείται όταν υποβάλλεται η φόρμα αναζήτησης
  const submitHandler = (e) => {
    e.preventDefault(); // Αποφυγή επαναφόρτωσης σελίδας
    if (keyword.trim()) {
      setKeyword(""); // Καθαρίζουμε το πεδίο αναζήτησης μετά την υποβολή
      navigate(`/search/${keyword}`); // Πλοήγηση στη σελίδα με τα αποτελέσματα αναζήτησης
    } else {
      navigate("/"); // Αν το πεδίο είναι κενό, πάμε στην αρχική σελίδα
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex">
      {/* Πεδίο εισαγωγής κειμένου για την αναζήτηση */}
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)} // Ενημέρωση του state με το κείμενο που γράφει ο χρήστης
        value={keyword} // Τρέχουσα τιμή του πεδίου
        placeholder="Search products..." // Placeholder κειμένου
        className="mr-sm-2 ml-sm-5"
      ></Form.Control>

      {/* Κουμπί υποβολής αναζήτησης */}
      <Button type="submit" variant="outline-light" className="p-2 mx-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
