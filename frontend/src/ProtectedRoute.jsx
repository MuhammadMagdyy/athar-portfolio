import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthorized = localStorage.getItem('athar_access') === import.meta.env.VITE_ADMIN_KEY;

  if (!isAuthorized) {
    const input = prompt("Access Restricted. Enter Archive Key:");
    if (input === import.meta.env.VITE_ADMIN_KEY) {
      localStorage.setItem('athar_access', input);
      return children;
    }
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;