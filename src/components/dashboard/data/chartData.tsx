import SolicitudService from '../../../services/solicitud.service';
import colaboradorService from '../../../services/colaborador.service';
import {fetchData} from '../data/cacheData';


export async function getEmployyesByUnit(): Promise<{ labels: string[], data: number[] }> {
  return fetchData<{ labels: string[], data: number[] }>(
      async () => {
          const employeeService = new colaboradorService();
          const employees = await employeeService.obtenerColaboradores();
          const colaboradoresPorUnidad: { [unidad: string]: number } = {};

          employees.forEach(colaborador => {
              const unidad = colaborador.unidad || 'Sin unidad';

              if (unidad in colaboradoresPorUnidad) {
                  colaboradoresPorUnidad[unidad]++;
              } else {
                  colaboradoresPorUnidad[unidad] = 1;
              }
          });

          const pieChartData = {
              labels: Object.keys(colaboradoresPorUnidad),
              data: Object.values(colaboradoresPorUnidad)
          };
          return pieChartData;
      },
      'employeeByUnitData'
  );
}

export async function getUltimoIngreso(): Promise<string | null> {
  return fetchData<string | null>(
      async () => {
          const employeeService = new colaboradorService();

          try {
              const colaboradores = await employeeService.obtenerColaboradores();

              if (!colaboradores || colaboradores.length === 0) {
                  console.log('No hay colaboradores registrados.');
                  return null;
              }

              const colaboradoresIngresados = colaboradores.filter(colaborador =>
                  colaborador.fechaIngreso <= obtenerFechaActual()
              );

              if (colaboradoresIngresados.length === 0) {
                  console.log('No hay colaboradores registrados antes de la fecha actual.');
                  return null;
              }

              colaboradoresIngresados.sort((a, b) => b.fechaIngreso.localeCompare(a.fechaIngreso));
              const ultimoIngreso = colaboradoresIngresados[0].fechaIngreso;
              const fechaActual = obtenerFechaActual();
              const esHoy = esMismoDia(fechaActual, ultimoIngreso);
              const diasTranscurridos = calcularDiasTranscurridos(fechaActual, ultimoIngreso);

              if (esHoy) {
                  return 'Último ingreso fue hoy';
              } else if (diasTranscurridos === 1) {
                  return `Último ingreso hace ${diasTranscurridos} día`;
              } else {
                  return `Último ingreso hace ${diasTranscurridos} días`;
              }
          } catch (error) {
              console.error('Error fetching employee data:', error);
              return null;
          }
      },
      'ultimoIngreso'
  );
}


export async function getRequestsInfo(): Promise<number[]> {
  return fetchData<number[]>(
      async () => {
          const requestService = new SolicitudService();
          const solicitudes = await requestService.getSolicitudes();
          const fechaActual = new Date();
          const diaActual = fechaActual.getDay();
          const fechaFinSemana = new Date(fechaActual.getTime() - (diaActual + 1) * 24 * 60 * 60 * 1000);
          const fechaInicioSemana = new Date(fechaFinSemana.getTime() - 6 * 24 * 60 * 60 * 1000); 
          const solicitudesPorDia: number[] = [0, 0, 0, 0, 0, 0, 0]; 

          solicitudes.forEach(solicitud => {
              const fechaSolicitud = new Date(solicitud.fechaSolicitud);
              
              if (fechaSolicitud >= fechaInicioSemana && fechaSolicitud <= fechaFinSemana) {
                  const dia = fechaSolicitud.getDay(); 
                  solicitudesPorDia[dia]++;
              }
          });
          return solicitudesPorDia;
      },
      'requestsInfo'
  );
}

export async function getUltimaSolicitudInfo(): Promise<string | null> {
  return fetchData<string | null>(
      async () => {
          const requestService = new SolicitudService();

          try {
              const solicitudes = await requestService.getSolicitudes();

              if (!solicitudes || solicitudes.length === 0) {
                  console.log('No hay solicitudes registradas.');
                  return null;
              }

              const ultimaSolicitud = solicitudes[solicitudes.length - 1];
              const fechaActual = obtenerFechaActual();
              const fechaSolicitud = ultimaSolicitud.fechaSolicitud;
              const esHoy = esMismoDia(fechaActual, fechaSolicitud);
              const diasTranscurridos = calcularDiasTranscurridos(fechaActual, fechaSolicitud);

              if (esHoy) {
                  return 'Última solicitud realizada hoy';
              } else if (diasTranscurridos === 1) {
                  return `Última solicitud hace ${diasTranscurridos} día`;
              } else {
                  return `Última solicitud hace ${diasTranscurridos} días`;
              }
          } catch (error) {
              console.error('Error fetching request data:', error);
              return null;
          }
      },
      'ultimaSolicitudInfo'
  );
}


function obtenerFechaActual(): string {
  const fecha = new Date();
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function esMismoDia(fechaActual: string, fechaSolicitud: string): boolean {
  return fechaActual === fechaSolicitud;
}

function calcularDiasTranscurridos(fechaActual: string, fechaSolicitud: string): number {
  const fechaActualDate = new Date(fechaActual);
  const fechaSolicitudDate = new Date(fechaSolicitud);
  const tiempoMilisegundos = fechaActualDate.getTime() - fechaSolicitudDate.getTime();
  return Math.floor(tiempoMilisegundos / (24 * 60 * 60 * 1000));
}

