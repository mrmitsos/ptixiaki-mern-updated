import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import logo from "../assets/logo.png";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import SearchBox from "./SearchBox";
import { resetCart } from "../slices/cartSlice";

const Header = () => {
  // Παίρνουμε τα προϊόντα στο καλάθι από το redux store
  const { cartItems } = useSelector((state) => state.cart);
  // Παίρνουμε τα στοιχεία του χρήστη από το redux store
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Hook για το logout API call
  const [logoutApiCall] = useLogoutMutation();

  // Handler για το logout
  const logoutHandler = async () => {
    try {
      // Κάνουμε το API call για logout
      await logoutApiCall().unwrap();

      // Κάνουμε dispatch το logout action για να καθαρίσουμε το auth state
      dispatch(logout());

      // Κάνουμε dispatch το resetCart για να καθαρίσουμε το καλάθι αγορών
      dispatch(resetCart());

      // Μετάβαση στη σελίδα login
      navigate("/login");
    } catch (error) {
      // Εκτύπωση σφάλματος στην κονσόλα αν κάτι πάει στραβά
      console.log(error);
    }
  };

  return (
    <header>
      {/* Κύριο navbar με σκοτεινό φόντο και responsive συμπεριφορά */}
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          {/* Logo που οδηγεί στην αρχική σελίδα */}
          <LinkContainer to="/">
            <Navbar.Brand>
              <img src={logo} alt="applogo" height="50px" />
            </Navbar.Brand>
          </LinkContainer>

          {/* Κουμπί για άνοιγμα/κλείσιμο του navbar σε μικρές οθόνες */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          {/* Περιεχόμενο navbar που κρύβεται ή εμφανίζεται σε μικρές οθόνες */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {/* Σύνθετο κουτί αναζήτησης */}
              <SearchBox />

              {/* Link για το καλάθι αγορών */}
              <LinkContainer to="/cart">
                <Nav.Link>
                  <FaShoppingCart /> Cart
                  {/* Αν το καλάθι δεν είναι άδειο, εμφανίζουμε τον αριθμό προϊόντων */}
                  {cartItems.length > 0 && (
                    <Badge pill bg="success" style={{ marginLeft: "5px" }}>
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>

              {/* Αν ο χρήστης είναι συνδεδεμένος */}
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  {/* Σύνδεσμος για το προφίλ χρήστη */}
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>

                  {/* Κουμπί για αποσύνδεση */}
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                // Αν δεν είναι συνδεδεμένος, εμφάνιση link για σύνδεση
                <LinkContainer to="/login">
                  <Nav.Link>
                    <FaUser /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}

              {/* Αν ο χρήστης είναι διαχειριστής, εμφανίζουμε επιπλέον μενού admin */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu">
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
