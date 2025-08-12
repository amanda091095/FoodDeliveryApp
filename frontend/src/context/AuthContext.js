import { createContext, useContext, useEffect, useState } from 'react';
import api from '../axiosConfig'; // your axios instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const { data } = await api.get('/auth/profile');   // <-- must exist on backend
      setUser(data.user || data);                   // accept either shape
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload) => {
    // payload can be response.data from Login.jsx, or we can post here instead
    const token = payload.token;
    if (token) {
      localStorage.setItem('fd_token', token);      // axiosConfig reads this key
      await loadUser();                              // fetch and set the current user
    }
  };

  const logout = () => {
    localStorage.removeItem('fd_token');
    sessionStorage.removeItem('fd_token');
    setUser(null);
  };

  useEffect(() => {
    // on app start, if token exists, fetch user
    const t =
      localStorage.getItem('fd_token') ||
      sessionStorage.getItem('fd_token');
    if (t) loadUser();
    else setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
