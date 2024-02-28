import {
  UserOutlined,
  HomeOutlined,
  FileOutlined,
  ClockCircleOutlined,
  SwapOutlined,
  LoginOutlined,
  SecurityScanOutlined,
  SendOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Avatar } from 'antd';
import React from 'react';
import '../../index.css';
import Rutas from '../../routes';
import { useNavigate } from 'react-router-dom';
import AccountPopover from './account';

const { Content, Sider } = Layout;

const Main: React.FC = () => { 
  
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
          <div className="logo" />
          <div style={{ display: 'flex', alignItems: 'center', padding: '15px', marginTop: 20 }}>
            <Avatar size={50} icon={<UserOutlined />} style={{ marginBottom: '8px', marginRight: 15 }}  />
          <div>
            <h2 style={{ margin: 0, color: '#fff' }}>Fran</h2>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>admin</p>
          </div>
        </div>
          <hr style={{ width: 200}} />

          <Menu 
            style={{marginTop: '3%'}} 
            theme='dark' mode="inline" 
            defaultSelectedKeys={['1']}
            onClick={({ key }) => handleMenuClick(key as string)}
          >
            <Menu.Item key="1" icon={<HomeOutlined />}>Dashboard</Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />}>Empleados</Menu.Item>
            <Menu.Item key="3" icon={<ClockCircleOutlined />}>Ausencias</Menu.Item>

            <Menu.SubMenu key="subopciones" icon={<FolderOutlined />} title="Permisos">
              <Menu.Item key="4" icon={<FileOutlined />}>Solicitudes</Menu.Item>
              <Menu.Item key="5" icon={<SendOutlined/>}>Ingresar Solicitud</Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu key="subopciones2" icon={<SecurityScanOutlined />} title="Auditoría">
              <Menu.Item key="6" icon={<SwapOutlined />}>Actividad </Menu.Item>
              <Menu.Item key="7" icon={<LoginOutlined />}>Sesiones</Menu.Item>
            </Menu.SubMenu>
          </Menu>
              
        </Sider>
        <Layout  style={{ marginLeft: 210, backgroundColor: 'white' }}>
          <Content style={{margin: '0px 16px 0', overflow: 'initial', border: '1px' }}>
            <div style={{ position: 'sticky', top: 0, zIndex: 1, padding: '0px' }}>
              <div style={{ width: '100%', display: 'flex', backgroundColor: 'white', justifyContent: 'flex-end', alignItems: 'flex-end', padding: '0px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <AccountPopover/>
                </div>
              </div>
            </div>
            <div style={{ padding: 24, paddingLeft: 40 }}>
                <Rutas/>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
}

export default Main;