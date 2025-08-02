import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../../slices/productsApiSlice";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Paginate from "../../components/Paginate";

const ProductListScreen = () => {
  const { pageNumber } = useParams(); // Παίρνουμε τον αριθμό σελίδας από το URL (προαιρετικό)

  // Κλήση API για φόρτωση λίστας προϊόντων με βάση την σελίδα
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  // Mutation για δημιουργία νέου προϊόντος
  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  // Mutation για διαγραφή προϊόντος
  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  // Συνάρτηση διαγραφής προϊόντος με επιβεβαίωση
  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteProduct(id);
        toast.success("Product deleted"); // Μήνυμα επιτυχίας
        refetch(); // Ενημέρωση λίστας προϊόντων
      } catch (error) {
        toast.error(error?.data?.message || error.error); // Εμφάνιση λάθους
      }
    }
  };

  // Συνάρτηση δημιουργίας νέου προϊόντος με επιβεβαίωση
  const createProductHandler = async () => {
    if (window.confirm("Are you sure you want to create a new product?")) {
      try {
        await createProduct();
        refetch(); // Ενημέρωση λίστας προϊόντων
      } catch (error) {
        toast.error(error?.data?.message || error.error); // Εμφάνιση λάθους
      }
    }
  };

  return (
    <>
      <Row>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          {/* Κουμπί για δημιουργία νέου προϊόντος */}
          <Button className="btn-sm m-3" onClick={createProductHandler}>
            <FaEdit /> Create Product
          </Button>
        </Col>
      </Row>

      {/* Εμφάνιση loader αν δημιουργείται ή διαγράφεται προϊόν */}
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}

      {/* Εμφάνιση loader, λάθους ή πίνακα προϊόντων ανάλογα με το status */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {/* Πίνακας με τα προϊόντα */}
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>{" "}
                {/* Κενό κελί για τα κουμπιά Επεξεργασίας και Διαγραφής */}
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    {/* Κουμπί επεξεργασίας που οδηγεί στη σελίδα επεξεργασίας */}
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </LinkContainer>

                    {/* Κουμπί διαγραφής προϊόντος */}
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Συστατικό για σελιδοποίηση (pagination) */}
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
