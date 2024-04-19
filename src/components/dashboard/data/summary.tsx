import ColaboradorService from '../../../services/colaborador.service';
import SolicitudService from '../../../services/solicitud.service';
import AuditService from '../../../services/auditoria.service';
import Person4Icon from '@mui/icons-material/Person4';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';


const calcularIndicadorAusentismoTotal = (solicitudes: any[], colaboradores: any[]): number => {
  const hoy = new Date();
  let mesActual = hoy.getMonth(); // Mes actual (0-11)
  let añoActual = hoy.getFullYear(); // Año actual

   // Manejar el caso especial del mes de enero
   if (mesActual === 0) {
    mesActual = 11;  // Diciembre (índice 11)
    añoActual--;    // Retroceder al año anterior
  } else {
    mesActual--;    // Retroceder al mes anterior
  }


  // Filtrar solicitudes que ocurran dentro del mes y año actual
  const solicitudesMesActual = solicitudes.filter((solicitud: { fechaInicio: string | number | Date; }) => {
      const fechaSolicitud = new Date(solicitud.fechaInicio);
      return fechaSolicitud.getMonth() === mesActual && fechaSolicitud.getFullYear() === añoActual;
  });

  const cantidadDiasHabiles = obtenerCantidadDiasHabiles(mesActual, añoActual); // Obtener la cantidad de días hábiles del mes actual

  const colaboradoresActivosMesActual = colaboradores.filter((colaborador) => {
    const fechaIngreso = new Date(colaborador.fechaIngreso);
    const fechaSalida = colaborador.fechaSalida ? new Date(colaborador.fechaSalida) : hoy;
    
    return fechaIngreso <= new Date(añoActual, mesActual + 1, 0) && fechaSalida >= new Date(añoActual, mesActual, 1);
  }).length;
  
  
  
  let horasNoTrabajadas = 0;

  solicitudesMesActual.forEach((solicitud: { tipoSolicitud: string; fechaInicio: string | number | Date; fechaFin: string | number | Date; horaInicio?: string | null; horaFin?: string | null }) => {
      
          const fechaInicio = new Date(solicitud.fechaInicio);
          const fechaFin = new Date(solicitud.fechaFin);
          
          // Calcular la diferencia en días
          const tiempoMilisegundos = fechaFin.getTime() - fechaInicio.getTime(); // Diferencia en milisegundos
          const diasSolicitados = Math.ceil(tiempoMilisegundos / (1000 * 60 * 60 * 24)); // Convertir milisegundos a días

          // Calcular la diferencia de horas
          let diferenciaHoras = 0;

          if(!solicitud.horaInicio){
            diferenciaHoras = diasSolicitados * 8;
          }

          else if (diasSolicitados === 0 && solicitud.horaInicio && solicitud.horaFin) {
            const horaInicio = new Date(`2000-01-01T${solicitud.horaInicio}`);
            const horaFin = new Date(`2000-01-01T${solicitud.horaFin}`);
            diferenciaHoras = (horaFin.getTime() - horaInicio.getTime()) / (1000 * 60 * 60);
          }

          else if (diasSolicitados > 0 && solicitud.horaInicio && solicitud.horaFin) {
              diferenciaHoras = diasSolicitados * 8;
              const horaInicio = new Date(`2000-01-01T${solicitud.horaInicio}`);
              const horaFin = new Date(`2000-01-01T${solicitud.horaFin}`);
              diferenciaHoras = diferenciaHoras + (horaFin.getTime() - horaInicio.getTime()) / (1000 * 60 * 60);

          }
          // Restar la diferencia de horas de las horas no trabajadas
          horasNoTrabajadas += diferenciaHoras;
      
  });

  const totalHorasPosibles = colaboradoresActivosMesActual * cantidadDiasHabiles * 8; // 8 horas diarias * cantidad de días hábiles
  const indicador = (horasNoTrabajadas / totalHorasPosibles) * 100;
  return parseFloat(indicador.toFixed(2)); // Redondear el indicador a dos decimales y convertirlo a número
};

// Función auxiliar para obtener la cantidad de días hábiles en un mes y año específicos
const obtenerCantidadDiasHabiles = (mes: number, año: number) => {
  const primerDiaMes = new Date(año, mes, 1);
  const ultimoDiaMes = new Date(año, mes + 1, 0);
  let cantidadDiasHabiles = 0;

  for (let dia = primerDiaMes; dia <= ultimoDiaMes; dia.setDate(dia.getDate() + 1)) {
      if (dia.getDay() !== 0 && dia.getDay() !== 6) { // Excluir sábado y domingo
          cantidadDiasHabiles++;
      }
  }
  return cantidadDiasHabiles;
};




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
    const requestService2 = new SolicitudService();
    const employeeService2 = new ColaboradorService();

    try {
      const solicitudes2 = await requestService2.getSolicitudes();
      const employees2 = await employeeService2.obtenerColaboradores();
      const absences = calcularIndicadorAusentismoTotal(solicitudes2, employees2);
      const data = {
        totalCount : absences,
        color : "#74BEC1",
        title : "Ausentismo",
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



