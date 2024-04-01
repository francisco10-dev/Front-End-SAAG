import SolicitudService from '../../../services/solicitud.service';

export async function getRequestsInfo() {
  const requestService = new SolicitudService();

  try {
    const solicitudes = await requestService.getSolicitudes();
    const fechaActual = new Date();
    const fechaInicioSemana = new Date(fechaActual.getTime() - 6 * 24 * 60 * 60 * 1000); // Hace 6 días
    const solicitudesPorDia: number[] = [0, 0, 0, 0, 0, 0, 0]; // Arreglo para almacenar las solicitudes por día

    // Filtra las solicitudes dentro del rango desde hace 6 días hasta hoy, incluyendo hoy
    const solicitudesUltimaSemana = solicitudes.filter(solicitud => {
      const fechaSolicitud = new Date(solicitud.fechaSolicitud);
      return fechaSolicitud >= fechaInicioSemana && fechaSolicitud <= fechaActual;
    });

    // Recorre las solicitudes de la última semana y las asigna a sus respectivos días en el arreglo
    solicitudesUltimaSemana.forEach(solicitud => {
      const fechaSolicitud = new Date(solicitud.fechaSolicitud);
      const dia = fechaSolicitud.getDay(); // 0: Domingo, 1: Lunes, ..., 6: Sábado
      solicitudesPorDia[dia]++;
    });

    // Reorganiza los datos para que estén ordenados desde el domingo hasta el sábado
    const datosOrdenados = solicitudesPorDia.slice(0, 1).concat(solicitudesPorDia.slice(1).reverse());

    console.log('Número de solicitudes por día:', datosOrdenados);
    return datosOrdenados;
  } catch (error) {
    console.error('Error fetching request data:', error);
    return [];
  }
}


