import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useApiData = (token) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const setLoading = useCallback((loading) => setIsLoading(loading), []);
  const setApiError = useCallback((err) => setError(err), []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/menu/', { headers: { 'Authorization': `Bearer ${token}` }});
      setData(response.data.menu ? JSON.parse(response.data.menu) : []);
    } catch (err) {
      setApiError('Failed to fetch menu data: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [token, setLoading, setApiError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, setData, setLoading, setApiError };
};

export default useApiData;
