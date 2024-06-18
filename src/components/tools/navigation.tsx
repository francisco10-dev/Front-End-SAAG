import { Breadcrumbs, Link, Typography } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import { useAuth } from "../../authProvider";

import { useLocation } from "react-router-dom";
import { useEffect } from "react";


function CurrentNavigation() {
    const location = useLocation();
    const {userRole} = useAuth();

    useEffect(() => {
      console.log(location.pathname);
    },[location]);

    const paths: { [key: string]: string } = {
      "/dashboard": "Dashboard",
      "/solicitudes": "Solicitudes",
      "/solicitud-form": "Ingresar Solicitud",
      "/ausencias": "Ausencias",
      "/graficos": "Gráficos",
      "/mi-informacion": "Mi Información",
      "/administrador": "Administración de usuarios",
      "/auditorias": "Actividad",
      "/auditorias-login": "Sesiones",
      "/panel-expedientes": "Colaboradores"
    };
  
    const getPathName = (path: string): string | undefined => paths[path];

  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb" sx={{ color: 'grey'}}>
        {userRole === 'admin' && (
          <Link href="/dashboard" color="inherit">
            <HomeIcon sx={{paddingBottom: '3px'}} />
          </Link>
        )}
        <Typography sx={{ color: 'grey'}} color="textPrimary">{getPathName(location.pathname)}</Typography>
      </Breadcrumbs>
      <Typography variant="h6" fontWeight="bold">{getPathName(location.pathname)}</Typography>
    </div>
  );
}


// Exportar el componente CurrentNavigation
export default CurrentNavigation;
