import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useUpdateProductMutation,
  useGetProductDetailsQuery,
  useUploadProductImageMutation,
} from "../../slices/productsApiSlice";

const ProductEditScreen = () => {
  const { id: productId } = useParams(); // Παίρνουμε το productId από το URL

  // Καταστάσεις για αποθήκευση των πεδίων της φόρμας
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(0);
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  // Κλήση στο API για λήψη λεπτομερειών προϊόντος
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);

  // Mutation για ενημέρωση προϊόντος
  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  // Mutation για ανέβασμα εικόνας προϊόντος
  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const navigate = useNavigate();

  // Όταν φορτώνει το προϊόν, ενημερώνουμε τα πεδία της φόρμας με τα δεδομένα
  useEffect(() => {
    if (product) {
      setName(product.name);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
      setImage(product.image);
      setPrice(product.price);
    }
  }, [product]);

  // Συνάρτηση υποβολής φόρμας για ενημέρωση προϊόντος
  const submitHandler = async (e) => {
    e.preventDefault();

    // Δημιουργία αντικειμένου με ενημερωμένα δεδομένα προϊόντος
    const updatedProduct = {
      productId,
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description,
    };

    // Κλήση του mutation για ενημέρωση και διαχείριση αποτελέσματος
    const result = await updateProduct(updatedProduct);
    if (result.error) {
      toast.error(result.error); // Εμφάνιση λάθους αν υπάρχει
    } else {
      toast.success("Product updated"); // Επιτυχής ενημέρωση
      navigate("/admin/productlist"); // Πλοήγηση στη λίστα προϊόντων διαχειριστή
    }
  };

  // Συνάρτηση για ανέβασμα αρχείου εικόνας
  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]); // Προσθήκη αρχείου στο FormData

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message); // Εμφάνιση επιτυχίας
      setImage(res.image); // Ενημέρωση πεδίου εικόνας με το νέο URL/μονοπάτι
    } catch (error) {
      toast.error(error?.data?.message || error.error); // Εμφάνιση λάθους
    }
  };

  return (
    <>
      {/* Κουμπί επιστροφής στη λίστα προϊόντων */}
      <Link to="/admin/productlist" className="btn btn-light my3">
        Go Back
      </Link>

      <FormContainer>
        <h1>Edit Product</h1>

        {/* Loader κατά την ενημέρωση */}
        {loadingUpdate && <Loader />}

        {/* Εμφάνιση loader ή λάθους ή φόρμας ανάλογα με την κατάσταση φόρτωσης */}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            {/* Πεδίο ονόματος */}
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            {/* Πεδίο τιμής */}
            <Form.Group controlId="price" className="my-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            {/* Εικόνα προϊόντος */}
            {loadingUpload && <Loader />}
            <Form.Group controlId="image" className="my-2">
              <Form.Label>Image</Form.Label>
              {/* Εισαγωγή URL εικόνας */}
              <Form.Control
                type="text"
                placeholder="Enter Image Url"
                value={image}
                onChange={(e) => setImage(e.target.value)} // Διόρθωση: έλειπε το (e) => setImage(e.target.value)
              ></Form.Control>
              {/* Ανεβάζουμε αρχείο εικόνας */}
              <Form.Control
                type="file"
                label="Choose file"
                onChange={uploadFileHandler}
              ></Form.Control>
            </Form.Group>

            {/* Πεδίο μάρκας */}
            <Form.Group controlId="brand" className="my-2">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            {/* Πεδίο απόθεματος */}
            <Form.Group controlId="countInStock" className="my-2">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter countInStock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            {/* Πεδίο κατηγορίας */}
            <Form.Group controlId="category" className="my-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            {/* Πεδίο περιγραφής */}
            <Form.Group controlId="description" className="my-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            {/* Κουμπί υποβολής */}
            <Button type="submit" variant="primary" className="my-2">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
