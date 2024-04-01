import { Breadcrumbs, Link, Typography } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';

import { useLocation } from "react-router-dom";

function capitalizeFirstLetter(string:any) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function CurrentNavigation() {
    const location = useLocation();

  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb" sx={{ color: 'grey'}}>
        <Link href="/dashboard" color="inherit">
          <HomeIcon sx={{paddingBottom: '3px'}} />
        </Link>
        <Typography sx={{ color: 'grey'}} color="textPrimary">{capitalizeFirstLetter(location.pathname.substring(1))}</Typography>
      </Breadcrumbs>
      <Typography variant="h6" fontWeight="bold">{capitalizeFirstLetter(location.pathname.substring(1))}</Typography>
    </div>
  );
}


// Exportar el componente CurrentNavigation
export default CurrentNavigation;
