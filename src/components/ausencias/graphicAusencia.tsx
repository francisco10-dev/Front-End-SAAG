import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import SolicitudService, { Solicitud } from '../../services/solicitud.service';
import { Chart, CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend, Filler);

const solicitudService = new SolicitudService();

const Bars = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [recuentosSolicitudesPorMes, setRecuentosSolicitudesPorMes] = useState<Record<number, Record<string, number[]>>>({});
  const [sumasIndicadoresPorTipo, setSumasIndicadoresPorTipo] = useState({});
  const [sumaTotalIndicadores, setSumaTotalIndicadores] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const solicitudes = await solicitudService.getSolicitudes();
        console.log('Datos de las solicitudes:', solicitudes);
        setSolicitudes(solicitudes);
      } catch (error) {
        console.error('Error al obtener las solicitudes:', error);
      }
    };

    fetchSolicitudes();
  }, []);

  useEffect(() => {
    const filteredSolicitudes = solicitudes.filter(solicitud => {
      const fechaSolicitud = new Date(solicitud.fechaSolicitud);
      return fechaSolicitud.getFullYear() === selectedYear && solicitud.estado === "Aprobado";
    });

    console.log('Solicitudes filtradas:', filteredSolicitudes);

    let updatedRecuentosSolicitudesPorMes: Record<number, Record<string, number[]>> = {};
    let updatedSumasIndicadoresPorTipo: { [key: string]: number } = {};
    let updatedSumaTotalIndicadores: { [key: string]: number } = {};

    filteredSolicitudes.forEach(solicitud => {
      let indicador = 0;

      if (solicitud.fechaInicio && solicitud.fechaFin) {
        indicador = IndicadorDiurnoPorFecha(solicitud.fechaInicio, solicitud.fechaFin);
      } else if (solicitud.horaInicio && solicitud.horaFin) {
        indicador = IndicadorDiurnoPorHora(solicitud.horaInicio, solicitud.horaFin);
      }

      if (!updatedSumasIndicadoresPorTipo[solicitud.tipoSolicitud]) {
        updatedSumasIndicadoresPorTipo[solicitud.tipoSolicitud] = 0;
      }

      updatedSumasIndicadoresPorTipo[solicitud.tipoSolicitud] += indicador;

      const fecha = new Date(solicitud.fechaSolicitud);
      const mes = fecha.getUTCMonth();

      if (!updatedRecuentosSolicitudesPorMes[mes]) {
        updatedRecuentosSolicitudesPorMes[mes] = {};
      }

      updatedRecuentosSolicitudesPorMes[mes][solicitud.tipoSolicitud] = updatedRecuentosSolicitudesPorMes[mes][solicitud.tipoSolicitud] || [];
      updatedRecuentosSolicitudesPorMes[mes][solicitud.tipoSolicitud].push(indicador);
    });

    Object.keys(updatedSumasIndicadoresPorTipo).forEach(tipo => {
      updatedSumaTotalIndicadores[tipo] = updatedSumasIndicadoresPorTipo[tipo];
    });

    console.log('Recuentos de solicitudes por mes:', updatedRecuentosSolicitudesPorMes);
    console.log('Sumas de indicadores por tipo:', updatedSumasIndicadoresPorTipo);

    setSumaTotalIndicadores(updatedSumaTotalIndicadores);
    setSumasIndicadoresPorTipo(updatedSumasIndicadoresPorTipo);
    setRecuentosSolicitudesPorMes(updatedRecuentosSolicitudesPorMes);
  }, [selectedYear]);

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedYear = parseInt(event.target.value);
    setSelectedYear(selectedYear);

    const filteredSolicitudes = solicitudes.filter(solicitud => {
      const fechaSolicitud = new Date(solicitud.fechaSolicitud);
      return fechaSolicitud.getFullYear() === selectedYear && solicitud.estado === "Aprobado";
    });

    console.log('Solicitudes filtradas por año seleccionado:', filteredSolicitudes);

    let updatedRecuentosSolicitudesPorMes: Record<number, Record<string, number[]>> = {};
    let updatedSumasIndicadoresPorTipo: { [key: string]: number } = {};

    filteredSolicitudes.forEach(solicitud => {
      let indicador = 0;

      if (solicitud.fechaInicio && solicitud.fechaFin) {
        indicador = IndicadorDiurnoPorFecha(solicitud.fechaInicio, solicitud.fechaFin);
      } else if (solicitud.horaInicio && solicitud.horaFin) {
        indicador = IndicadorDiurnoPorHora(solicitud.horaInicio, solicitud.horaFin);
      }

      if (!updatedSumasIndicadoresPorTipo[solicitud.tipoSolicitud]) {
        updatedSumasIndicadoresPorTipo[solicitud.tipoSolicitud] = 0;
      }

      updatedSumasIndicadoresPorTipo[solicitud.tipoSolicitud] += indicador;

      const fecha = new Date(solicitud.fechaSolicitud);
      const mes = fecha.getUTCMonth();

      if (!updatedRecuentosSolicitudesPorMes[mes]) {
        updatedRecuentosSolicitudesPorMes[mes] = {};
      }

      updatedRecuentosSolicitudesPorMes[mes][solicitud.tipoSolicitud] = updatedRecuentosSolicitudesPorMes[mes][solicitud.tipoSolicitud] || [];
      updatedRecuentosSolicitudesPorMes[mes][solicitud.tipoSolicitud].push(indicador);
    });

    console.log('Recuentos de solicitudes por mes (después del cambio de año):', updatedRecuentosSolicitudesPorMes);
    console.log('Sumas de indicadores por tipo (después del cambio de año):', updatedSumasIndicadoresPorTipo);

    setSumasIndicadoresPorTipo(updatedSumasIndicadoresPorTipo);
    setRecuentosSolicitudesPorMes(updatedRecuentosSolicitudesPorMes);
  };

  const IndicadorDiurnoPorFecha = (fechaInicio: string, fechaFin: string) => {
    const fechaInicioMs = new Date(fechaInicio).getTime();
    const fechaFinMs = new Date(fechaFin).getTime();
    const diferenciaMs = fechaFinMs - fechaInicioMs;
    const diferenciaDias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
    const horasNoTrabajadas = diferenciaDias * 8;
    const horasContratadasDiurnas = 240;
    const totalHorasTrabajadas = horasContratadasDiurnas * 200;
    const indicador = (horasNoTrabajadas / totalHorasTrabajadas) * 100;
    return indicador;
  };

  const IndicadorDiurnoPorHora = (horaInicio: string, horaFin: string) => {
    const [horaInicioHora, horaInicioMinuto, horaInicioSegundo] = horaInicio.split(':').map(Number);
    const [horaFinHora, horaFinMinuto, horaFinSegundo] = horaFin.split(':').map(Number);
    const diferenciaHora = horaFinHora - horaInicioHora;
    const diferenciaMinuto = horaFinMinuto - horaInicioMinuto;
    const diferenciaSegundo = horaFinSegundo - horaInicioSegundo;
    const diferenciaTotalSegundos = (diferenciaHora * 3600) + (diferenciaMinuto * 60) + diferenciaSegundo;
    const horasNoTrabajadas = diferenciaTotalSegundos / 3600;
    const horasContratadasDiurnas = 240;
    const totalHorasTrabajadas = horasContratadasDiurnas * 200;
    const indicador = (horasNoTrabajadas / totalHorasTrabajadas) * 100;
    return indicador;
  };

  const tiposSolicitudes = ['Incapacidad', 'CGS', 'SGS', 'Licencias', 'Injustificada'];

  const colorPorTipo = {
    Incapacidad: '#7cb342',
    CGS: '#3949ab',
    SGS: '#ffb74d',
    Licencias: '#00acc1',
    Injustificada: '#e53935',
  };

  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const datasets = tiposSolicitudes.map(tipo => ({
    label: `Solicitudes ${tipo}`,
    data: nombresMeses.map((_nombreMes, index) =>
      (recuentosSolicitudesPorMes[index]?.[tipo] || []).reduce((acc, cur) => acc + cur, 0) || 0
    ),
    backgroundColor: colorPorTipo[tipo as keyof typeof colorPorTipo],
    stack: 'Stack 1',
  }));

  const datosBarras = {
    labels: nombresMeses,
    datasets: datasets,
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
    responsive: true,
    aspectRatio: 5,
    animation: {
      duration: 0,
    },
  };

  if (Object.keys(recuentosSolicitudesPorMes).length === 0) {
    return (
      <div>
        <label htmlFor="yearPicker">Selecciona un año: </label>
        <input
          type="number"
          id="yearPicker"
          value={selectedYear}
          onChange={handleYearChange}
        />
        <Bar data={datosBarras} options={options} />
        <p>No hay datos para el año seleccionado.</p>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor="yearPicker">Selecciona un año: </label>
      <input
        type="number"
        id="yearPicker"
        value={selectedYear}
        onChange={handleYearChange}
      />
      <Bar data={datosBarras} options={options} />
      <div style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', marginTop: '20px' }}>
        <h4 style={{ color: '#333', marginBottom: '10px' }}>Total de Indicadores</h4>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {Object.entries(sumasIndicadoresPorTipo).map(([tipoSolicitud, suma]) => (
            <li key={tipoSolicitud} style={{ marginBottom: '5px' }}>
              <span style={{ fontWeight: 'bold' }}>{tipoSolicitud}:</span> {suma as number}
            </li>
          ))}
          <li style={{ fontWeight: 'bold', marginBottom: '5px', color: Object.values(sumaTotalIndicadores).reduce((acc: number, cur: number) => acc + cur, 0) > 4 ? 'red' : 'inherit' }}>
            <span>Total:</span> {Object.values(sumaTotalIndicadores).reduce((acc: number, cur: number) => acc + cur, 0)}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Bars;