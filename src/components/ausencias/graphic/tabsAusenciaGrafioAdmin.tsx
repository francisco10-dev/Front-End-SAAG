import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import BarsDiurno from './graphicAusenciaDiurno';
import BarsNocturno from './graphicAusenciaNocturno';
import { Solicitud } from '../../../services/solicitud.service';

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

export default function TabsAusenciaGraficoAdmin() {
  const [value, setValue] = useState(0);
  //@ts-ignore
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    event
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

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Grafico Diurno" {...a11yProps(0)} />
          <Tab label="Grafico Nocturno" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <BarsDiurno />
      </CustomTabPanel> 
      <CustomTabPanel value={value} index={1}>
        <BarsNocturno />
      </CustomTabPanel>
    </Box>
  );
}
