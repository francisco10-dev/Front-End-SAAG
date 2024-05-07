import Grid from "@mui/material/Grid";
import { useEffect, useState} from 'react';
import CustomBox from '../dashboard/boxes/customBox';
import Footer from "./layout/footer";
import CustomCard from "./cards/customCard";
import Projects from "./content/table";
import Orders from "./content/timeLine";
import { getEmployeeData, getRequestData, getAbsenceData, getAuditData } from "./data/summary"
import { useAuth } from '../../authProvider'; 
import WeekendIcon from '@mui/icons-material/Weekend';
import {getEmployyesByUnit, getRequestsInfo, getUltimaSolicitudInfo, getUltimoIngreso} from "./data/chartData";
import PieCard from "./charts/pieChart";
import LineCard from "./charts/lineChart";
import BarCard from "./charts/barChart"
import { getAbsenceIndicators } from "./data/data";
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
    labels: ["Lun", "Mar", "Mi", "Jue", "Vie", "Sáb", "Dom"],
    datasets: { label: "Solicitudes", data: [] }
  });

  const [requestInfo, setRequestInfo] = useState<string | null>(null);

  const [employeeInfo, setemployeeInfo] = useState<string | null>(null);
  
  const [pieData, setPieData] = useState<{ labels: string[], data: number[] }>({
    labels: ["TI", "R.R.H.H", "Admin"], 
    data: [10, 15, 20],
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
        const employeeInfo =  await getUltimoIngreso();
        setemployeeInfo(employeeInfo);
        
       
        if (Array.isArray(dataRequest)) {
          console.error('Error: Unexpected data format received from server');
          return;
        }
    
        
        const labels = dataRequest.labels;
        const data = dataRequest.data;
    
        
        setPieData({ labels, data });
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
    fetchAuditData();
    fetchRequestsInfo();
    fetchAbsenceData();
    fetchEmployeesByUnit();
    fetchAbsenceIndicators();
    }
  }, [userRole]);


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
                  description="Datos de la semana anterior"
                  chart={chartData}
                  info = {requestInfo || ""}
                />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <PieCard
                  color="#ffb74d"
                  title="Vista Empleados"
                  description="Empleados por unidad"
                  chart={pieData}
                  info = {employeeInfo || ""}
                />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <LineCard
                  color="#516091"
                  title="Vista Ausentismo"
                  description="Datos de los últimos meses"
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
