import React from "react";
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    // Container για το navigation των βημάτων, κεντραρισμένο με margin κάτω
    <Nav className="justify-content-center mb-4">
      {/* Βήμα 1: Sign in */}
      <Nav.Item>
        {step1 ? (
          // Αν το step1 είναι ενεργό, το Link οδηγεί στη σελίδα login
          <LinkContainer to="/login">
            <Nav.Link>Sign in</Nav.Link>
          </LinkContainer>
        ) : (
          // Αν όχι, το link είναι απενεργοποιημένο
          <Nav.Link disabled>Sing in</Nav.Link>
        )}
      </Nav.Item>

      {/* Βήμα 2: Shipping */}
      <Nav.Item>
        {step2 ? (
          // Αν το step2 είναι ενεργό, οδηγεί στη σελίδα shipping
          <LinkContainer to="/shipping">
            <Nav.Link>Shipping</Nav.Link>
          </LinkContainer>
        ) : (
          // Αν όχι, απενεργοποιημένο
          <Nav.Link disabled>Shipping</Nav.Link>
        )}
      </Nav.Item>

      {/* Βήμα 3: Payment */}
      <Nav.Item>
        {step3 ? (
          // Αν το step3 είναι ενεργό, οδηγεί στη σελίδα payment
          <LinkContainer to="/payment">
            <Nav.Link>Payment</Nav.Link>
          </LinkContainer>
        ) : (
          // Απενεργοποιημένο αν το step3 δεν είναι ενεργό
          <Nav.Link disabled>Payment</Nav.Link>
        )}
      </Nav.Item>

      {/* Βήμα 4: Place Order */}
      <Nav.Item>
        {step4 ? (
          // Αν το step4 είναι ενεργό, οδηγεί στη σελίδα τοποθέτησης παραγγελίας
          <LinkContainer to="/placeorder">
            <Nav.Link>Place Order</Nav.Link>
          </LinkContainer>
        ) : (
          // Απενεργοποιημένο αν το step4 δεν είναι ενεργό
          <Nav.Link disabled>Place Order</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
