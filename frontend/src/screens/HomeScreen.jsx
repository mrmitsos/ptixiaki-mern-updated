import React from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
// import { useEffect, useState } from "react";
// import axios from "axios";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useParams, Link } from "react-router-dom";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";

const HomeScreen = () => {
  // Declare state variable to hold the list of products
  // const [products, setProducts] = useState([]);

  /* // useEffect runs once when the component is mounted (empty dependency array)
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
  */

  // Παίρνουμε τις παραμέτρους από το url (λέξη κλειδί αναζήτησης και αριθμός σελίδας)
  const { keyword, pageNumber } = useParams();

  // Κάνουμε αίτημα για τα προϊόντα, με τα φίλτρα keyword και pageNumber
  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      {/* Αν δεν υπάρχει λέξη αναζήτησης, δείχνουμε το καρουζέ προϊόντων */}
      {!keyword ? (
        <ProductCarousel />
      ) : (
        // Αν υπάρχει λέξη αναζήτησης, δείχνουμε κουμπί επιστροφής στην αρχική
        <Link to="/" className="btn btn-light mb-4">
          Επιστροφή
        </Link>
      )}

      {/* Αν φορτώνει, δείχνουμε το Loader */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        // Αν υπάρχει σφάλμα, εμφανίζουμε μήνυμα λάθους
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h1>Τελευταία Προϊόντα</h1>
          <Row>
            {/* Χαρτογραφούμε τα προϊόντα και τα εμφανίζουμε */}
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          {/* Στοιχειοθέτηση σελίδων */}
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
