import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './app/LandingPage';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Dashboard from './app/Dashboard';
import Analytics from './app/Analytics';
import Categories from './app/Categories';
import Menu from './app/Menu';
import Settings from './app/Settings';
import MenuApp from './app/MenuApp';
import { ErrorProvider } from './features/errors/ErrorContext';
import { useAxiosInterceptor } from './api';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const InterceptorSetup = ({ children }) => {
  useAxiosInterceptor();
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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/m/:username" element={<MenuApp />} />
              <Route path="*" element={<Navigate to="/" />} /> 
              <Route path="/m/*" element={<Navigate to="/" />} /> 
            </Routes>
          </div>
        </InterceptorSetup>
      </Router>
    </ErrorProvider>
  );
}

export default App;
