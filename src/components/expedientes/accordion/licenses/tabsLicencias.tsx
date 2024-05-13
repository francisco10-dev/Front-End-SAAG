import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useEffect, useState } from "react";
import ExpedienteService, { Documento } from "../../../../services/expediente.service";
import Licencias from './tableLicenses';
import { Button } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Add from './addLicense';
import { isBefore, addDays, parseISO, isAfter, format } from 'date-fns';
import { Select, Input } from 'antd';
import Alert from '@mui/material/Alert';
import { es } from 'date-fns/locale';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const { Option } = Select;


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
        <Box>
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

export default function TabsLicencias(props: Readonly<{idColaborador: number}>) {

  const {idColaborador} = props;
  const [id, setId] = useState(idColaborador);
  const [openForm, setOpenForm] = useState(false);
  const [licenses, setLicenses] = useState<Documento[]>([]);
  const [upcomingExpirations, setUpcomingExpirations] = useState<Documento[]>([]);
  const [expiredLicenses, setExpiredLicenses] = useState<Documento[]>([]);
  const [activeLicenses, setActiveLicenses] = useState<Documento[]>([]);
  const service = new ExpedienteService();
  const [value, setValue] = React.useState(0);
  const [daysToExpire, setDaysToExpire] = useState<number>();
  const [customDayToExpire, setCustomDayToExpire] = useState<number>();
  const [proximo, setProximo] = useState<string>();

  const getFirstToExpire = () => {
    // Ordena los registros restantes por fecha de vencimiento ascendente
    activeLicenses.sort((a, b) => {
        const fechaA = parseISO(a.fechaVencimiento);
        const fechaB = parseISO(b.fechaVencimiento);
        return fechaA.getTime() - fechaB.getTime();
    });

    // El primer elemento en el array ordenado es el más próximo a vencer
    const registroProximoAVencer = activeLicenses[0];
    const fecha = parseISO(registroProximoAVencer.fechaVencimiento);

    const fechaFormateada = format(fecha, 'EEEE dd \'de\' MMMM \'de\' yyyy', { locale: es });
    setProximo(fechaFormateada);
  }

  useEffect(()=> {
   activeLicenses.length > 0 && getFirstToExpire();
  },[activeLicenses]);

  const handleChangeDaysToExpire = (value: number) => {
    setDaysToExpire(value);
  };

  const loadData = async () => {
      try {
        const response = await service.getColaboradorDocumento(id);
        const licencias = response.filter(documento => documento.licencia != null)
        setLicenses(licencias);
      } catch (error) {
        console.log(error);
      }
  };

  const selectedDays = () => daysToExpire !== 6 ? daysToExpire : customDayToExpire;

  const updateData = () => {
    const currentDate = new Date();

    const active = licenses.filter((license) => {
        const dateToCheck = parseISO(license.fechaVencimiento);
        return isAfter(dateToCheck, currentDate);
    });
    
    const upcomingExpirationsArray = licenses.filter((license) => {
      const dateToCheck = parseISO(license.fechaVencimiento);
      return isBefore(dateToCheck, currentDate) ? false :
        isBefore(dateToCheck, addDays(currentDate, selectedDays() || 15));
    });

    upcomingExpirationsArray.sort((a, b) => {
      const fechaA = parseISO(a.fechaVencimiento);
      const fechaB = parseISO(b.fechaVencimiento);
      return fechaA.getTime() - fechaB.getTime();
    });

    const expiredLicensesArray = licenses.filter((license) => {
      const dateToCheck = parseISO(license.fechaVencimiento);
      return isBefore(dateToCheck, currentDate);
    });
    setActiveLicenses(active);
    setUpcomingExpirations(upcomingExpirationsArray);
    setExpiredLicenses(expiredLicensesArray);
  };

  
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(()=> {
    setId(idColaborador);
  },[idColaborador]);

  useEffect(()=> {
    loadData();
  },[id]);

  useEffect(() => {
    updateData();
  }, [licenses, daysToExpire]);

  useEffect(() => {
    updateData();
  }, [licenses, customDayToExpire]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Activas" {...a11yProps(0)} />
          <Tab label="Próximas a vencer" {...a11yProps(1)} />
          <Tab label="Vencidas" {...a11yProps(2)} />
          <Tab label="Historial" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
         <Box mb={3} mt={5} >
         <Box sx={{marginBottom: 2}}>
            <Button 
                variant="outlined" 
                startIcon={<AddOutlinedIcon />} 
                size='small' 
                onClick={()=> setOpenForm(true)}
            >
                Registrar
            </Button>
            <Add open={openForm} setOpen={setOpenForm} reload={loadData} idColaborador={id} />
        </Box>
         </Box>
        <Licencias licenses={activeLicenses} loadData={loadData} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
          {upcomingExpirations.length > 0 && (
            <Box>
                <Box mt={2}>
                <Alert  variant="filled" severity="info">Vencimiento más próximo el {proximo}</Alert>
                </Box>           
            </Box>
          )}
          <Box mb={2} mt={5} >
              <Select
                  defaultValue={15}
                  style={{ width: '30%', marginBottom: 10 }}
                  onChange={handleChangeDaysToExpire}
                  value={daysToExpire}
              >
                  <Option value={20}>20 días de proximidad</Option>
                  <Option value={15}>15 días de proximidad</Option>
                  <Option value={7}>7 días de proximidad</Option>
                  <Option value={5}>5 días de proximidad</Option>
                  <Option value={6}>Ingresar parámetro manualmente</Option>
              </Select>
              {daysToExpire === 6 && (
                <Box>
                  <Input type='number' placeholder='Ingrese el valor en días' style={{width: 200}} onChange={(e) => setCustomDayToExpire(+e.target.value)} />
                </Box>                
              )}
          </Box> 
        <Licencias licenses={upcomingExpirations} loadData={loadData}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Licencias licenses={expiredLicenses} loadData={loadData}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
       <Licencias licenses={licenses} loadData={loadData} />
      </CustomTabPanel>
    </Box>
  );
}
