import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import SolicitudService, { Solicitud } from '../../services/solicitud.service';
import { Chart, CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Modal, Table, DatePicker } from 'antd';
import { Moment } from 'moment';
import '../ausencias/graphicStyle.css'

Chart.register(CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend, Filler);

const solicitudService = new SolicitudService();

const Bars = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [recuentosSolicitudesPorMes, setRecuentosSolicitudesPorMes] = useState<Record<number, Record<string, number[]>>>({});
  const [sumasIndicadoresPorTipo, setSumasIndicadoresPorTipo] = useState({});
  const [sumaTotalIndicadores, setSumaTotalIndicadores] = useState<{ [key: string]: number }>({});
  const [modalVisibleAnuales, setModalVisibleAnuales] = useState(false);
  const [modalVisiblePorMes, setModalVisiblePorMes] = useState(false);


  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const solicitudes = await solicitudService.getSolicitudes();
        console.log('Datos de las solicitudes:', solicitudes);
        solicitudes.forEach(solicitud => {
          console.log('Solicitud:', solicitud);
        });
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

      if (solicitud.fechaInicio !== null && solicitud.fechaFin !== null && solicitud.horaInicio === null && solicitud.horaFin === null) {
        indicador = IndicadorDiurnoPorFecha(solicitud.fechaInicio, solicitud.fechaFin);
      } else if (solicitud.fechaInicio !== null && solicitud.fechaFin !== null && solicitud.horaInicio !== null && solicitud.horaFin !== null) {
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
    console.log('diferencias de dias mal:', diferenciaDias);
    const diferenciaDiasCorregido = diferenciaDias + 1;
    console.log('diferencia de dias bien:', diferenciaDiasCorregido);
    const horasNoTrabajadas = diferenciaDiasCorregido * 8;
    console.log('horas no trabajadas', horasNoTrabajadas);
    const horasContratadasDiurnas = 240;
    const totalHorasTrabajadas = horasContratadasDiurnas * 200;
    const indicador = (horasNoTrabajadas / totalHorasTrabajadas) * 100;
    console.log('indicador dias :', indicador);
    return indicador;
  };
  const IndicadorDiurnoPorHora = (horaInicio: string, horaFin: string) => {
    const [horaInicioHora, horaInicioMinuto, horaInicioSegundo] = horaInicio.split(':').map(Number);
    const [horaFinHora, horaFinMinuto, horaFinSegundo] = horaFin.split(':').map(Number);
    const diferenciaHora = horaFinHora - horaInicioHora;
    console.log('diferencia de horas', diferenciaHora);
    const diferenciaMinuto = horaFinMinuto - horaInicioMinuto;
    const diferenciaSegundo = horaFinSegundo - horaInicioSegundo;
    const diferenciaTotalSegundos = (diferenciaHora * 3600) + (diferenciaMinuto * 60) + diferenciaSegundo;
    const horasNoTrabajadas = diferenciaTotalSegundos / 3600;
    const horasContratadasDiurnas = 240;
    const totalHorasTrabajadas = horasContratadasDiurnas * 200;
    const indicador = (horasNoTrabajadas / totalHorasTrabajadas) * 100;
    console.log('indicador horas :', indicador);
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
    borderRadius: 5,
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
    scales: {
      y: {
        beginAtZero: true
      },
      x: {
        title: {
          display: true,
          text: 'Indicador de Ausentismo Diurno',
          font: {
            size: 21,
          }
        },
        grid: {
          display: false
        }
      }
    },
    layout: {
      padding: {
        left: 50,
        right: 50,
        top: 0,
        bottom: 0
      }
    },
    elements: {
      bar: {
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 1
      }
    }
  };

  const handleDatePickerChange1 = (_date: Moment | null, dateString: string | string[]) => {
    if (typeof dateString === 'string') {
      const selectedYear = parseInt(dateString); 
      setSelectedYear(selectedYear); 
    }
  };

  const handleDatePickerChange = (_date: Moment | null, dateString: string | string[]) => {
    if (typeof dateString === 'string') {
      const selectedYear = parseInt(dateString); 
      setSelectedYear(selectedYear); 
    }
  };

  if (Object.keys(recuentosSolicitudesPorMes).length === 0) {
    return (
      <div>
        <DatePicker picker="year" onChange={handleDatePickerChange1} style={{ marginBottom: '1rem' }} />
        <Bar data={datosBarras} options={options} />
        <p>No hay datos para el año seleccionado.</p>
      </div>
    );
  }

  const showModalAnuales = () => {
    setModalVisibleAnuales(true);
  };

  const handleCancelAnuales = () => {
    setModalVisibleAnuales(false);
  };

  const showModalPorMes = () => {
    setModalVisiblePorMes(true);
  };

  const handleCancelPorMes = () => {
    setModalVisiblePorMes(false);
  };
  const dataSource = nombresMeses.map((nombreMes, index) => {
    const Incapacidad = ((recuentosSolicitudesPorMes[index]?.['Incapacidad'] || []).reduce((acc, cur) => acc + cur, 0) || 0).toFixed(2);
    const CGS = ((recuentosSolicitudesPorMes[index]?.['CGS'] || []).reduce((acc, cur) => acc + cur, 0) || 0).toFixed(2);
    const SGS = ((recuentosSolicitudesPorMes[index]?.['SGS'] || []).reduce((acc, cur) => acc + cur, 0) || 0).toFixed(2);
    const Licencias = ((recuentosSolicitudesPorMes[index]?.['Licencias'] || []).reduce((acc, cur) => acc + cur, 0) || 0).toFixed(2);
    const Injustificada = ((recuentosSolicitudesPorMes[index]?.['Injustificada'] || []).reduce((acc, cur) => acc + cur, 0) || 0).toFixed(2);
    
    // Calcular el total por mes
    const totalPorMes = (parseFloat(Incapacidad) + parseFloat(CGS) + parseFloat(SGS) + parseFloat(Licencias) + parseFloat(Injustificada)).toFixed(2);
  
    return {
      month: nombreMes,
      Incapacidad,
      CGS,
      SGS,
      Licencias,
      Injustificada,
      Total: totalPorMes // Agregar el campo de Total
    };
  });
  
  const columns = [
    {
      title: 'Mes',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: 'Incapacidad',
      dataIndex: 'Incapacidad',
      key: 'Incapacidad',
    },
    {
      title: 'CGS',
      dataIndex: 'CGS',
      key: 'CGS',
    },
    {
      title: 'SGS',
      dataIndex: 'SGS',
      key: 'SGS',
    },
    {
      title: 'Licencias',
      dataIndex: 'Licencias',
      key: 'Licencias',
    },
    {
      title: 'Injustificada',
      dataIndex: 'Injustificada',
      key: 'Injustificada',
    },
    {
      title: 'Total', // Agregar la columna de Total
      dataIndex: 'Total',
      key: 'Total',
    },
  ];
  
  const pagination = {
    pageSize: 4,
  };
  const modalContent = (
    <div>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {Object.entries(sumasIndicadoresPorTipo).map(([tipoSolicitud, suma]) => (
          <li key={tipoSolicitud} style={{ marginBottom: '5px' }}>
            <span style={{ fontWeight: 'bold' }}>{tipoSolicitud}:</span> {parseFloat(suma as string).toFixed(2)}
          </li>
        ))}
        <li style={{ fontWeight: 'bold', marginBottom: '5px', color: Object.values(sumaTotalIndicadores).reduce((acc: number, cur: number) => acc + cur, 0) > 4 ? 'red' : 'inherit' }}>
          <span>Total:</span> {parseFloat(Object.values(sumaTotalIndicadores).reduce((acc: number, cur: number) => acc + cur, 0).toFixed(2))}
        </li>
      </ul>
    </div>
  );

  return (
    <div style={{ maxWidth: '800px', minWidth: '400px', width: '100%', margin: '0 auto', marginLeft: '-1rem' }}>
      <div style={{ position: 'relative', width: '100%', height: 0, paddingBottom: '50%', minWidth: '61rem', minHeight: '50rem', marginLeft: '2rem' }}>
        <DatePicker picker="year" onChange={handleDatePickerChange} style={{ marginBottom: '1rem' }} />
        <Bar data={datosBarras} options={options} />
        <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '1rem', marginTop: '1rem' }}>
          <button
            onClick={showModalAnuales}
            style={{
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
              transition: 'background-color 0.3s',
            }}
          >
            Detalles Anuales
          </button>
          <button
            onClick={showModalPorMes}
            style={{
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
              transition: 'background-color 0.3s',
              marginLeft: '1.5rem'
            }}
          >
            Detalles Por Mes
          </button>
          <Modal
            title="Total de Indicadores Anuales"
            visible={modalVisibleAnuales}
            onCancel={handleCancelAnuales}
            footer={null}
            centered
          >
            {modalContent}
          </Modal>
          <Modal
            title="Detalles Por Mes"
            visible={modalVisiblePorMes}
            onCancel={handleCancelPorMes}
            footer={null}
            style={{ minWidth: '50%' }}
            centered
          >
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={pagination}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Bars;