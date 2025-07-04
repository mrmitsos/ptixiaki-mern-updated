import React from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useEffect, useState } from "react";
import axios from "axios";

const HomeScreen = () => {
  // Declare state variable to hold the list of products
  const [products, setProducts] = useState([]);

  // useEffect runs once when the component is mounted (empty dependency array)
  useEffect(() => {
    // Define an asynchronous function to fetch products from the backend API
    const fetchProducts = async () => {
      // Make a GET request to the API and destructure the data from the response
      const { data } = await axios.get("/api/products");

      // Update the products state with the fetched data
      setProducts(data);
    };

    // Call the function to fetch products
    fetchProducts();
  }, []);

  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        {products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomeScreen;
