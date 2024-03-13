import { Layout, Menu, Avatar } from 'antd';
import React, { useEffect } from 'react';
import '../../index.css';
import Rutas from '../../routes';
import { useNavigate } from 'react-router-dom';
import AccountPopover from './account';
import { useAuth } from '../../authProvider';
import { Box } from '@mui/material';
import { items as options} from './options';
import { UserOutlined } from '@ant-design/icons';

const { Content, Sider } = Layout;

const Main: React.FC = () => { 

  const {colaborador, userRole} = useAuth();
  const nombre = colaborador?.nombre.split(" ")[0];
  const navigate = useNavigate();
  
  const handleMenuClick = (key: string) => {
    // Define las rutas correspondientes para cada elemento del menú
    const routeMap: Record<string, string> = {
      '1': '/',
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
  },[]);

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
          width={220}
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
        <Layout  style={{ marginLeft: 210, backgroundColor: 'white' }}>
          <Content style={{margin: '0px 16px 0', overflow: 'initial' }}>
            <div style={{ position: 'sticky', top: 0, zIndex: 1, padding: '0px' }}>
              <div style={{ width: '100%', display: 'flex', backgroundColor: 'white', justifyContent: 'flex-end', alignItems: 'flex-end', padding: '0px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <AccountPopover/>
                </div>
              </div>
            </div>
            <Box pl={4} pr={4} pb={0}>
                <Rutas/>
            </Box>
          </Content>
        </Layout>
      </Layout>
    );
}

export default Main;