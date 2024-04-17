import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CheckIcon from '@mui/icons-material/Check'

import TabsSolicitudAdmin from "../../teams/tabsTeam";
import '../styles/styles.css'

function Teams() {
  const [menu, setMenu] = useState<null | HTMLElement>(null);

  const openMenu = ({ currentTarget }: React.MouseEvent<HTMLElement>) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={closeMenu}>Action</MenuItem>
      <MenuItem onClick={closeMenu}>Another action</MenuItem>
      <MenuItem onClick={closeMenu}>Something else</MenuItem>
    </Menu>
  );

  return (
    <Card className="custom-card">
      <Box display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Teams
          </Typography>
          <Box display="flex" alignItems="center" lineHeight={0}>
            <Icon
              sx={{
                fontWeight: "bold",
                color: ({ palette: { info } }) => info.main,
                mt: -0.5,
              }}
            >
              <CheckIcon/>
            </Icon>
            <Typography variant="button" fontWeight="regular" color="text">
              &nbsp;<strong>30 done</strong> this month
            </Typography>
          </Box>
        </Box>
        <Box color="text" px={2}>
          <Icon sx={{ mt: 2, cursor: "pointer", fontWeight: "bold", fontSize: "large" }} onClick={openMenu}>
            <MoreVertIcon />
          </Icon>
        </Box>
        {renderMenu}
      </Box>
      <Box>
          <TabsSolicitudAdmin></TabsSolicitudAdmin>
     
      </Box>
    </Card>
  );
}

export default Teams;
