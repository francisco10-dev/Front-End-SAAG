import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DataTable from './tableAuditoriaLogin';
import AuditoriaLoginService from '../../services/auditoriaLogin.service';
import { AuditoriaLogin } from '../../services/auditoriaLogin.service';
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

export default function TabsAuditoriasLogin() {
  const Service = new AuditoriaLoginService();
  const [value, setValue] = React.useState(0);
  const [auditoriasLogin, setAuditoriasLogin] = React.useState<AuditoriaLogin[]>([]);
  const [ actived, setActived ] = React.useState<AuditoriaLogin[]>([]);
  const [loading, setLoading] = React.useState(false); 

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    event
  };

  const loadRequests = () => {
    setLoading(true); 
    const fetchData = async () => {
      try {
        const auditoriasLoginData = await Service.getAuditoriasLogin();
        setAuditoriasLogin(auditoriasLoginData);
        const activos = auditoriasLoginData.filter((AuditoriaLogin) => AuditoriaLogin.exito === true && AuditoriaLogin.fechaLogout === null );
        setActived(activos);
      } catch (error) {
        console.error('Error al obtener auditoriasLogin:', error);
      }finally {
        setLoading(false); // Marcamos que la carga ha finalizado, independientemente de si fue exitosa o no
      }
    };
    fetchData();
  }

React.useEffect(() => {
  loadRequests();
}, [value]);

const renderContent = (data: AuditoriaLogin[]) =>
  loading ? (
    <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }} />
  ) : (
    <DataTable rows={data} updateAuditoriasLogin={loadRequests} />
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Todas" {...a11yProps(0)} />
          <Tab label="Activos" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
      {renderContent(auditoriasLogin)}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
      {renderContent(actived)}
      </CustomTabPanel>
    </Box>
  );
}
