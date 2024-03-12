import { MenuProps } from 'antd';
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

export const items: MenuProps['items'] = [
    {
      key: '1',
      icon: <HomeOutlined/>,
      label: 'Dashboard',
    },
    {
      key: '2',
      icon: <UserOutlined/>,
      label: 'Empleados',
    },
    {
      key: '3',
      icon: <ClockCircleOutlined/>,
      label: 'Ausencias',
    },
    {
      key: 'permisos',
      icon: <FolderOutlined/>,
      label: 'Permisos',
      children: [
        {
          key: '4',
          label: 'Solicitudes',
          icon: <FileOutlined/>
        },
        {
          key: '5',
          label: 'Ingresar solicitud',
          icon: <SendOutlined/>
        },
      ],
    },
    {
      key: 'auditoria',
      icon: <SecurityScanOutlined/>,
      label: 'Auditoría',
      children: [
        {
          key: '6',
          label: 'Actividad',
          icon: <SwapOutlined/>
        },
        {
          key: '7',
          label: 'Sesiones',
          icon: <LoginOutlined/>
        },
      ],
    },
];