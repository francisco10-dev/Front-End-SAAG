import { Navigate } from 'react-router-dom';
import Dashboard from './components/dashboard/dashboard';


const ProtectedRoute: React.FC<{ element: React.ReactNode; isAuthenticated: boolean, isAdmin: string}> = ({ element, isAuthenticated, isAdmin}) => {

  if (!isAuthenticated){
    return <Navigate to="/" replace />
  }

  else if (isAdmin !== 'admin' && element !==  <Dashboard></Dashboard>){
    return <Navigate to="/" replace />;
  }
  else{
    return element;
  }

};

export default ProtectedRoute;