import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const RegisterScreen = () => {
  // Τοπική κατάσταση για τα πεδία της φόρμας εγγραφής
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Redux dispatch για αποστολή ενεργειών
  const dispatch = useDispatch();

  // React Router hook για πλοήγηση μεταξύ σελίδων
  const navigate = useNavigate();

  // RTK Query mutation για εγγραφή χρήστη
  const [register, { isLoading }] = useRegisterMutation();

  // Λήψη των στοιχείων χρήστη από το Redux store (αν είναι ήδη logged in)
  const { userInfo } = useSelector((state) => state.auth);

  // Απόκτηση των παραμέτρων URL (query params) από την τοποθεσία
  const { search } = useLocation();

  // Μετατροπή των παραμέτρων σε αντικείμενο για εύκολη πρόσβαση
  const sp = new URLSearchParams(search);

  // Παίρνουμε την παράμετρο "redirect", αν υπάρχει, αλλιώς "/"
  const redirect = sp.get("redirect") || "/";

  // useEffect που τρέχει όταν αλλάζει το userInfo
  // Αν ο χρήστης είναι ήδη συνδεδεμένος, γίνεται αυτόματη πλοήγηση στο redirect URL
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  // Συνάρτηση χειρισμού υποβολής της φόρμας
  const submitHandler = async (e) => {
    e.preventDefault();

    // Έλεγχος αν τα password ταιριάζουν
    if (password !== confirmPassword) {
      toast.error("Passwords dont match");
      return; // Διακόπτουμε αν δεν ταιριάζουν
    } else {
      try {
        // Καλούμε το API για εγγραφή χρήστη, στέλνοντας τα στοιχεία
        const res = await register({ name, email, password }).unwrap();

        // Αποθηκεύουμε τα credentials στο Redux store (συνδεδεμένος χρήστης)
        dispatch(setCredentials({ ...res }));

        // Μετάβαση στη σελίδα redirect μετά την επιτυχή εγγραφή
        navigate(redirect);
      } catch (error) {
        // Εμφάνιση λάθους σε περίπτωση αποτυχίας εγγραφής
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <FormContainer>
      <h1>Sign Up</h1>

      <Form onSubmit={submitHandler}>
        {/* Πεδίο για το όνομα */}
        <Form.Group controlId="name" className="my-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        {/* Πεδίο για το email */}
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        {/* Πεδίο για το password */}
        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        {/* Πεδίο για επιβεβαίωση password */}
        <Form.Group controlId="confrimPassword" className="my-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confrim password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        {/* Κουμπί εγγραφής, απενεργοποιείται όταν φορτώνει */}
        <Button
          type="submit"
          variant="primary"
          className="mt-2"
          disabled={isLoading}
        >
          Register
        </Button>

        {/* Εμφάνιση loader κατά τη διάρκεια εγγραφής */}
        {isLoading && <Loader />}
      </Form>

      {/* Σύνδεσμος για μετάβαση στη σελίδα σύνδεσης */}
      <Row className="py-3">
        <Col>
          Already have an account?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
