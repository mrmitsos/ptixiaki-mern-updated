import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";

// Εδώ λαμβάνουμε το προϊόν ως prop
const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded">
      {/* Σύνδεσμος που οδηγεί στη σελίδα λεπτομερειών του προϊόντος */}
      <Link to={`/product/${product._id}`}>
        {/* Εικόνα προϊόντος */}
        <Card.Img src={product.image} variant="top" />
      </Link>

      <Card.Body>
        {/* Τίτλος προϊόντος με σύνδεσμο */}
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        {/* Αξιολόγηση προϊόντος */}
        <Card.Text as="div">
          <Rating
            value={product.rating} // Αξιολόγηση σε αστέρια
            text={`${product.numReviews} reviews`} // Αριθμός κριτικών
          />
        </Card.Text>

        {/* Τιμή προϊόντος */}
        <Card.Text as="h3">${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
