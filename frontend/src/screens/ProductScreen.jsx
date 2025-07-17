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
import { useGetProductDetailsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart } from "../slices/cartSlice";
import { useDispatch } from "react-redux";

const ProductScreen = () => {
  //const [product, setProduct] = useState({});

  // bazw to id tou proiontos sto url me to Param pou einai apo to router
  const { id: productId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  /*// useEffect runs the code inside when the component mounts or when productId changes
  useEffect(() => {
    // Define an asynchronous function to fetch a single product by its ID
    const fetchProduct = async () => {
      // Make a GET request to the backend API with the specific product ID
      const { data } = await axios.get(`/api/products/${productId}`);

      // Update the product state with the fetched data
      setProduct(data);
    };

    // Call the function to actually fetch the product
    fetchProduct();

    // This effect will re-run any time productId changes
  }, [productId]);

  console.log(product);
  */

  //console.log([...Array(product.countInStock).keys()]);

  return (
    <>
      <Link className="btn btn-outline-secondary mb-4" to="/">
        &larr; Go Back
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Row className="gy-4">
          {/* Product Image */}
          <Col md={5}>
            <Image
              src={product.image}
              alt={product.name}
              fluid
              className="rounded shadow-sm"
            />
          </Col>

          {/* Product Info */}
          <Col md={4}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Card.Title as="h2" className="mb-3">
                  {product.name}
                </Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item className="pb-2">
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

          {/* Purchase Panel */}
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
                        {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </Col>
                  </Row>
                </ListGroup.Item>

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
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

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
      )}
    </>
  );
};

export default ProductScreen;
