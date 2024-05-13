import { Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import '../../index.css';9
import Rutas from '../../routes';
import { useNavigate } from 'react-router-dom';
import CurrentNavigation from './navigation';
import AccountPopover from './account';
import AlertPopover from './alert';
import { Box, useMediaQuery } from '@mui/material';
import { items as options} from './options';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import UserInfo from './userInfo';
import AccountInfo from './accountInfo';
import { useAuth } from '../../authProvider';
import { SendOutlined, FileOutlined } from '@ant-design/icons';

const optionsEmpleado = [
  {
    key: '6',
    label: 'Ingresar solicitud',
    icon: <SendOutlined/>
  }
]

const optionsSuper = [
  {
    key: '5',
    label: 'Solicitudes',
    icon: <FileOutlined/>
  },
  {
    key: '6',
    label: 'Ingresar solicitud',
    icon: <SendOutlined/>
  }
]

const { Content, Sider } = Layout;

const Main: React.FC = () => { 

  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState<string>('white');
  const isSmallScreen = useMediaQuery('(max-width:1000px)');
  const [openInfo, setOpenInfo] = useState(false);
  const [open, setOpen] = useState(true);
  const { userRole } = useAuth();
  const [selectedKey, setSelectedKey] = useState<string>(() => {
    return localStorage.getItem('selectedKey') ?? '1';
  });

  const routeMap: Record<string, string> = {
    '1': '/dashboard',
    '2': '/panel-expedientes',
    '3': '/ausencias',
    '4': '/graficos',
    '5': '/solicitudes',
    '6': '/solicitud-form',
    '7': '/auditorias',
    '8': '/auditorias-login',
  };

  const handleMenuClick = (key: string) => {

    const route = routeMap[key];

    if (route) {
      navigate(route);
      isSmallScreen && setOpen(false);
      setSelectedKey(key);
      localStorage.setItem('selectedKey', key);
    }
  };

  useEffect(() => {
    
    const routeKeys = Object.keys(routeMap);
    const currentKey = routeKeys.find(key => routeMap[key] === location.pathname);

    if (currentKey && currentKey !== selectedKey) {
      setSelectedKey(currentKey);
      localStorage.setItem('selectedKey', currentKey); 
    }

  }, [location.pathname]);


  useEffect(() => {

    setOpen(!isSmallScreen);
    return () => setOpen(!isSmallScreen);
  }, [isSmallScreen]);

  const getItems = () => {
   return userRole === 'admin' ? options : (userRole === 'empleado' ? optionsEmpleado : optionsSuper);
  }
  

  useEffect(() => {
      const handleScroll = () => {
      const scrollTop = window.scrollY;
        // Cambia el estado dependiendo de si se ha hecho scroll o no
        setIsScrolled(scrollTop > 0);
      };
  
      // Agrega el evento de scroll al cargar el componente
      window.addEventListener('scroll', handleScroll);
  
      // Limpia el evento de scroll al desmontar el componente
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);

    useEffect(() => {
    // Set background color based on the current location
    const isDashboard = location.pathname === '/dashboard';
    setBackgroundColor(isDashboard ? '#f0f0f0' : 'white');
  }, [location.pathname]);

  
  return  (
      <Layout hasSider>
        <Sider
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: open? 0 : -250,
            top: 0,
            bottom: 0,
            zIndex: 2
          }}
          width={250}
        >
          {isSmallScreen ? (
            <Box color='white' p={2} >
                <MenuOpenIcon onClick={() => setOpen(false)} />
            </Box>
            ): null
          }          
          <UserInfo setOpenInfo={() => setOpenInfo(true)} />
          <AccountInfo open={openInfo} onClose={()=> setOpenInfo(false)} />
          <hr style={{ width: 200}} />

          <Menu 
            style={{marginTop: '3%'}} 
            theme='dark' mode="inline" 
            defaultSelectedKeys={[selectedKey]}
            onClick={({ key }) => handleMenuClick(key as string)}
            items={getItems()}
          />

        </Sider>
        <Layout  style={{ marginLeft: isSmallScreen ? 0 : 230,  backgroundColor }}>
          <Content style={{margin: '0px 16px ', overflow: 'initial' }}>
            <div style={{ 
                backgroundColor: 'transparent',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                padding: '10px',
                transition: 'background-color 0.3s ease-in-out', // Transición suave para el cambio de color
             }}>
              <div style={{ 
               height: '70px', 
               width: '100%',
               marginLeft: '10px',
               backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.8)' : 'white', 
               padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
               borderRadius: isScrolled ? '10px' : 'none', // Cambiar el borderRadius cuando está scroll
               boxShadow: isScrolled ? '2px 2px 5px black' : 'none', 
               backdropFilter: 'saturate(200%) blur(1.875rem)',
               
                }}>
              <div style={{ display: 'flex', gap: '1px', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                  {isSmallScreen && <MenuIcon sx={{margin: 2, cursor: 'pointer'}} onClick={()=> setOpen(true)} />} 
                  <CurrentNavigation />
                </div>
                <div style={{ display: 'flex', gap: '1px', justifyContent: 'flex-end', alignItems: 'flex-end',  }}>
                  <AlertPopover/>
                  <AccountPopover/>
                </div>
              </div>
            </div>
            <Box style={{ padding: 24, paddingLeft: 40, paddingTop: 0}}>
                <Rutas/>
            </Box>
          </Content>
        </Layout>
      </Layout>
    );
}

export default Main;

