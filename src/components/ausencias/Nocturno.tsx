import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend, Filler);

const datosSolicitudesQuemados = [
  {
    idSolicitud: 1,
    conGoceSalarial: true,
    tipoSolicitud: "CGS",
    asunto: "Vacaciones de verano",
    nombreColaborador: "Juan Perez",
    nombreEncargado: "María García",
    fechaSolicitud: "2024-01-02T00:00:00.000Z",
    fechaInicio: "2024-01-15T00:00:00.000Z",
    fechaFin: "2024-01-31T00:00:00.000Z",
    horaInicio: null,
    horaFin: null,
    sustitucion: "SI",
    nombreSustituto: "Pedro Ramirez",
    estado: "Aprobado",
    comentarioTalentoHumano: null,
    idColaborador: 12345
  },
  {
    idSolicitud: 2,
    conGoceSalarial: true,
    tipoSolicitud: "Incapacidad",
    asunto: "Vacaciones de verano",
    nombreColaborador: "Juan Perez",
    nombreEncargado: "María García",
    fechaSolicitud: "2024-02-01T00:00:00.000Z",
    fechaInicio: "2024-02-15T00:00:00.000Z",
    fechaFin: "2024-02-29T00:00:00.000Z",
    horaInicio: null,
    horaFin: null,
    sustitucion: "SI",
    nombreSustituto: "Pedro Ramirez",
    estado: "Aprobado",
    comentarioTalentoHumano: null,
    idColaborador: 12345
  },
  {
    idSolicitud: 3,
    conGoceSalarial: true,
    tipoSolicitud: "Licencias",
    asunto: "Vacaciones de verano",
    nombreColaborador: "Juan Perez",
    nombreEncargado: "María García",
    fechaSolicitud: "2024-03-01T00:00:00.000Z",
    fechaInicio: "2024-03-15T00:00:00.000Z",
    fechaFin: "2024-03-31T00:00:00.000Z",
    horaInicio: null,
    horaFin: null,
    sustitucion: "SI",
    nombreSustituto: "Pedro Ramirez",
    estado: "Aprobado",
    comentarioTalentoHumano: null,
    idColaborador: 12345
  },
  {
    idSolicitud: 4,
    conGoceSalarial: true,
    tipoSolicitud: "Injustificada",
    asunto: "Vacaciones de verano",
    nombreColaborador: "Juan Perez",
    nombreEncargado: "María García",
    fechaSolicitud: "2024-04-01T00:00:00.000Z",
    fechaInicio: "2024-04-15T00:00:00.000Z",
    fechaFin: "2024-04-16T00:00:00.000Z",
    horaInicio: null,
    horaFin: null,
    sustitucion: "SI",
    nombreSustituto: "Pedro Ramirez",
    estado: "Aprobado",
    comentarioTalentoHumano: null,
    idColaborador: 12345
  },
  {
    idSolicitud: 5,
    conGoceSalarial: true,
    tipoSolicitud: "CGS",
    asunto: "Vacaciones de verano",
    nombreColaborador: "Juan Perez",
    nombreEncargado: "María García",
    fechaSolicitud: "2024-05-01T00:00:00.000Z",
    fechaInicio: null,
    fechaFin: null,
    horaInicio: "08:00:00",
    horaFin: "10:00:00",
    sustitucion: "SI",
    nombreSustituto: "Pedro Ramirez",
    estado: "Aprobado",
    comentarioTalentoHumano: null,
    idColaborador: 12345
  },
  {
    idSolicitud: 6,
    conGoceSalarial: true,
    tipoSolicitud: "SGS",
    asunto: "Vacaciones de verano",
    nombreColaborador: "Juan Perez",
    nombreEncargado: "María García",
    fechaSolicitud: "2024-06-01T00:00:00.000Z",
    fechaInicio: "2024-06-15T00:00:00.000Z",
    fechaFin: "2024-06-30T00:00:00.000Z",
    horaInicio: null,
    horaFin: null,
    sustitucion: "SI",
    nombreSustituto: "Pedro Ramirez",
    estado: "Aprobado",
    comentarioTalentoHumano: null,
    idColaborador: 12345
  },
  {
    idSolicitud: 7,
    conGoceSalarial: true,
    tipoSolicitud: "Incapacidad",
    asunto: "Vacaciones de verano",
    nombreColaborador: "Juan Perez",
    nombreEncargado: "María García",
    fechaSolicitud: "2024-07-01T00:00:00.000Z",
    fechaInicio: "2024-07-15T00:00:00.000Z",
    fechaFin: "2024-07-31T00:00:00.000Z",
    horaInicio: null,
    horaFin: null,
    sustitucion: "SI",
    nombreSustituto: "Pedro Ramirez",
    estado: "Aprobado",
    comentarioTalentoHumano: null,
    idColaborador: 12345
  },
  {
    idSolicitud: 8,
    conGoceSalarial: true,
    tipoSolicitud: "Licencias",
    asunto: "Vacaciones de verano",
    nombreColaborador: "Juan Perez",
    nombreEncargado: "María García",
    fechaSolicitud: "2024-08-01T00:00:00.000Z",
    fechaInicio: "2024-08-15T00:00:00.000Z",
    fechaFin: "2024-08-31T00:00:00.000Z",
    horaInicio: null,
    horaFin: null,
    sustitucion: "SI",
    nombreSustituto: "Pedro Ramirez",
    estado: "Aprobado",
    comentarioTalentoHumano: null,
    idColaborador: 12345
  },
  {
    idSolicitud: 9,
    conGoceSalarial: true,
    tipoSolicitud: "Injustificada",
    asunto: "Vacaciones de verano",
    nombreColaborador: "Juan Perez",
    nombreEncargado: "María García",
    fechaSolicitud: "2024-09-01T00:00:00.000Z",
    fechaInicio: "2024-09-15T00:00:00.000Z",
    fechaFin: "2024-09-30T00:00:00.000Z",
    horaInicio: null,
    horaFin: null,
    sustitucion: "SI",
    nombreSustituto: "Pedro Ramirez",
    estado: "Aprobado",
    comentarioTalentoHumano: null,
    idColaborador: 12345
  },
  {
    idSolicitud: 10,
    conGoceSalarial: true,
    tipoSolicitud: "CGS",
    asunto: "Vacaciones de verano",
    nombreColaborador: "Juan Perez",
    nombreEncargado: "María García",
    fechaSolicitud: "2024-10-01T00:00:00.000Z",
    fechaInicio: "2024-10-15T00:00:00.000Z",
    fechaFin: "2024-10-31T00:00:00.000Z",
    horaInicio: null,
    horaFin: null,
    sustitucion: "SI",
    nombreSustituto: "Pedro Ramirez",
    estado: "Aprobado",
    comentarioTalentoHumano: null,
    idColaborador: 12345
  },
  {
    idSolicitud: 11,
    conGoceSalarial: true,
    tipoSolicitud: "SGS",
    asunto: "Vacaciones de verano",
    nombreColaborador: "Juan Perez",
    nombreEncargado: "María García",
    fechaSolicitud: "2024-11-01T00:00:00.000Z",
    fechaInicio: "2024-11-15T00:00:00.000Z",
    fechaFin: "2024-11-30T00:00:00.000Z",
    horaInicio: null,
    horaFin: null,
    sustitucion: "SI",
    nombreSustituto: "Pedro Ramirez",
    estado: "Aprobado",
    comentarioTalentoHumano: null,
    idColaborador: 12345
  },
  {
    idSolicitud: 12,
    conGoceSalarial: true,
    tipoSolicitud: "Incapacidad",
    asunto: "Vacaciones de verano",
    nombreColaborador: "Juan Perez",
    nombreEncargado: "María García",
    fechaSolicitud: "2024-12-01T00:00:00.000Z",
    fechaInicio: "2024-12-15T00:00:00.000Z",
    fechaFin: "2024-12-31T00:00:00.000Z",
    horaInicio: null,
    horaFin: null,
    sustitucion: "SI",
    nombreSustituto: "Pedro Ramirez",
    estado: "Aprobado",
    comentarioTalentoHumano: null,
    idColaborador: 12345
  },
  {
    idSolicitud: 13,
    conGoceSalarial: true,
    tipoSolicitud: "CGS",
    asunto: "Vacaciones de verano",
    nombreColaborador: "Juan Perez",
    nombreEncargado: "María García",
    fechaSolicitud: "2024-05-01T00:00:00.000Z",
    fechaInicio: "2024-12-15T00:00:00.000Z",
    fechaFin: "2024-12-31T00:00:00.000Z",
    horaInicio: null,
    horaFin: null,
    sustitucion: "SI",
    nombreSustituto: "Pedro Ramirez",
    estado: "Aprobado",
    comentarioTalentoHumano: null,
    idColaborador: 12345
  },
  {
    idSolicitud: 14,
    conGoceSalarial: true,
    tipoSolicitud: "CGS",
    asunto: "Vacaciones de verano",
    nombreColaborador: "Juan Perez",
    nombreEncargado: "María García",
    fechaSolicitud: "2023-05-01T00:00:00.000Z",
    fechaInicio: "2024-12-15T00:00:00.000Z",
    fechaFin: "2024-12-31T00:00:00.000Z",
    horaInicio: null,
    horaFin: null,
    sustitucion: "SI",
    nombreSustituto: "Pedro Ramirez",
    estado: "Aprobado",
    comentarioTalentoHumano: null,
    idColaborador: 12345
  }
];
const initialRecuentosSolicitudesPorMes: Record<number, Record<string, number[]>> = {};

