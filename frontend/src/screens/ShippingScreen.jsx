import React from "react";
import { useState } from "react";
import { Button, Form, FormGroup, FormLabel } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import { saveShippingAddress } from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";

const ShippingScreen = () => {
  // Παίρνουμε το cart state από το Redux store
  const cart = useSelector((state) => state.cart);
  // Απομονώνουμε τη διεύθυνση αποστολής από το cart (αν υπάρχει)
  const { shippingAddress } = cart;

  // Καταστάσεις για κάθε πεδίο φόρμας με αρχική τιμή από το shippingAddress (αν υπάρχει)
  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress?.country || "");

  // Hook για πλοήγηση σε άλλη σελίδα
  const navigate = useNavigate();

  // Hook για dispatch ενεργειών στο Redux store
  const dispatch = useDispatch();

  // Χειριστής υποβολής φόρμας
  const submitHandler = (e) => {
    e.preventDefault();

    // Αποθηκεύουμε τη διεύθυνση αποστολής στο Redux store
    dispatch(saveShippingAddress({ address, city, postalCode, country }));

    // Μετάβαση στη σελίδα πληρωμής
    navigate("/payment");
  };

  return (
    <FormContainer>
      {/* Βήματα checkout (προβολή προόδου) με ενεργοποίηση step1 και step2 */}
      <CheckoutSteps step1 step2 />

      <h1>Shipping</h1>

      {/* Φόρμα διεύθυνσης αποστολής */}
      <Form onSubmit={submitHandler}>
        {/* Πεδία φόρμας για κάθε στοιχείο διεύθυνσης */}

        <FormGroup controlId="address" className="my-2">
          <FormLabel>Address</FormLabel>
          <Form.Control
            type="text"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)} // Ενημέρωση κατάστασης
          ></Form.Control>
        </FormGroup>

        <FormGroup controlId="city" className="my-2">
          <FormLabel>City</FormLabel>
          <Form.Control
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)} // Ενημέρωση κατάστασης
          ></Form.Control>
        </FormGroup>

        <FormGroup controlId="postalCode" className="my-2">
          <FormLabel>Postal code</FormLabel>
          <Form.Control
            type="text"
            placeholder="Enter postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)} // Ενημέρωση κατάστασης
          ></Form.Control>
        </FormGroup>

        <FormGroup controlId="country" className="my-2">
          <FormLabel>Country</FormLabel>
          <Form.Control
            type="text"
            placeholder="Enter country"
            value={country}
            onChange={(e) => setCountry(e.target.value)} // Ενημέρωση κατάστασης
          ></Form.Control>
        </FormGroup>

        {/* Κουμπί υποβολής φόρμας */}
        <Button type="submit" variant="primary" className="my-2">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
