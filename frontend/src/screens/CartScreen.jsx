import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../slices/cartSlice";

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Παίρνουμε το καλάθι από το Redux store
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // Προσθήκη ή αλλαγή ποσότητας προϊόντος στο καλάθι
  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  // Αφαίρεση προϊόντος από το καλάθι
  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  // Μετάβαση στη σελίδα checkout (πρώτα στο login, μετά στο shipping)
  const checkOutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: "20px" }}>Καλάθι Αγορών</h1>

        {/* Αν το καλάθι είναι άδειο, εμφανίζεται μήνυμα */}
        {cartItems.length === 0 ? (
          <Message>
            Το καλάθι είναι άδειο <Link to="/">Επιστροφή</Link>
          </Message>
        ) : (
          // Λίστα με τα προϊόντα του καλαθιού
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    {/* Επιλογή ποσότητας */}
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {/* Δημιουργούμε επιλογές από 1 έως το απόθεμα του προϊόντος */}
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    {/* Κουμπί διαγραφής προϊόντος από το καλάθι */}
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>

      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              {/* Υπολογισμός συνολικών προϊόντων και κόστους */}
              <h2>
                Σύνολο ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                προϊόντα
              </h2>
              ${" "}
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              {/* Κουμπί για να προχωρήσει στο checkout */}
              <Button
                type="button"
                className="btn-block"
                disabled={cartItems.length === 0}
                onClick={checkOutHandler}
              >
                Προχώρησε στην ολοκλήρωση αγοράς
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
