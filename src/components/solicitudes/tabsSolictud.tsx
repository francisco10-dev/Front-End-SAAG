import { useState, useEffect } from 'react';
import { useAuth } from '../../authProvider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DataTable from './tableSolicitud';
import SolicitudService, { Solicitud } from '../../services/solicitud.service';
import { message } from 'antd';
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: Readonly<TabPanelProps>) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function TabsSolicitudAdmin() {
  const { userRole, colaborador } = useAuth(); // Obtener el rol del usuario autenticado desde el contexto de autenticación
  const Service = new SolicitudService();
  const [value, setValue] = useState(0);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [approved, setApproved] = useState<Solicitud[]>([]);
  const [approvedByHeadquarters, setApprovedByHeadquarters] = useState<Solicitud[]>([]);
  const [pendings, setPendings] = useState<Solicitud[]>([]);
  const [rejected, setRejected] = useState<Solicitud[]>([]);
  const [rejectedByHeadquarters, setRejectedByHeadquarters] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(false);


  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const updateData = (data: any) => {
    setData(data);
    setSolicitudes(data);
  }

  const loadRequests = () => {
    setLoading(true);
    const fetchData = async () => {
      try {
        let solicitudesData: Solicitud[] = [];
        const cachedData = localStorage.getItem('solicitudesData');
        if (cachedData) {
          const data = JSON.parse(cachedData);
          if (userRole === 'supervisor' && data.role === 'supervisor') {
            solicitudesData = data.solicitudesData;
          } else if (userRole !== 'supervisor' && data.role !== 'supervisor') {
            solicitudesData = data.solicitudesData;
          }
        }
        if (solicitudesData.length === 0) {
          if (userRole === 'supervisor') {
            if (colaborador?.idColaborador) {
              solicitudesData = await Service.getSolicitudesPorSupervisor(colaborador.idColaborador);
            }
          } else {
            solicitudesData = await Service.getSolicitudes();
            console.log(solicitudesData)
          }
          localStorage.setItem('solicitudesData', JSON.stringify({ role: userRole, solicitudesData }));
        }

        updateData(solicitudesData);
      } catch (error) {
        console.log(error)
        message.error('Ocurrió un error al cargar las solicitudes');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }


  useEffect(() => {
    loadRequests();
  }, []);


  const setData = (solicitudes: Solicitud[]) => {
    let approvedStatus="Aprobado";
    let rejectedStatus = "Rechazado";
    let approvedStatusByHeadquarters = "AprobadoPorJefatura";
    let rejectedStatusByHeadquarters = "RechazadoPorJefatura";
    
    const approved = solicitudes.filter((solicitud) => solicitud.estado === approvedStatus);
    setApproved(approved);

    const approvedByHeadquarters = solicitudes.filter((solicitud) => solicitud.estado === approvedStatusByHeadquarters);
    setApprovedByHeadquarters(approvedByHeadquarters);

    const pendientes = solicitudes.filter((solicitud) => solicitud.estado === 'Pendiente');
    setPendings(pendientes);

    const rejected = solicitudes.filter((solicitud) => solicitud.estado === rejectedStatus);
    setRejected(rejected);

    const rejectedByHeadquarters = solicitudes.filter((solicitud) => solicitud.estado === rejectedStatusByHeadquarters);
    setRejectedByHeadquarters(rejectedByHeadquarters);
  }

  return (
    <>
      {/* {userRole != "supervisor" && ( */}
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', maxWidth: { xs: 520, sm: 900 } }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Todas" {...a11yProps(0)} />
              <Tab label="Aprobadas" {...a11yProps(1)} />
              <Tab label="Pendientes" {...a11yProps(2)} />
              <Tab label="Rechazadas" {...a11yProps(3)} />
              <Tab label="Aprobadas por jefatura" {...a11yProps(4)} />
              <Tab label="Rechazadas por jefatura" {...a11yProps(5)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <DataTable isLoading={loading} rows={solicitudes} load={loadRequests} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <DataTable isLoading={loading} rows={approved} load={loadRequests} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <DataTable isLoading={loading} rows={pendings} load={loadRequests} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <DataTable isLoading={loading} rows={rejected} load={loadRequests} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
            <DataTable isLoading={loading} rows={approvedByHeadquarters} load={loadRequests} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={5}>
            <DataTable isLoading={loading} rows={rejectedByHeadquarters} load={loadRequests} />
          </CustomTabPanel>
        </Box>
    </>
  );
}
