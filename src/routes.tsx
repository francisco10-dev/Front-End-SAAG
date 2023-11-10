import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/dashboard/dashboard';
import TabsSolicitudAdmin from './components/solicitudes/tabsSolictud';
import TabsAusenciaAdmin from './components/ausencias/tabsAusencia';
import ProtectedRoute from './protectedRoute';
import { useAuth } from './authProvider'; 
import Administrador from './components/dashboardAdmin/admin';
const Rutas = () => {
    const { loggedIn } = useAuth();
    return (
        <Routes>
            <Route path="/" element={<ProtectedRoute element={<Dashboard />} isAuthenticated={loggedIn} />} />
            <Route path="/solicitudes" element={<ProtectedRoute element={<TabsSolicitudAdmin />} isAuthenticated={loggedIn} />} />
            <Route path="/asuencias" element={<ProtectedRoute element={<TabsAusenciaAdmin />} isAuthenticated={loggedIn} />} />
            <Route path="/administrador" element={<ProtectedRoute element={<Administrador/>} isAuthenticated={loggedIn}/>}/>
        </Routes>
    );
};

export default Rutas;