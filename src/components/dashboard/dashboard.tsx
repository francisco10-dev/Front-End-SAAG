import Grid from "@mui/material/Grid";
import { useEffect, useState} from 'react';
import CustomBox from '../dashboard/boxes/customBox';
import Footer from "./layout/footer";
import CustomCard from "./cards/customCard";
import DashTable from "./content/table";
import RecentActivity from "./content/timeLine";
import { getEmployeeData, getRequestData, getAbsenceData, getFutureAbsenceData } from "./data/summary"
import { useAuth } from '../../authProvider'; 
import {getEmployyesByUnit, getRequestsInfo, getUltimaSolicitudInfo, getUltimoIngreso} from "./data/chartData";
import PieCard from "./charts/pieChart";
import LineCard from "./charts/lineChart";
import BarCard from "./charts/barChart"
import { getAbsenceIndicators } from "./data/data";
import './styles/styles.css'
import CircularProgress from '@mui/material/CircularProgress';


function Dashboard() {

    const { userRole} = useAuth();


  const defaultEmployeeData = {
    totalCount: 0,
    color: "gray",
    title: "...Cargando",
    icon: <CircularProgress />,
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


  const [futureAbsenceData, setFutureAbsenceData] = useState<{
    totalCount: number;
    color: string;
    title: string;
    icon: JSX.Element;
  } | null>(null);

  const [chartData, setChartData] = useState<{ labels: string[], datasets: { label: string, data: number[] } }>({
    labels: ["Lun", "Mar", "Mi", "Jue", "Vie", "Sáb", "Dom"],
    datasets: { label: "Solicitudes", data: [0,0,0,0,0,0,0] }
  });

  const [requestInfo, setRequestInfo] = useState<string | null>(null);

  const [employeeInfo, setemployeeInfo] = useState<string | null>(null);
  
  const [pieData, setPieData] = useState<{ labels: string[], data: number[] }>({
    labels: ["", "", ""], 
    data: [0, 0, 0],
  });

  const [lineChartData, setLineChartData] = useState<{ labels: string[], data: number[] }>({
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Agos", "Set", "Oct", "Nov", "Dic"], 
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0 ,0, 0, 0 ],
  });


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

    async function fetchFutureAbsenceData() {
      try {
        const data = await getFutureAbsenceData();
        setFutureAbsenceData(data);
      } catch (error) {
        console.error('Error fetching request data:', error);
      }
    }

    async function fetchRequestsInfo() {
      try {
        const dataRequest = await getRequestsInfo();
        const dateInfo =  await getUltimaSolicitudInfo();
        setRequestInfo(dateInfo);

        const chartData = {labels: ["Lun", "Mar", "Mi", "Jue", "Vie", "Sáb", "Dom"],
        datasets: { label: "Solicitudes", data: dataRequest}}
        setChartData(chartData);

      } catch (error) {
        console.error('Error fetching request data:', error);
      }
    }

    async function fetchEmployeesByUnit() {
      try {
          const dataRequest = await getEmployyesByUnit();
          const employeeInfo = await getUltimoIngreso();
  
          if (dataRequest && Array.isArray(dataRequest.data)) {
              const { labels, data } = dataRequest;
              setPieData({ labels, data });
          } else {
              console.error('Data returned by getEmployyesByUnit() is not in the expected format:', dataRequest);
          }
  
          setemployeeInfo(employeeInfo);
      } catch (error) {
          console.error('Error fetching employee data:', error);
      }
  }
  
    async function fetchAbsenceIndicators() {
      const absenceIndicators = await getAbsenceIndicators();
      if (absenceIndicators !== null) {
   
        setLineChartData(prevState => ({
          ...prevState,
          data: absenceIndicators,
        }));
      } else {
        console.error('Los indicadores de ausentismo son nulos.');
      
      }
    }
    
     if (userRole == 'admin'){
      fetchEmployeeData();
      fetchRequestData();
      fetchFutureAbsenceData();
      fetchAbsenceData();
      fetchRequestsInfo();
      fetchEmployeesByUnit();
      fetchAbsenceIndicators();
    }
  }, [userRole]);


  return (
      <><CustomBox py={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <CustomCard
            color={employeeData?.color || defaultEmployeeData.color}
            icon={employeeData?.icon || defaultEmployeeData.icon}
            title={employeeData?.title || defaultEmployeeData.title}
            count={employeeData?.totalCount || defaultEmployeeData.totalCount}
            route={'/panel-expedientes'} />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <CustomCard
            color={requestData?.color || defaultEmployeeData.color}
            icon={requestData?.icon || defaultEmployeeData.icon}
            title={requestData?.title || defaultEmployeeData.title}
            count={requestData?.totalCount || defaultEmployeeData.totalCount}
            route={'/solicitudes'} />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <CustomCard
            color={absenceData?.color || defaultEmployeeData.color}
            icon={absenceData?.icon || defaultEmployeeData.icon}
            title={absenceData?.title || defaultEmployeeData.title}
            count={absenceData?.totalCount || defaultEmployeeData.totalCount}
            route={'/ausencias'} />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <CustomCard
            color={futureAbsenceData?.color || defaultEmployeeData.color}
            icon={futureAbsenceData?.icon || defaultEmployeeData.icon}
            title={futureAbsenceData?.title || defaultEmployeeData.title}
            count={futureAbsenceData?.totalCount || defaultEmployeeData.totalCount}
            route={'/ausencias'} />
        </Grid>
      </Grid>
      <CustomBox mt={4.5}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <BarCard
              color="#717D7E"
              title="Vista Solicitudes"
              description="Datos de la semana anterior"
              chart={chartData}
              info={requestInfo || ""} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <PieCard
              color="#ffb74d"
              title="Vista Empleados"
              description="Empleados por unidad"
              chart={pieData}
              info={employeeInfo || ""} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <LineCard
              color="#884EA0"
              title="Vista Ausentismo"
              description="Datos de los últimos meses"
              chart={lineChartData} />
          </Grid>
        </Grid>
      </CustomBox>
      <CustomBox>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <DashTable />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <RecentActivity />
          </Grid>
        </Grid>
      </CustomBox>
    </CustomBox><Footer /></>
  );
}

export default Dashboard;