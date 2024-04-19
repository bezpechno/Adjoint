import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './SidebarMenu.css';

function SidebarMenu({ username }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Удалить токен из localStorage
    localStorage.removeItem('token');

    // Перенаправить пользователя на страницу входа
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="md" className="d-flex justify-content-center">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <div className="d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: '100vh' }}>
            <Nav.Link href="/dashboard">{username}</Nav.Link>
            <Nav.Link href="/menu">Menu</Nav.Link>
            <Nav.Link href="/categories">Categories</Nav.Link>
            <Nav.Link href="/analytics">Analytics</Nav.Link>
            <Nav.Link href="/Settings">Settings</Nav.Link>
            <NavDropdown.Divider />
            <Nav.Link onClick={handleLogout}>Log out</Nav.Link>
          </div>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default SidebarMenu;