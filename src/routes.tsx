import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/dashboard/dashboard';
import TabsSolicitudAdmin from './components/solicitudes/tabsSolictud';
import TabsAusenciaAdmin from './components/ausencias/tabsAusencia';
import TabsAusenciaGraficoAdmin from './components/ausencias/graphic/tabsAusenciaGrafioAdmin';
import TabsAuditoriaLogin from './components/auditorias-login/tabsAuditoriaLogin';
import TabsAuditoria from './components/auditorias/tabsAuditoria';
import ProtectedRoute from './protectedRoute';
import Form from './components/solicitud-empleado/form';
import { useAuth } from './authProvider'; 
import Administrador from './components/dashboardAdmin/admin';
import Panel from './components/expedientes/panel';
import Info from './components/informacionEmpleado/info';

const Rutas = () => {
    const { loggedIn, userRole } = useAuth();
    
    return (
        <Routes>
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} isAuthenticated={loggedIn }/>} />
            <Route path="/solicitudes" element={<ProtectedRoute element={<TabsSolicitudAdmin />} isAuthenticated={loggedIn && userRole === 'admin'||userRole==='supervisor'}  />} />
            <Route path="/solicitud-form" element={<ProtectedRoute element={<Form />} isAuthenticated={loggedIn}  />} />
            <Route path="/ausencias" element={<ProtectedRoute element={<TabsAusenciaAdmin />} isAuthenticated={loggedIn  && userRole === 'admin'} />} />
            <Route path="/graficos" element={<ProtectedRoute element={<TabsAusenciaGraficoAdmin />} isAuthenticated={loggedIn  && userRole === 'admin'} />} />
            <Route path="/mi-informacion" element={<ProtectedRoute element={<Info/>} isAuthenticated={loggedIn} />}/>
            <Route path="/administrador" element={<ProtectedRoute element={<Administrador/>} isAuthenticated={loggedIn  && userRole === 'admin'} />}/>
            <Route path="/auditorias" element={<ProtectedRoute element={<TabsAuditoria/>} isAuthenticated={loggedIn  && userRole === 'admin'} />}/>
            <Route path="/auditorias-login" element={<ProtectedRoute element={<TabsAuditoriaLogin/>} isAuthenticated={loggedIn  && userRole === 'admin'} />}/>
            <Route path="/panel-expedientes" element={<ProtectedRoute element={<Panel/>} isAuthenticated={loggedIn  && userRole === 'admin'} />}/>
        </Routes>
    );
};

export default Rutas;