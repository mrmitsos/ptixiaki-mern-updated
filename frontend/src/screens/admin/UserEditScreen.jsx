import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useUpdateUserMutation,
  useGetUserDetailsQuery,
} from "../../slices/usersApiSlice";

const UserEditScreen = () => {
  const { id: userId } = useParams(); // Παίρνουμε το userId από το URL

  // Τοπικό state για τα πεδία της φόρμας
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Κάνουμε fetch τα στοιχεία του χρήστη μέσω RTK Query
  const {
    data: user,
    isLoading,
    refetch,
    error,
  } = useGetUserDetailsQuery(userId);

  // Mutation για ενημέρωση χρήστη
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  // Όταν φορτωθούν τα δεδομένα του χρήστη, ενημερώνουμε τοπικό state
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  // Όταν ο χρήστης πατήσει submit στη φόρμα
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Καλούμε το mutation για ενημέρωση με τα δεδομένα της φόρμας
      await updateUser({ userId, name, email, isAdmin });
      toast.success("User updated successfully"); // Μήνυμα επιτυχίας
      refetch(); // Φρεσκάρισμα στοιχείων χρήστη
      navigate("/admin/userlist"); // Μεταφορά στη λίστα χρηστών
    } catch (error) {
      toast.error(error?.data?.message || error.error); // Εμφάνιση λάθους
    }
  };

  return (
    <>
      {/* Κουμπί για επιστροφή στη λίστα χρηστών */}
      <Link to="/admin/userlist" className="btn btn-light my3">
        Go Back
      </Link>

      {/* Κοντέινερ για το φόρμα */}
      <FormContainer>
        <h1>Edit User</h1>

        {/* Εμφάνιση loader όταν ενημερώνεται */}
        {loadingUpdate && <Loader />}

        {/* Εμφάνιση loader ή λάθους κατά το φόρτωμα */}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          // Φόρμα επεξεργασίας χρήστη
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="email" className="my-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="isAdmin" className="my-2">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="my-2">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
