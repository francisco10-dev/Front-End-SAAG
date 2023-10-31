import { Route, Routes } from 'react-router-dom';
import Prueba from './components/componenteDeEjemplo/prueba';
import Dashboard from './components/dashboard/dashboard';
import Solicitud from './components/solicitudes/solicitudesAdmin';
import ProtectedRoute from './protectedRoute';
import { useAuth } from './authProvider'; 
import Administrador from './components/dashboardAdmin/admin';
const Rutas = () => {
    const { loggedIn } = useAuth();
    return (
        <Routes>
            <Route path="/" element={<ProtectedRoute element={<Dashboard />} isAuthenticated={loggedIn} />} />
            <Route path="/prueba" element={<ProtectedRoute element={<Prueba />} isAuthenticated={loggedIn} />} />
            <Route path="/solicitudes" element={<ProtectedRoute element={<Solicitud />} isAuthenticated={loggedIn} />} />
            <Route path="/administrador" element={<ProtectedRoute element={<Administrador/>} isAuthenticated={loggedIn}/>}/>
        </Routes>
    );
};

export default Rutas;