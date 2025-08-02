import React from "react";
import { useState, useEffect } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { useProfileMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
import { FaTimes } from "react-icons/fa";

const ProfileScreen = () => {
  // Τοπική κατάσταση για τα πεδία της φόρμας προφίλ
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Το dispatch του Redux για αποστολή ενεργειών
  const dispatch = useDispatch();

  // Λήψη του userInfo από το Redux state (τα στοιχεία του χρήστη)
  const { userInfo } = useSelector((state) => state.auth);

  // RTK Query mutation για ενημέρωση προφίλ χρήστη
  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  // RTK Query για λήψη παραγγελιών του χρήστη
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  // useEffect που γεμίζει τα πεδία με τα τωρινά στοιχεία του χρήστη
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo, userInfo.name, userInfo.email]);

  // Συνάρτηση υποβολής της φόρμας προφίλ
  const submitHandler = async (e) => {
    e.preventDefault();

    // Έλεγχος αν τα password ταιριάζουν
    if (password !== confirmPassword) {
      toast.error("Password do not match");
    } else {
      try {
        // Καλεί το API για ενημέρωση προφίλ
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();

        // Ενημερώνει το Redux state με τα νέα στοιχεία του χρήστη
        dispatch(setCredentials(res));

        // Εμφανίζει μήνυμα επιτυχίας
        toast.success("Profile updated successfully");
      } catch (error) {
        // Εμφανίζει μήνυμα λάθους αν κάτι πάει στραβά
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <Row>
      {/* Αριστερή στήλη με τη φόρμα ενημέρωσης προφίλ */}
      <Col md={3}>
        <h2>User Profile</h2>
        <Form onSubmit={submitHandler}>
          {/* Όνομα χρήστη */}
          <Form.Group controlId="name" className="my-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          {/* Email χρήστη */}
          <Form.Group controlId="email" className="my-2">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          {/* Νέος κωδικός */}
          <Form.Group controlId="password" className="my-2">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          {/* Επιβεβαίωση κωδικού */}
          <Form.Group controlId="confirmPassword" className="my-2">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          {/* Κουμπί υποβολής φόρμας */}
          <Button type="submit" variant="primary" className="my-2">
            Update
          </Button>

          {/* Εμφάνιση loader αν φορτώνει η ενημέρωση */}
          {loadingUpdateProfile && <Loader />}
        </Form>
      </Col>

      {/* Δεξιά στήλη με πίνακα παραγγελιών του χρήστη */}
      <Col md={9}>
        <h2>My orders</h2>

        {/* Αν φορτώνει παραγγελίες */}
        {isLoading ? (
          <Loader />
        ) : error ? (
          // Αν υπάρχει σφάλμα στην φόρτωση παραγγελιών
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          // Πίνακας παραγγελιών
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERD</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* Χαρτογράφηση όλων των παραγγελιών */}
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>

                  {/* Εμφάνιση ημερομηνίας δημιουργίας (μόνο η πρώτη 10άδα χαρακτήρων, δηλαδή yyyy-mm-dd) */}
                  <td>{order.createdAt.substring(0, 10)}</td>

                  {/* Σύνολο παραγγελίας */}
                  <td>{order.totalPrice}</td>

                  {/* Αν η παραγγελία έχει πληρωθεί, εμφανίζει ημερομηνία, αλλιώς κόκστα κόκκινο Χ */}
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>

                  {/* Αν έχει παραδοθεί, εμφανίζει ημερομηνία, αλλιώς κόκκινο Χ */}
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>

                  {/* Κουμπί για μετάβαση στη σελίδα λεπτομερειών παραγγελίας */}
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className="btn-sm" variant="light">
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
