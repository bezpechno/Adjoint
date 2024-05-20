import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function useUserAuthentication() {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');
    console.log(tokenFromStorage);
    if (!tokenFromStorage) {
      navigate('/login');
    } else {
      setToken(tokenFromStorage);
      axios.get('http://localhost:5000/api/dashboard/', {
        headers: {
          'Authorization': `Bearer ${tokenFromStorage}`
        }
      })
      .then(response => {
        setUsername(response.data.username);
      })
      .catch(error => {
        console.error(error); 
      });
    }
  }, [navigate]);

  return { username, token };
}