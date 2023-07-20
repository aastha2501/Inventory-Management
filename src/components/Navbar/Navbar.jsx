import jwtDecode from 'jwt-decode';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate, Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
function NavBar() {
  const location = useLocation();
  const [token, setToken] = useState();
  const [role, setRole] = useState();
  const [userId, setUserId] = useState();
  const [click, setClick] = useState(false)

  const handleClick = () => {
    setClick(!click);
  }

  const navigate = useNavigate();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      setToken(token);
      const claims = jwtDecode(token);
      const role = claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      setRole(role);
      const userId = claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      setUserId(userId);
    }
  }, [])

  const handleLogout = () => {

    setRole("");
    axios
      .post("https://localhost:7270/logout", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }).then((response) => {
        localStorage.clear();
        console.log(response);
      }).catch((error) => {
        console.log(error);
      })
    navigate("/login");
  }

  const handleCreateInvoice = () => {
    navigate(`/invoice/${userId}`);
  }


  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home"> <i style={{ fontSize: "2.5rem" }} className="fa-solid fa-warehouse"></i> Inventory Management</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            {
              role == "User" ? <Nav className="me-auto">
                <Nav.Link href="/dashboard" active={location.pathname === '/dashboard'}>Products</Nav.Link>
                <Link className='nav-link' to={`/invoices/${userId}`}>Invoices</Link>

              </Nav> : role == "Admin" ? <Nav className="me-auto">
                <Nav.Link href="/dashboard">Products</Nav.Link>
                <Nav.Link href="/allOrders">Invoices</Nav.Link>

              </Nav> : <Nav className="me-auto"></Nav>
            }

            {token && role === "User" ? (
              <Nav>
                <button className='btn' style={{ color: 'white' }} onClick={handleCreateInvoice}><i className="fa-solid fa-cart-shopping"></i> Cart</button>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </Nav>
            ) : token && role === "Admin" ? (
              <Nav>
              <Nav.Link style={{ color: "white", fontWeight: "600"}}><i className="fa-solid fa-user"></i>  Admin</Nav.Link>
              <Nav.Link style={{ color: "white" }} onClick={handleLogout}>Logout</Nav.Link>
              </Nav>
            ) : (
              <Nav>
                <Nav.Link style={{ color: 'white' }} href="/login">Login</Nav.Link>
                <Nav.Link style={{ color: 'white' }} href="/signup">Signup</Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

    </>
  );
}

export default NavBar;