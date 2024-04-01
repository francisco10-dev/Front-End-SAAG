import { Layout, Menu, Avatar } from 'antd';
import React, { useEffect, useState } from 'react';
import '../../index.css';9
import Rutas from '../../routes';
import { useNavigate } from 'react-router-dom';
import CurrentNavigation from './navigation';
import SettingPopover from './settings';
import AccountPopover from './account';
import AlertPopover from './alert';
import { useAuth } from '../../authProvider';
import { Box } from '@mui/material';
import { items as options} from './options';
import { UserOutlined } from '@ant-design/icons';


const { Content, Sider } = Layout;

const Main: React.FC = () => { 

  const {colaborador, userRole} = useAuth();
  const nombre = colaborador?.nombre.split(" ")[0];
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState<string>('white');

  const handleMenuClick = (key: string) => {
    // Define las rutas correspondientes para cada elemento del menú
    const routeMap: Record<string, string> = {
      '1': '/dashboard',
      '2': '/panel-expedientes',
      '3': '/ausencias',
      '4': '/solicitudes',
      '5': '/solicitud-form',
      '6': '/auditorias',
      '7': '/auditorias-login',
    };

    const route = routeMap[key];

    if (route) {
      navigate(route);
    }
  };

  useEffect(()=> {
    console.log(colaborador);
    navigate('/dashboard');
  },[]);


    
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
            left: 0,
            top: 0,
            bottom: 0,
          }}
          width={250}
        >
          
          <div style={{ display: 'flex', alignItems: 'center', padding: '15px', marginTop: 20 }}>
            <Avatar size={50} icon={<UserOutlined />} style={{ marginBottom: '8px', marginRight: 15 }}  />
          <div>
            <h4 style={{ margin: 0, color: '#fff' }}>{nombre}</h4>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>{userRole}</p>
          </div>
        </div>
          <hr style={{ width: 200}} />

          <Menu 
            style={{marginTop: '3%'}} 
            theme='dark' mode="inline" 
            defaultSelectedKeys={['1']}
            onClick={({ key }) => handleMenuClick(key as string)}
            items={options}
          />

        </Sider>
        <Layout  style={{ marginLeft: 210,  backgroundColor }}>
          <Content style={{margin: '0px 16px 0', overflow: 'initial' }}>
            <div style={{ 
                backgroundColor: 'transparent',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                padding: '30px',
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
                  <CurrentNavigation />
                </div>
                <div style={{ display: 'flex', gap: '1px', justifyContent: 'flex-end', alignItems: 'flex-end',  }}>
                  <SettingPopover/>
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

