import React from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { clearCartItems } from "../slices/cartSlice";
import Message from "../components/Message";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Παίρνουμε τα δεδομένα του καλαθιού από το Redux store
  const cart = useSelector((state) => state.cart);

  // Δημιουργία παραγγελίας μέσω API hook με κατάσταση φόρτωσης και λάθους
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  // Έλεγχος αν έχει οριστεί διεύθυνση αποστολής και μέθοδος πληρωμής
  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping"); // Αν δεν υπάρχει διεύθυνση, πάμε στη σελίδα αποστολής
    } else if (!cart.paymentMethod) {
      navigate("/payment"); // Αν δεν υπάρχει μέθοδος πληρωμής, πάμε στη σελίδα πληρωμής
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  // Συνάρτηση χειρισμού τοποθέτησης παραγγελίας
  const placeOrderHandler = async () => {
    try {
      // Δημιουργία παραγγελίας στέλνοντας τα απαραίτητα δεδομένα
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap(); // unwrap για να πιάσουμε τα πραγματικά δεδομένα ή λάθη

      dispatch(clearCartItems()); // Καθαρισμός καλαθιού μετά την παραγγελία
      navigate(`/order/${res._id}`); // Ανακατεύθυνση στη σελίδα λεπτομερειών παραγγελίας
    } catch (error) {
      toast.error(error); // Εμφάνιση λάθους με toast notification
    }
  };

  return (
    <>
      {/* Βήματα ολοκλήρωσης παραγγελίας */}
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            {/* Ενότητα αποστολής */}
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            {/* Ενότητα μεθόδου πληρωμής */}
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            {/* Ενότητα προϊόντων παραγγελίας */}
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.lenth === 0 ? ( // Σφάλμα: lenth → length
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup.Item variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/products/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = $ {item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup.Item>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Περίληψη παραγγελίας και κουμπί επιβεβαίωσης */}
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* Εμφάνιση μηνύματος λάθους αν υπάρχει */}
              <ListGroup.Item>
                {error && (
                  <Message variant="danger">{error.data.message}</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                {/* Κουμπί τοποθέτησης παραγγελίας, απενεργοποιείται αν το καλάθι είναι άδειο */}
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
                {/* Εμφάνιση loader κατά τη φόρτωση */}
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
