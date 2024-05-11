import { Breadcrumbs, Link, Typography } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import { useAuth } from "../../authProvider";

import { useLocation } from "react-router-dom";

function capitalizeFirstLetter(string:any) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function CurrentNavigation() {
    const location = useLocation();
    const {userRole} = useAuth();

  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb" sx={{ color: 'grey'}}>
        {userRole === 'admin' && (
          <Link href="/dashboard" color="inherit">
            <HomeIcon sx={{paddingBottom: '3px'}} />
          </Link>
        )}
        <Typography sx={{ color: 'grey'}} color="textPrimary">{capitalizeFirstLetter(location.pathname.substring(1))}</Typography>
      </Breadcrumbs>
      <Typography variant="h6" fontWeight="bold">{capitalizeFirstLetter(location.pathname.substring(1))}</Typography>
    </div>
  );
}


// Exportar el componente CurrentNavigation
export default CurrentNavigation;
