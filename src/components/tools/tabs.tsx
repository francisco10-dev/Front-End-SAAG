import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DataTable from './table';
import SolicitudService from '../../services/solicitud.service';
import { GridColDef } from '@mui/x-data-grid';
import { Solicitud } from '../../services/solicitud.service';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const columns: GridColDef[] = [
    { field: 'idSolicitud', headerName: 'ID', width: 60 },
    { field: 'conGoceSalarial', headerName: 'Goce', width: 60, type: 'boolean' },
    { field: 'tipoSolicitud', headerName: 'Tipo', width: 100 },
    { field: 'asunto', headerName: 'Asunto', width: 100 },
    { field: 'nombreColaborador', headerName: 'Colaborador', width: 100 },
    { field: 'nombreEncargado', headerName: 'Encargado', width: 100 },
    { field: 'fechaSolicitud', headerName: 'Fecha', width: 200 },
    { field: 'estado', headerName: 'Estado', width: 100 },
];

const applyFilters = (rows: Solicitud[], filterText: string) => {
  return rows.filter((row) => {
    return (
      (row.nombreColaborador && row.nombreColaborador.toLowerCase().includes(filterText.toLowerCase())) ||
      (row.estado && row.estado.toLowerCase().includes(filterText.toLowerCase())) ||
      (row.idColaborador && row.idColaborador.toString().includes(filterText)) ||
      (row.idSolicitud && row.idSolicitud.toString().includes(filterText))
    );
  });
};



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

export default function BasicTabs() {
  const Service = new SolicitudService();
  const [value, setValue] = React.useState(0);
  const [solicitudes, setSolicitudes] = React.useState<Solicitud[]>([]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    event
  };

  React.useEffect(() => {
    Service.getSolicitudes()
      .then((solicitudes) => {
        setSolicitudes(solicitudes);
      })
      .catch((error) => {
        console.error('Error al obtener solicitudes:', error);
      });
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Todas" {...a11yProps(0)} />
          <Tab label="Aprobadas" {...a11yProps(1)} />
          <Tab label="Espera" {...a11yProps(2)} />
          <Tab label="Otra cosa" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
      <DataTable columns={columns} rows={solicitudes} filterFunction={applyFilters} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        item
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        item
      </CustomTabPanel>
    </Box>
  );
}
