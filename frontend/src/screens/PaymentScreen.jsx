import React from "react";
import { useState, useEffect } from "react";
import { Form, Button, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import CheckotuSteps from "../components/CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { savePaymentMethod } from "../slices/cartSlice";

const PaymentScreen = () => {
  // Αρχικοποίηση state για τη μέθοδο πληρωμής με default τιμή "Paypal"
  const [paymentMethod, setPaymentMethod] = useState("Paypal");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Παίρνουμε τα δεδομένα του καλαθιού από το Redux store
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  // Αν δεν υπάρχει διεύθυνση αποστολής, ανακατευθύνουμε στη σελίδα αποστολής
  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  // Χειριστής υποβολής της φόρμας
  const submitHandler = (e) => {
    e.preventDefault(); // Αποτροπή default συμπεριφοράς φόρμας (ανανεώματος σελίδας)
    dispatch(savePaymentMethod(paymentMethod)); // Αποθήκευση της μεθόδου πληρωμής στο Redux store
    navigate("/placeorder"); // Ανακατεύθυνση στη σελίδα ολοκλήρωσης παραγγελίας
  };

  return (
    <FormContainer>
      {/* Βήματα checkout (step1, step2, step3 ενεργά) */}
      <CheckotuSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            {/* Επιλογή μεθόδου πληρωμής μέσω radio button */}
            <Form.Check
              type="radio"
              className="my-2"
              label="Paypal or Credit Card"
              id="Paypal"
              name="paymentMethod"
              value="Paypal"
              checked // Ενεργή επιλογή
              onChange={(e) => setPaymentMethod(e.target.value)} // Ενημέρωση state με επιλεγμένη μέθοδο
            ></Form.Check>
          </Col>
        </Form.Group>
        {/* Κουμπί υποβολής φόρμας */}
        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
