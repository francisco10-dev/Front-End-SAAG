import ColaboradorService from '../../../services/colaborador.service';
import SolicitudService from '../../../services/solicitud.service';
import AuditService from '../../../services/auditoria.service';
import Person4Icon from '@mui/icons-material/Person4';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';


export async function getEmployeeData() {
    const employeeService = new ColaboradorService();
  
    try {
      const employees = await employeeService.obtenerColaboradores();
      const data = {
         totalCount : employees.length,
         color : "#EEF3AD",
         title : "Empleados",
         icon : <Person4Icon />,
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
      const data = {
        totalCount : solicitudes.length,
        color : "#A9ECA2",
        title : "Solicitudes",
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
        solicitud.estado === 'Aprobado');
  
      const data = {
        totalCount : ausencias.length,
        color : "#74BEC1",
        title : "Ausencias",
        icon : <WatchLaterIcon />
      }
  
      return data;
    } catch (error) {
      console.error('Error fetching absence data:', error);
      return null;
    }
  }

  export async function getAuditData() {
    const auditService = new AuditService();
  
    try {
      const audits = await auditService.getAuditorias();
      const data = {
        totalCount : audits.length,
        color : "#F5C8BD",
        title : "Auditorías",
        icon : <VerifiedUserIcon />
      }
  
  
      return data;
    } catch (error) {
      console.error('Error fetching audit data:', error);
      return null;
    }
  }



