// SidebarMenu.js
import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useError } from '../features/errors/ErrorContext';
import './SidebarMenu.css'; // Убедитесь, что CSS загружается

function SidebarMenu({ username }) {
  const navigate = useNavigate();
  const { error } = useError();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <Navbar bg="light" expand="md" className="d-flex justify-content-center sidebar-menu">
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ justifyContent: 'center' }} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Nav.Link href="/dashboard">{username}</Nav.Link>
            <Nav.Link href="/menu">Menu</Nav.Link>
            <Nav.Link href="/categories">Categories</Nav.Link>
            <Nav.Link href="/analytics">Analytics</Nav.Link>
            <Nav.Link href="/settings">Settings</Nav.Link>
            <NavDropdown.Divider />
            <Nav.Link onClick={handleLogout}>Log out</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
}

export default SidebarMenu;
