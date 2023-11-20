import { Navigate } from 'react-router-dom';

const ProtectedRoute: React.FC<{ element: React.ReactNode; isAuthenticated: boolean; }> = ({ element, isAuthenticated}) => {
   
  return isAuthenticated ? (  
    element
  ) : (
    <Navigate to="/" replace />
  );
}
export default ProtectedRoute;