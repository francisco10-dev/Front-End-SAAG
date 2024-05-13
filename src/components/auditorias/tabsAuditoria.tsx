import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DataTable from './tableAuditoria';
import AuditoriaService from '../../services/auditoria.service';
import { Auditoria } from '../../services/auditoria.service';
import { CircularProgress, MenuItem, SelectChangeEvent, Select } from '@mui/material';

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

export default function TabsAuditoriasLogin() {
  const Service = new AuditoriaService();
  const [value, setValue] = React.useState(0);
  const [auditorias, setAuditorias] = React.useState<Auditoria[]>([]);
  const [filteredAuditorias, setFilteredAuditorias] = React.useState<Auditoria[]>([]);
  const [filterValue, setFilterValue] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);


  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    const filterValue = event.target.value as string;
    setFilterValue(filterValue); // Actualiza el estado del filtro al seleccionar una opción
    filterAuditorias(filterValue);
  };

  const filterAuditorias = (filter: string) => {
    if (filter === '') {
      setFilteredAuditorias(auditorias); // Restaurar auditorias originales cuando se borra el filtro
    } else {
      const filtered = auditorias.filter(auditoria => auditoria.nombre.toLowerCase().includes(filter.toLowerCase()));
      setFilteredAuditorias(filtered);
    }
  };

  const loadRequests = async () => {
    try {
      const auditoriasData = await Service.getAuditorias();
      setAuditorias(auditoriasData);
      setFilteredAuditorias(auditoriasData);
    } catch (error) {
      console.error('Error al obtener auditorias:', error);
    }finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadRequests();
  }, []);

  const renderContent = (data: Auditoria[]) =>
    loading ? (
      <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }} />
    ) : (
      <DataTable rows={data} updateAuditorias={loadRequests} />
    );

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Todas" {...a11yProps(0)} />
          <Tab label="Filtrar" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {renderContent(auditorias)}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Select
          value={filterValue} // Usa el estado del filtro como valor del Select
          onChange={handleFilterChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Select filter' }}
        >
          <MenuItem value="">Seleccionar filtro</MenuItem>
          <MenuItem value="solicitud">Solicitud</MenuItem>
          <MenuItem value="ausencia">Ausencia</MenuItem>
          <MenuItem value="colaborador">Colaborador</MenuItem>
          <MenuItem value="puesto">Puesto</MenuItem>
        </Select>
        <Box mt={2}>{renderContent(filteredAuditorias)}</Box>
      </CustomTabPanel>
    </Box>
  );
}
