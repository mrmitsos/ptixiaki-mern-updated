import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Form,
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
} from "react-bootstrap";
import Rating from "../components/Rating";
//import axios from "axios";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart } from "../slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Meta from "../components/Meta";

const ProductScreen = () => {
  // Παίρνουμε το id του προϊόντος από το URL μέσω useParams
  const { id: productId } = useParams();

  // Λήψη dispatch για αποστολή ενεργειών στο Redux store
  const dispatch = useDispatch();

  // Λήψη navigate για προγραμματισμένη αλλαγή σελίδας
  const navigate = useNavigate();

  // Τοπική κατάσταση για την ποσότητα που επιλέγει ο χρήστης
  const [qty, setQty] = useState(1);

  // Τοπική κατάσταση για την βαθμολογία που δίνει ο χρήστης στην κριτική
  const [rating, setRating] = useState(0);

  // Τοπική κατάσταση για το κείμενο της κριτικής
  const [comment, setComment] = useState("");

  // Χρήση RTK Query για λήψη λεπτομερειών προϊόντος από το API
  const {
    data: product, // Ονομάζουμε τα δεδομένα "product"
    isLoading, // Αν φορτώνει τα δεδομένα
    refetch, // Συνάρτηση για να ξαναφορτώσουμε τα δεδομένα
    error, // Τυχόν σφάλμα κατά τη φόρτωση
  } = useGetProductDetailsQuery(productId);

  // Mutation για δημιουργία νέας κριτικής
  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  // Παίρνουμε το χρήστη από το Redux state
  const { userInfo } = useSelector((state) => state.auth);

  // Συνάρτηση που προσθέτει το προϊόν στο καλάθι με την επιλεγμένη ποσότητα
  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart"); // Πηγαίνει στη σελίδα καλαθιού μετά την προσθήκη
  };

  // Συνάρτηση υποβολής κριτικής
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      // Δημιουργεί την κριτική μέσω API
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch(); // Ξαναφορτώνει τις λεπτομέρειες του προϊόντος (και τις κριτικές)
      toast.success("Review Submitted"); // Ενημέρωση επιτυχίας
      setRating(0); // Καθαρίζει τη φόρμα κριτικής
      setComment("");
    } catch (error) {
      // Εμφάνιση λάθους σε περίπτωση αποτυχίας
      toast.error(error?.data?.message || error.error);
    }
  };

  /*
  // Παλιός κώδικας με χρήση axios και useEffect (δεν χρησιμοποιείται πλέον)
  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${productId}`);
      setProduct(data);
    };
    fetchProduct();
  }, [productId]);
  */

  return (
    <>
      {/* Κουμπί επιστροφής στην αρχική */}
      <Link className="btn btn-outline-secondary mb-4" to="/">
        &larr; Go Back
      </Link>

      {/* Αν φορτώνει δείχνει Loader, αν υπάρχει λάθος μήνυμα, αλλιώς το προϊόν */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          {/* Δυναμικός τίτλος σελίδας */}
          <Meta title={product.name} />
          <Row className="my-4">
            {/* Εικόνα προϊόντος */}
            <Col md={5}>
              <Image
                src={product.image}
                alt={product.name}
                fluid
                className="rounded shadow-sm"
              />
            </Col>

            {/* Πληροφορίες προϊόντος */}
            <Col md={4}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title as="h2" className="mb-3">
                    {product.name}
                  </Card.Title>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="pb-2">
                      {/* Εμφάνιση βαθμολογίας και αριθμού κριτικών */}
                      <Rating
                        value={product.rating}
                        text={`${product.numReviews} reviews`}
                      />
                    </ListGroup.Item>
                    <ListGroup.Item className="fs-5">
                      <strong>Price:</strong> ${product.price}
                    </ListGroup.Item>
                    <ListGroup.Item className="text-muted">
                      <strong>Description:</strong> {product.description}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            {/* Πάνελ αγοράς με επιλογή ποσότητας και κουμπί προσθήκης */}
            <Col md={3}>
              <Card className="shadow-sm border-0">
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row className="align-items-center">
                      <Col>Price:</Col>
                      <Col>
                        <span className="fw-bold text-success">
                          ${product.price}
                        </span>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row className="align-items-center">
                      <Col>Status:</Col>
                      <Col>
                        <span
                          className={`fw-semibold ${
                            product.countInStock > 0
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          {/* Εμφάνιση αν το προϊόν είναι διαθέσιμο ή όχι */}
                          {product.countInStock > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </span>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {/* Επιλογή ποσότητας μόνο αν υπάρχει στοκ */}
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>QTY</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {/* Δημιουργία επιλογών από 1 έως countInStock */}
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  {/* Κουμπί προσθήκης στο καλάθι */}
                  <ListGroup.Item>
                    <Button
                      className="w-100"
                      type="button"
                      variant="primary"
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Add to Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          {/* Ενότητα κριτικών */}
          <Row className="review">
            <Col md={6}>
              <h2>Reviews</h2>
              {/* Μήνυμα αν δεν υπάρχουν κριτικές */}
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant="flush">
                {/* Εμφάνιση κάθε κριτικής */}
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}

                {/* Φόρμα για να γράψει κριτική ο χρήστης */}
                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>
                  {loadingProductReview && <Loader />}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating" className="my-2">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment" className="my-2">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingProductReview}
                        type="submit"
                        variant="primary"
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    // Αν δεν είναι συνδεδεμένος ο χρήστης
                    <Message>
                      Please <Link to="/login">sign in</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
