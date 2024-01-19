import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/dashboard/dashboard';
import TabsSolicitudAdmin from './components/solicitudes/tabsSolictud';
import TabsAusenciaAdmin from './components/ausencias/tabsAusencia';
import TabsAuditoriaLogin from './components/auditorias-login/tabsAuditoriaLogin';
import TabsAuditoria from './components/auditorias/tabsAuditoria';
import ProtectedRoute from './protectedRoute';
import { useAuth } from './authProvider'; 
import Administrador from './components/dashboardAdmin/admin';

const Rutas = () => {
    const { loggedIn, userRole } = useAuth();
    
    return (
        <Routes>
            <Route path="/" element={<ProtectedRoute element={<Dashboard />} isAuthenticated={loggedIn }/>} />
            <Route path="/solicitudes" element={<ProtectedRoute element={<TabsSolicitudAdmin />} isAuthenticated={loggedIn && userRole === 'admin'}  />} />
            <Route path="/ausencias" element={<ProtectedRoute element={<TabsAusenciaAdmin />} isAuthenticated={loggedIn  && userRole === 'admin'} />} />
            <Route path="/administrador" element={<ProtectedRoute element={<Administrador/>} isAuthenticated={loggedIn  && userRole === 'admin'} />}/>
            <Route path="/auditorias" element={<ProtectedRoute element={<TabsAuditoria/>} isAuthenticated={loggedIn  && userRole === 'admin'} />}/>
            <Route path="/auditorias-login" element={<ProtectedRoute element={<TabsAuditoriaLogin/>} isAuthenticated={loggedIn  && userRole === 'admin'} />}/>
        </Routes>
    );
};

export default Rutas;