const Bars = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [recuentosSolicitudesPorMes, setRecuentosSolicitudesPorMes] = useState(initialRecuentosSolicitudesPorMes);
  const [sumasIndicadoresPorTipo, setSumasIndicadoresPorTipo] = useState({});
  const [sumaTotalIndicadores, setSumaTotalIndicadores] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const filteredSolicitudes = datosSolicitudesQuemados.filter(solicitud => {
      const fechaSolicitud = new Date(solicitud.fechaSolicitud);
      return fechaSolicitud.getFullYear() === selectedYear && solicitud.estado === "Aprobado";
    });

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

    setSumaTotalIndicadores(updatedSumaTotalIndicadores);
    setSumasIndicadoresPorTipo(updatedSumasIndicadoresPorTipo);
    setRecuentosSolicitudesPorMes(updatedRecuentosSolicitudesPorMes);
  }, [selectedYear]);

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedYear = parseInt(event.target.value);
    setSelectedYear(selectedYear);

    const filteredSolicitudes = datosSolicitudesQuemados.filter(solicitud => {
      const fechaSolicitud = new Date(solicitud.fechaSolicitud);
      return fechaSolicitud.getFullYear() === selectedYear && solicitud.estado === "Aprobado";
    });

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
  /*const IndicadorNocturnoPorFecha = (fechaInicio: string, fechaFin: string) => {
    const fechaInicioMs = new Date(fechaInicio).getTime();
    const fechaFinMs = new Date(fechaFin).getTime();
    const diferenciaMs = fechaFinMs - fechaInicioMs;
    const diferenciaDias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
    const horasNoTrabajadas = diferenciaDias * 8;
    const horasContratadasNocturnas = 180;
    const totalHorasTrabajadas = horasContratadasNocturnas * 200;
    const indicador = (horasNoTrabajadas / totalHorasTrabajadas) * 100;
    return indicador;
  };
  const IndicadorNocturnoPorHoras = (horaInicio: string, horaFin: string) => {
    const [horaInicioHora, horaInicioMinuto, horaInicioSegundo] = horaInicio.split(':').map(Number);
    const [horaFinHora, horaFinMinuto, horaFinSegundo] = horaFin.split(':').map(Number);
    const diferenciaHora = horaFinHora - horaInicioHora;
    const diferenciaMinuto = horaFinMinuto - horaInicioMinuto;
    const diferenciaSegundo = horaFinSegundo - horaInicioSegundo;
    const diferenciaTotalSegundos = (diferenciaHora * 3600) + (diferenciaMinuto * 60) + diferenciaSegundo;
    const horasNoTrabajadas = diferenciaTotalSegundos / 3600;
    const horasContratadasNocturnas = 180;
    const totalHorasTrabajadas = horasContratadasNocturnas * 200;
    const indicador = (horasNoTrabajadas / totalHorasTrabajadas) * 100;
    return indicador;
  };*/


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
        <li style={{ fontWeight: 'bold', marginBottom: '5px', color: Object.values(sumaTotalIndicadores).reduce((acc: number, cur: number) => acc + cur, 0) > 4 ? 'red' : 'inherit'}}>
  <span>Total:</span> {Object.values(sumaTotalIndicadores).reduce((acc: number, cur: number) => acc + cur, 0)}
</li>
      </ul>
    </div>
  </div>
);
};

export default Bars;