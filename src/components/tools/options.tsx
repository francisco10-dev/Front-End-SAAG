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
    BarChartOutlined,
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
      key: 'Ausencias',
      icon: <ClockCircleOutlined/>,
      label: 'Ausencias',
      children: [
        {
          key: '3',
          label: 'Ausencias',
          icon: <FileOutlined/>
        },
        {
          key: '4',
          label: 'Graficos',
          icon: <BarChartOutlined/>
        },
      ]
    },
    {
      key: 'permisos',
      icon: <FolderOutlined/>,
      label: 'Permisos',
      children: [
        {
          key: '5',
          label: 'Solicitudes',
          icon: <FileOutlined/>
        },
        {
          key: '6',
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
          key: '7',
          label: 'Actividad',
          icon: <SwapOutlined/>
        },
        {
          key: '8',
          label: 'Sesiones',
          icon: <LoginOutlined/>
        },
      ],
    },
];