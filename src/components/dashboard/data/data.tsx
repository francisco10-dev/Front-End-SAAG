import SolicitudService from "../../../services/solicitud.service";
import ColaboradorService from "../../../services/colaborador.service";
import {fetchData} from '../data/cacheData';


export async function getAbsenceIndicators(): Promise<number[] | null> {
  return fetchData<number[] | null>(
      async () => {
          const solicitudService = new SolicitudService();
          const employeeService = new ColaboradorService();

          try {
              const colaboradores = await employeeService.obtenerColaboradores();
              const solicitudes = await solicitudService.getSolicitudes();

              const ausencias = solicitudes.filter(solicitud => solicitud.estado === "Aprobado");
              const indicadoresMeses: number[] = [];

              for (let mes = 0; mes < 12; mes++) {
                  const indicadorMes = calcularIndicadorAusentismoMes(ausencias, colaboradores, mes);
                  indicadoresMeses.push(indicadorMes);
              }

              return indicadoresMeses;
          } catch (error) {
              console.error('Error fetching absence data:', error);
              return null;
          }
      },
      'absenceIndicators'
  );
}


const calcularIndicadorAusentismoMes = (solicitudes: any[], colaboradores: any[], mes: number): number => {
  const hoy = new Date();
  const añoActual = hoy.getFullYear();


  const solicitudesMes = solicitudes.filter((solicitud: { fechaInicio: string | number | Date; }) => {
    const fechaSolicitud = new Date(solicitud.fechaInicio);
    return fechaSolicitud.getMonth() === mes && fechaSolicitud.getFullYear() === añoActual;
  });


  if (solicitudesMes.length === 0) {
    return 0; 
  }

  const cantidadDiasHabiles = obtenerCantidadDiasHabiles(mes, añoActual); 

  const colaboradoresActivosMes = colaboradores.filter((colaborador) => {
    const fechaIngreso = new Date(colaborador.fechaIngreso);
    const fechaSalida = colaborador.fechaSalida ? new Date(colaborador.fechaSalida) : hoy;

    return fechaIngreso <= new Date(añoActual, mes + 1, 0) && fechaSalida >= new Date(añoActual, mes, 1);
  }).length;

  if (colaboradoresActivosMes === 0) {
    return 0;
  }

  let horasNoTrabajadas = 0;

  solicitudesMes.forEach((solicitud: { tipoSolicitud: string; fechaInicio: string | number | Date; fechaFin: string | number | Date; horaInicio?: string | null; horaFin?: string | null }) => {
    const fechaInicio = new Date(solicitud.fechaInicio);
    const fechaFin = new Date(solicitud.fechaFin);

  
    const tiempoMilisegundos = fechaFin.getTime() - fechaInicio.getTime(); 
    const diasSolicitados = Math.ceil(tiempoMilisegundos / (1000 * 60 * 60 * 24)); 

   
    let diferenciaHoras = 0;

    if (!solicitud.horaInicio) {
      diferenciaHoras = diasSolicitados * 8;
    } else if (diasSolicitados === 0 && solicitud.horaInicio && solicitud.horaFin) {
      const horaInicio = new Date(`2000-01-01T${solicitud.horaInicio}`);
      const horaFin = new Date(`2000-01-01T${solicitud.horaFin}`);
      diferenciaHoras = (horaFin.getTime() - horaInicio.getTime()) / (1000 * 60 * 60);
    } else if (diasSolicitados > 0 && solicitud.horaInicio && solicitud.horaFin) {
      diferenciaHoras = diasSolicitados * 8;
      const horaInicio = new Date(`2000-01-01T${solicitud.horaInicio}`);
      const horaFin = new Date(`2000-01-01T${solicitud.horaFin}`);
      diferenciaHoras = diferenciaHoras + (horaFin.getTime() - horaInicio.getTime()) / (1000 * 60 * 60);
    }

    horasNoTrabajadas += diferenciaHoras;
  });

  const totalHorasPosibles = colaboradoresActivosMes * cantidadDiasHabiles * 8; 
  const indicador = (horasNoTrabajadas / totalHorasPosibles) * 100;
  return parseFloat(indicador.toFixed(2)); 
};




const obtenerCantidadDiasHabiles = (mes: number, año: number) => {
  const primerDiaMes = new Date(año, mes, 1);
  const ultimoDiaMes = new Date(año, mes + 1, 0);
  let cantidadDiasHabiles = 0;

  for (let dia = primerDiaMes; dia <= ultimoDiaMes; dia.setDate(dia.getDate() + 1)) {
      if (dia.getDay() !== 0 && dia.getDay() !== 6) {
          cantidadDiasHabiles++;
      }
  }
  return cantidadDiasHabiles;
};
