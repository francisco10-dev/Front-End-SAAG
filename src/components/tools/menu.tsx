import * as React from 'react';
import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';


import Rutas from '../../routes';
import SideBar from '../sidebar/sideBar';
import AccountPopover from './account';

const drawerWidth = 240;



const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));


export default function MenuPanel() {
  
  const [open] = React.useState(false);
  const [ isOpen, setIsOpen ] = React.useState(false);
  const [isOpenState, setIsOpenState] = React.useState<Record<string, boolean>>(() => {
    const storedOpenState = localStorage.getItem('isOpenState');
    return storedOpenState ? JSON.parse(storedOpenState) : {};
  });

  const toggleSideBar = () => {
    setIsOpen(!isOpen);
  };

  const handleSidebar = () => {
    setIsOpen(true);
  };

  React.useEffect(() => {
    localStorage.setItem('isOpenState', JSON.stringify(isOpenState));
    
    return () =>{
      localStorage.removeItem('isOpenState');
    };
  }, [isOpenState]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{backgroundColor: 'rgb(27,61,81)'}} >
          <div className='button'  onClick={toggleSideBar}>
            {!isOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </div>
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SAAG
          </Typography>
          <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SAAG
          </Typography>
            <Box>
              <AccountPopover/>
            </Box>
        </Toolbar>
      </AppBar>
      <SideBar  isOpen={isOpen} isOpenState={isOpenState} setIsOpenState={setIsOpenState} handleSidebar={handleSidebar}/>
      <Box 
        component="main" 
        sx={{ flexGrow: 1, p: 3, 
        marginLeft: { xs: '0px', md: !isOpen ? '260px' : '95px'}, }} 
        className="main-content"
      >
        <DrawerHeader />
        <Rutas />
      </Box>
    </Box>
  );
}
