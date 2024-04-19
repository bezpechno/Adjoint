import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import MenuItems from '../features/menuItems/menuItems'; // Adjusted
import Login from '../features/auth/Login'; // Adjusted
import Register from '../features/auth/Register'; // Adjusted
import Dashboard from './Dashboard';
import Analytics from './Analytics';
import Categories from './Categories';
import Menu from './Menu';
import Settings from './Settings';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} exact />
          <Route path="/menu-items" element={<MenuItems />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/menu" element={<Menu />} />
          {/* Define more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;