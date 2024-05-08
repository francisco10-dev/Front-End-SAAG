import ColaboradorService from '../../../services/colaborador.service';
import SolicitudService from '../../../services/solicitud.service';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import GppBadIcon from '@mui/icons-material/GppBad';


export async function getEmployeeData() {
    const employeeService = new ColaboradorService();
  
    try {
      const employees = await employeeService.obtenerColaboradores();
      const data = {
         totalCount : employees.length,
         color : "rgb(244, 161, 0)",
         title : "Total Empleados",
         icon : <AssignmentIndIcon />,
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching employee data:', error);
      return null;
    }
  }

  export async function getRequestData() {
    const requestService = new SolicitudService();
  
    try {
      const solicitudes = await requestService.getSolicitudes();
      const solicitudesPendientes = solicitudes.filter(solicitud => solicitud.estado === "Pendiente");
      const data = {
        totalCount : solicitudesPendientes.length,
        color : "rgb(73, 163, 241)",
        title : "Solicitudes Pendientes",
        icon : <RequestPageIcon />
      }
  
      return data;
    } catch (error) {
      console.error('Error fetching request data:', error);
      return null;
    }
  }

  export async function getAbsenceData() {
    const solicitudService = new SolicitudService();

    try {
      const solicitudes= await solicitudService.getSolicitudes();
      const ausencias = solicitudes.filter(solicitud =>
        solicitud.estado === 'Aprobado' && new Date(solicitud.fechaInicio ?? "") <= new Date() && new Date(solicitud.fechaFin ?? "") > new Date());
  
      const data = {
        totalCount : ausencias.length,
        color : "rgb(102, 187, 106)",
        title : "Empleados Ausentes",
        icon : <GppBadIcon/>
      }
  
      return data;
    } catch (error) {
      console.error('Error fetching absence data:', error);
      return null;
    }
  }

  export async function getFutureAbsenceData() {
    const solicitudService = new SolicitudService();
  
    try {
      const solicitudes= await solicitudService.getSolicitudes();
      const proximasAusencias = solicitudes.filter(solicitud =>
        solicitud.estado === 'Aprobado' && new Date(solicitud.fechaInicio ?? "") > new Date());

      const data = {
        totalCount : proximasAusencias.length,
        color : "rgb(236, 64, 122)",
        title : "Próximas Ausencias",
        icon : <WatchLaterIcon  />
      }
  
  
      return data;
    } catch (error) {
      console.error('Error fetching audit data:', error);
      return null;
    }
  }



