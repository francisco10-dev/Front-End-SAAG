import { useState, useEffect }from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DataTable from './tableTeams';
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


export default function TabsSolicitudAdmin() {
  const Service = new SolicitudService();
  const [value] = useState(0);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(false); 



  const loadRequests = () => {
    setLoading(true); 
    const fetchData = async () => {
      try {
        const solicitudesData = await Service.getSolicitudes();
        updateRows(solicitudesData);
      } catch (error) {
        console.error('Error al obtener solicitudes:', error);
      }finally {
        setLoading(false); // Marcamos que la carga ha finalizado, independientemente de si fue exitosa o no
      }
    };
    fetchData();
  }

  useEffect(() => {
    loadRequests();
  }, []);


  const updateRows = (nuevoArray: Solicitud[]) => {
    setSolicitudes(nuevoArray);

  };


  if (loading) {
    return <div><CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }}/></div>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <CustomTabPanel value={value} index={0}>
        <DataTable isLoading={loading} rows={solicitudes} load={loadRequests}/>
      </CustomTabPanel>
      
    </Box>
  );
}
