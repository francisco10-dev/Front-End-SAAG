import { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DataTable from './tableAusencia';
import Bars from './graphicAusencia';
import SolicitudService from '../../services/solicitud.service';
import { Solicitud } from '../../services/solicitud.service';
import { CircularProgress } from '@mui/material';

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
  const [value, setValue] = useState(0);
  //@ts-ignore
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [approved, setApproved] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    event
  };

  const loadRequests = () => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const solicitudesData = await Service.getSolicitudes();
        updateRows(solicitudesData);
      } catch (error) {
        console.error('Error al obtener solicitudes:', error);
      } finally {
        setLoading(false); // Marcamos que la carga ha finalizado, independientemente de si fue exitosa o no
      }
    };
    fetchData();
  }

  useEffect(() => {
    loadRequests();
  }, []);

  const setData = (data: Solicitud[]) => {
    const aprobadas = data.filter((solicitud) => solicitud.estado === 'Aprobado');
    setApproved(aprobadas);
  }

  const updateRows = (nuevoArray: Solicitud[]) => {
    setSolicitudes(nuevoArray);
    setData(nuevoArray);
  };

  // Método para eliminar filas, pero no lo vas a usar
  // const deleteRows = (ids: number[]) => {
  //   const nuevoArray = solicitudes.filter((elemento) => !ids.includes(elemento.idSolicitud));
  //   updateRows(nuevoArray);
  // };

  // Método para cambiar el estado, pero no lo vas a usar
  // const changeStatus = (id: number, status: string) => {
  //   const nuevoArray = solicitudes.map((solicitud) =>
  //     solicitud.idSolicitud === id ? { ...solicitud, estado: status } : solicitud
  //   );
  //   updateRows(nuevoArray);
  // };


  if (loading) {
    return <div><CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }} /></div>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Todas" {...a11yProps(0)} />
          <Tab label="Proximos Ausentes" {...a11yProps(1)} />
          <Tab label="Ausentes" {...a11yProps(2)} />
          <Tab label="Grafico" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <DataTable isLoading={loading} rows={approved} /*deleteRows={deleteRows} onSolicitudUpdate={changeStatus}*/ load={loadRequests} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <DataTable isLoading={loading}  
        rows={approved.filter(item => item.fechaInicio && new Date(item.fechaInicio) > new Date()).sort((a, b) => {
        if (!a.fechaInicio || !b.fechaInicio) return 0;
        return new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime();})}
        /*deleteRows={deleteRows} onSolicitudUpdate={changeStatus}*/ load={loadRequests}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <DataTable isLoading={loading} 
        rows={approved.filter(item => item.fechaInicio && new Date(item.fechaInicio) < new Date()).sort((a, b) => {
          if (!a.fechaInicio || !b.fechaInicio) return 0;
          return new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime();})}
        /*deleteRows={deleteRows} onSolicitudUpdate={changeStatus}*/ load={loadRequests} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <Bars />
      </CustomTabPanel>
    </Box>
  );
}
