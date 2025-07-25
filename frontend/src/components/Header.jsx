import React from "react";
import { Badge, Navbar, Nav, Container } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import logo from "../assets/logo.png";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector } from "react-redux";

const Header = () => {

  const { cartItems } = useSelector((state) => state.cart);

  return (
    <header>
      {/* hamburger button to allazoume sto expand gia othones*/}
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img src={logo} alt="applogo" height="50px" />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <LinkContainer to="/">
                <Nav.Link>
                  <FaShoppingCart /> Cart
                  {
                    cartItems.length > 0 && (
                      <Badge pill bg="success" style={{marginLeft: "5px"}}>
                        { cartItems.reduce((a, c) => a + c.qty, 0)}
                      </Badge>
                    )
                  }
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/">
                <Nav.Link>
                  <FaUser /> Sign In
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
