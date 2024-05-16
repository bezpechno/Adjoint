// App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './app/LandingPage';
import MenuItems from './features/menuItems/menuItems'; // Adjusted
import Login from './features/auth/Login'; // Adjusted
import Register from './features/auth/Register'; // Adjusted
import Dashboard from './app/Dashboard';
import Analytics from './app/Analytics';
import Categories from './app/Categories';
import Menu from './app/Menu';
import Settings from './app/Settings';
import MenuApp from './app/MenuApp';
import { ErrorProvider } from './features/errors/ErrorContext'; // Add import for ErrorProvider
import { useAxiosInterceptor } from './api'; // Add import for useAxiosInterceptor
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Создаем компонент для использования интерсептора
const InterceptorSetup = ({ children }) => {
  useAxiosInterceptor(); // Здесь вызываем интерсептор
  return children;
};

function App() {
  return (
    <ErrorProvider>
      <Router>
        <InterceptorSetup>
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
              <Route path="/m/:username" element={<MenuApp />} />
              {/* Define more routes as needed */}
            </Routes>
          </div>
        </InterceptorSetup>
      </Router>
    </ErrorProvider>
  );
}

export default App;
