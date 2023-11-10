import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DataTable from './tableSolicitud';
import SolicitudService from '../../services/solicitud.service';
import { Solicitud } from '../../services/solicitud.service';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
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
  const Service = new SolicitudService();
  const [value, setValue] = React.useState(0);
  const [solicitudes, setSolicitudes] = React.useState<Solicitud[]>([]);
  const [ approved, setApproved ] = React.useState<Solicitud[]>([]);
  const [pendings, setPendings] = React.useState<Solicitud[]>([]);


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    event
  };

  const loadRequests = () => {
    const fetchData = async () => {
      try {
        const solicitudesData = await Service.getSolicitudes();
        setSolicitudes(solicitudesData);
        const aprobadas = solicitudesData.filter((solicitud) => solicitud.estado === 'procesada');
        setApproved(aprobadas);
        const pendientes = solicitudesData.filter((solicitud) => solicitud.estado === 'pendiente');
        setPendings(pendientes);
      } catch (error) {
        console.error('Error al obtener solicitudes:', error);
      }
    };
    fetchData();
  }

React.useEffect(() => {
  loadRequests();
}, [value]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Todas" {...a11yProps(0)} />
          <Tab label="Procesadas" {...a11yProps(1)} />
          <Tab label="Pendientes" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
      <DataTable rows={solicitudes} updateSolicitudes={loadRequests}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
      <DataTable rows={approved} updateSolicitudes={loadRequests}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
      <DataTable rows={pendings} updateSolicitudes={loadRequests}/>
      </CustomTabPanel>
    </Box>
  );
}
