import Grid from "@mui/material/Grid";
import { useEffect, useState} from 'react';
import CustomBox from '../dashboard/boxes/customBox';
import Footer from "./layout/footer";
import CustomCard from "./cards/customCard";
import Projects from "./tables/teams";
import Orders from "./tables/order";
import { getEmployeeData, getRequestData, getAbsenceData, getAuditData } from "./data/summary"
import { useAuth } from '../../authProvider'; 
import WeekendIcon from '@mui/icons-material/Weekend';
import {getRequestsInfo} from "./data/chartData";
import PieCard from "./charts/pieChart";
import LineCard from "./charts/lineChart";
import BarCard from "./charts/barChart"
import './styles/styles.css'


function Dashboard() {

    const { userRole} = useAuth();


  const defaultEmployeeData = {
    totalCount: 0,
    color: "gray",
    title: "No Data",
    icon: <WeekendIcon />,
  };

  const [employeeData, setEmployeeData] = useState<{
    totalCount: number;
    color: string;
    title: string;
    icon: JSX.Element;
  } | null>(null);
 
  const [requestData, setRequestData] = useState<{
    totalCount: number;
    color: string;
    title: string;
    icon: JSX.Element;
  } | null>(null);

  const [absenceData, setAbsenceData] = useState<{
    totalCount: number;
    color: string;
    title: string;
    icon: JSX.Element;
  } | null>(null);


  const [auditData, setAuditData] = useState<{
    totalCount: number;
    color: string;
    title: string;
    icon: JSX.Element;
  } | null>(null);

  const [chartData, setChartData] = useState<{ labels: string[], datasets: { label: string, data: number[] } }>({
    labels: ["Dom", "Lun", "Mar", "Mi", "Jue", "Vie", "Sáb"],
    datasets: { label: "Solicitudes", data: [] }
  });
  
  const pieChartData = {
    labels: ["TI", "R.R.H.H", "Admin"], // Etiquetas de los segmentos
    data: [10, 15, 20], // Valores correspondientes a cada segmento
  };

  const lineChartData = {
    labels: ["Dom", "Lun", "Mar", "Mi", "Jue", "Vie", "Sáb"], // Etiquetas de los segmentos
    data: [100, 150, 200, 120, 90, 300, 400], // Valores correspondientes a cada segmento
  };



  useEffect(() => {
    
   
    async function fetchEmployeeData() {
      try {
        const data = await getEmployeeData();
        setEmployeeData(data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    }

    async function fetchRequestData() {
      try {
        const data = await getRequestData();
        setRequestData(data);
      } catch (error) {
        console.error('Error fetching request data:', error);
      }
    }

    async function fetchAbsenceData() {
      try {
        const data = await getAbsenceData();
        setAbsenceData(data);
      } catch (error) {
        console.error('Error fetching request data:', error);
      }
    }

    async function fetchAuditData() {
      try {
        const data = await getAuditData();
        setAuditData(data);
      } catch (error) {
        console.error('Error fetching request data:', error);
      }
    }

    async function fetchRequestsInfo() {
      try {
        const dataRequest = await getRequestsInfo();
        const chartData = {labels: ["Dom", "Lun", "Mar", "Mi", "Jue", "Vie", "Sáb"],
        datasets: { label: "Solicitudes", data: dataRequest}}
        setChartData(chartData);
      } catch (error) {
        console.error('Error fetching request data:', error);
      }
    }


     if (userRole == 'admin'){
    // Llamar a la función para obtener los datos de los colaboradores
    fetchEmployeeData();
    fetchRequestData();
    fetchAbsenceData();
    fetchAuditData();
    fetchRequestsInfo();
    }
  }, []);


  return (
    <CustomBox sx={({ breakpoints, transitions }) => ({
      p: 3,
      position: "relative",
      [breakpoints.up("xl")]: {
        transition: transitions.create(["margin-left", "margin-right"], {
          easing: transitions.easing.easeInOut,
          duration: transitions.duration.standard,
        }),
      },
    })}>

      <CustomBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <CustomCard
                color={employeeData?.color || defaultEmployeeData.color}
                icon={employeeData?.icon || defaultEmployeeData.icon}
                title={employeeData?.title || defaultEmployeeData.title}
                count={employeeData?.totalCount || defaultEmployeeData.totalCount}
                route = {'/panel-expedientes'}
              />
          </Grid>   
          <Grid item xs={12} md={6} lg={3}>    
            <CustomCard
                color={requestData?.color || defaultEmployeeData.color}
                icon={requestData?.icon || defaultEmployeeData.icon}
                title={requestData?.title || defaultEmployeeData.title}
                count={requestData?.totalCount || defaultEmployeeData.totalCount}
                route = {'/solicitudes'}
              /> 
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <CustomCard
                  color={absenceData?.color || defaultEmployeeData.color}
                  icon={absenceData?.icon || defaultEmployeeData.icon}
                  title={absenceData?.title || defaultEmployeeData.title}
                  count={absenceData?.totalCount || defaultEmployeeData.totalCount}
                  route = {'/ausencias'}
              />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
              <CustomCard
                  color={auditData?.color || defaultEmployeeData.color}
                  icon={auditData?.icon || defaultEmployeeData.icon}
                  title={auditData?.title || defaultEmployeeData.title}
                  count={auditData?.totalCount || defaultEmployeeData.totalCount}
                  route = {'/auditorias'}
              />
          </Grid>
        </Grid>
        <CustomBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
                <BarCard
                  color= "#758184"
                  title="Vista Solicitudes"
                  description="Datos de la última semana"
                  chart={chartData}
                />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <PieCard
                  color="#ffb74d"
                  title="Vista Empleados"
                  description="Empleados por puesto"
                  chart={pieChartData}
                />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <LineCard
                  color="#516091"
                  title="Vista Horas Extras"
                  description="Datos de la última semana"
                  chart={lineChartData}
                />
            </Grid>
          </Grid>
        </CustomBox>
        <CustomBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              < Projects/>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
               <Orders/>
            </Grid>
          </Grid>
        </CustomBox>
      </CustomBox>
      <Footer/>
    </CustomBox>
  );
}


export default Dashboard;
