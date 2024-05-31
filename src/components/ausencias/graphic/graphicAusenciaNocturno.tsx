import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import SolicitudService, { Solicitud } from '../../../services/solicitud.service';
import ColaboradorService, { Colaborador } from '../../../services/colaborador.service';
import { IndicadorNocturnoPorFecha, IndicadorNocturnoPorHora } from './funtionsGraphic';
import { Chart, CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Tabs, Tab } from '@mui/material';
import { Table, DatePicker, Drawer, } from 'antd';
import moment, { Moment } from 'moment';
import dayjs from 'dayjs';
import './graphicStyle.css'
import DatePickerRadioGroup from './datePickerRadioGroup';

Chart.register(CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend, Filler);

const solicitudService = new SolicitudService();
const colaboradorService = new ColaboradorService();

const BarsNocturno = () => {
  const [selectedYear, setSelectedYear] = React.useState(moment().year());
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [cantidadActivos, setCantidadActivos] = useState(0);
  const [recuentosSolicitudesPorMes, setRecuentosSolicitudesPorMes] = useState<Record<number, Record<string, number[]>>>({});
  const [sumasIndicadoresPorTipo, setSumasIndicadoresPorTipo] = useState<SumasIndicadoresPorTipo>({});
  const [_sumaTotalIndicadores, setSumaTotalIndicadores] = useState<{ [key: string]: number }>({});
  const [tiposSolicitudesPorUnidad, setTiposSolicitudesPorUnidad] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [radioValue, setRadioValue] = useState(1);

  type SumasIndicadoresPorTipo = {
    [tipo: string]: number;
  };
  type TiposSolicitudesConIndicadoresPorUnidad = Record<string, Record<string, number>>;

  useEffect(() => {
    const fetchColaboradores = async () => {
      try {
        const todosLosColaboradores = await colaboradorService.obtenerColaboradores();

        const colaboradoresActivosOConSalidaEnAnioSeleccionado = todosLosColaboradores.filter(colaborador => {

          const esActivo = colaborador.estado === 'Activo' &&
            colaborador.fechaIngreso && dayjs(colaborador.fechaIngreso).year()
            <= selectedYear;

          const esInactivoConFechaEnAnioSeleccionado = colaborador.estado === 'Inactivo' &&
            colaborador.fechaSalida && dayjs(colaborador.fechaSalida).year() >= selectedYear
            && colaborador.fechaIngreso && dayjs(colaborador.fechaIngreso).year() <= selectedYear;
          return esActivo || esInactivoConFechaEnAnioSeleccionado;
        });

        setCantidadActivos(colaboradoresActivosOConSalidaEnAnioSeleccionado.length);
        const colaboradoresDiurnosActivos = colaboradoresActivosOConSalidaEnAnioSeleccionado.filter(colaborador =>
          colaborador.tipoJornada === 'Nocturna'
        );
        console.log("colaboradores con jornada Nocturna", colaboradoresDiurnosActivos);
        setColaboradores(colaboradoresDiurnosActivos);

        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchColaboradores();
  }, []);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const allSolicitudes = await solicitudService.getSolicitudes();
        const solicitudesFiltradas = allSolicitudes.filter(solicitud => {
          const solicitudYear = dayjs(solicitud.fechaSolicitud).year();
          return solicitudYear === selectedYear;
        });
        console.log("Las solicitudes", solicitudesFiltradas);
        setSolicitudes(solicitudesFiltradas);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchSolicitudes();
  }, [selectedYear]);

  useEffect(() => {
    const filteredSolicitudes = solicitudes.filter(solicitud => {
      const esDiurnoYActivo = colaboradores.some(colaborador =>
        colaborador.idColaborador === solicitud.idColaborador &&
        colaborador.tipoJornada === 'Nocturna'
      );

      const fechaSolicitud = dayjs(solicitud.fechaSolicitud);
      let goceSalarialCondition = true;

      if (radioValue === 2) {
        goceSalarialCondition = solicitud.conGoceSalarial === false;
      } else if (radioValue === 3) {
        goceSalarialCondition = solicitud.conGoceSalarial === true;
      }

      return esDiurnoYActivo &&
        fechaSolicitud.year() === selectedYear &&
        solicitud.estado === "Aprobado" &&
        goceSalarialCondition;
    });
    console.log("Solicitudes filtradas:", filteredSolicitudes);
    let updatedRecuentosSolicitudesPorMes: Record<number, Record<string, number[]>> = {};
    let updatedSumasIndicadoresPorTipo: { [key: string]: number } = {};
    let updatedSumaTotalIndicadores: { [key: string]: number } = {};
    let updatedTiposSolicitudesPorUnidad: TiposSolicitudesConIndicadoresPorUnidad = {};

    filteredSolicitudes.forEach(solicitud => {

      let indicador = 0;

      if (solicitud.fechaInicio !== null && solicitud.fechaFin !== null && solicitud.horaInicio === null && solicitud.horaFin === null) {
        indicador = IndicadorNocturnoPorFecha(solicitud.fechaInicio!, solicitud.fechaFin!, cantidadActivos);
      } else if (solicitud.fechaInicio !== null && solicitud.fechaFin !== null && solicitud.horaInicio !== null && solicitud.horaFin !== null) {
        indicador = IndicadorNocturnoPorHora(solicitud.horaInicio!, solicitud.horaFin!, cantidadActivos);
      }
      if (!updatedSumasIndicadoresPorTipo[solicitud.tipoSolicitud]) {
        updatedSumasIndicadoresPorTipo[solicitud.tipoSolicitud] = 0;
      }

      updatedSumasIndicadoresPorTipo[solicitud.tipoSolicitud] += indicador;

      const fecha = dayjs(solicitud.fechaSolicitud);
      const mes = fecha.month();

      const unidad = solicitud.colaborador?.unidad;
      const tipoSolicitud = solicitud.tipoSolicitud;

      if (unidad) {
        if (!updatedTiposSolicitudesPorUnidad[unidad]) {
          updatedTiposSolicitudesPorUnidad[unidad] = {};
        }
        if (!updatedTiposSolicitudesPorUnidad[unidad][tipoSolicitud]) {
          updatedTiposSolicitudesPorUnidad[unidad][tipoSolicitud] = 0;
        }
        updatedTiposSolicitudesPorUnidad[unidad][tipoSolicitud] += indicador;
      }

      if (!updatedRecuentosSolicitudesPorMes[mes]) {
        updatedRecuentosSolicitudesPorMes[mes] = {};
      }

      updatedRecuentosSolicitudesPorMes[mes][solicitud.tipoSolicitud] = updatedRecuentosSolicitudesPorMes[mes][solicitud.tipoSolicitud] || [];
      updatedRecuentosSolicitudesPorMes[mes][solicitud.tipoSolicitud].push(indicador);
    });

    Object.keys(updatedSumasIndicadoresPorTipo).forEach(tipo => {
      updatedSumaTotalIndicadores[tipo] = updatedSumasIndicadoresPorTipo[tipo];
    });

    //console.log(updatedTiposSolicitudesPorUnidad);
    setTiposSolicitudesPorUnidad(updatedTiposSolicitudesPorUnidad);
    setSumaTotalIndicadores(updatedSumaTotalIndicadores);
    setSumasIndicadoresPorTipo(updatedSumasIndicadoresPorTipo);
    setRecuentosSolicitudesPorMes(updatedRecuentosSolicitudesPorMes);
  }, [solicitudes, selectedYear, radioValue, cantidadActivos]);

  const handleYearChange = (_date: Moment | null, dateString: string | string[]) => {
    if (dateString && typeof dateString === 'string') {
      const selectedYear = moment(dateString, 'YYYY').year();
      setSelectedYear(selectedYear);
      setLoading(true);

      const fetchData = async () => {
        try {
          const solicitudes = await solicitudService.getSolicitudes();
          setSolicitudes(solicitudes);
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
      };
      fetchData();
    }


    const filteredSolicitudes = solicitudes.filter(solicitud => {
      const fechaSolicitud = new Date(solicitud.fechaSolicitud);
      let goceSalarialCondition = true;

      if (radioValue === 2) {
        goceSalarialCondition = solicitud.conGoceSalarial === false;
      } else if (radioValue === 3) {
        goceSalarialCondition = solicitud.conGoceSalarial === true;
      }

      return fechaSolicitud.getFullYear() === selectedYear && solicitud.estado === "Aprobado" && goceSalarialCondition;
    });

    let updatedRecuentosSolicitudesPorMes: Record<number, Record<string, number[]>> = {};
    let updatedSumasIndicadoresPorTipo: { [key: string]: number } = {};

    filteredSolicitudes.forEach(solicitud => {
      let indicador = 0;

      if (solicitud.fechaInicio !== null && solicitud.fechaFin !== null && solicitud.horaInicio === null && solicitud.horaFin === null) {
        indicador = IndicadorNocturnoPorFecha(solicitud.fechaInicio!, solicitud.fechaFin!, cantidadActivos);
      } else if (solicitud.fechaInicio !== null && solicitud.fechaFin !== null && solicitud.horaInicio !== null && solicitud.horaFin !== null) {
        indicador = IndicadorNocturnoPorHora(solicitud.horaInicio!, solicitud.horaFin!, cantidadActivos);
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

    //console.log(filteredSolicitudes,);
    //console.log(updatedSumasIndicadoresPorTipo);
    setSumasIndicadoresPorTipo(updatedSumasIndicadoresPorTipo);
    setRecuentosSolicitudesPorMes(updatedRecuentosSolicitudesPorMes);
  };

  const tiposSolicitudes = ['Permisos', 'Vacaciones', 'Incapacidad', 'Licencias', 'Injustificada'];

  const colorPorTipo = {
    Permisos: '#7cb342',
    Vacaciones: '#3949ab',
    Incapacidad: '#ffb74d',
    Licencias: '#00acc1',
    Injustificada: '#e53935',
  };

  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const datasets = tiposSolicitudes.map(tipo => ({
    label: `Solicitud ${tipo}`,
    data: nombresMeses.map((_nombreMes, index) =>
      ((recuentosSolicitudesPorMes[index]?.[tipo] || []).reduce((acc, cur) => acc + cur, 0) || 0).toFixed(2)
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
        beginAtZero: true,
        ticks: {
          callback: function (value: string | number) {
            const numberValue = typeof value === 'string' ? parseFloat(value) : value;
            return numberValue + '%';
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Indicador de Ausentismo Nocturno',
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

  if (Object.keys(recuentosSolicitudesPorMes).length === 0) {
    return (
      <div>
        <DatePicker picker="year" onChange={handleYearChange} style={{ marginBottom: '2rem', marginLeft: '1rem' }} />
        <Bar data={datosBarras} options={options} />
        <p>No hay datos para el año seleccionado.</p>
      </div>
    );
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const showDrawer = () => {
    setDrawerOpen(true);
  };

  const onCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const dataSourceNew = Object.entries(tiposSolicitudesPorUnidad).map(([unidad, tipo]) => {

    let Permisos = 0, Vacaciones = 0, Incapacidad = 0, Licencias = 0, Injustificada = 0;

    Object.entries(tipo as Record<string, number>).forEach(([tipoSolicitud, indicador]) => {
      const valorIndicador = indicador as number;
      switch (tipoSolicitud) {
        case 'Permisos':
          Permisos = valorIndicador;
          break;
        case 'Vacaciones':
          Vacaciones = valorIndicador;
          break;
        case 'Incapacidad':
          Incapacidad = valorIndicador;
          break;
        case 'Licencias':
          Licencias = valorIndicador;
          break;
        case 'Injustificada':
          Injustificada = valorIndicador;
          break;
      }
    });

    const totalPorUnidad = (Permisos + Vacaciones + Incapacidad + Licencias + Injustificada).toFixed(2) + '%';

    return {
      unidad: unidad,
      Permisos: Permisos.toFixed(2) + '%',
      Vacaciones: Vacaciones.toFixed(2) + '%',
      Incapacidad: Incapacidad.toFixed(2) + '%',
      Licencias: Licencias.toFixed(2) + '%',
      Injustificada: Injustificada.toFixed(2) + '%',
      Total: totalPorUnidad
    };
  });

  const columnsNew = [
    {
      title: 'Unidad',
      dataIndex: 'unidad',
      key: 'unidad',
    },
    {
      title: 'Permisos',
      dataIndex: 'Permisos',
      key: 'Permisos',
    },
    {
      title: 'Vacaciones',
      dataIndex: 'Vacaciones',
      key: 'Vacaciones',
    },
    {
      title: 'Incapacidad',
      dataIndex: 'Incapacidad',
      key: 'Incapacidad',
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
      title: 'Total',
      dataIndex: 'Total',
      key: 'Total',
    },
  ];

  const dataSource = nombresMeses.map((nombreMes, index) => {
    const Permisos = ((recuentosSolicitudesPorMes[index]?.['Permisos'] || []).reduce((acc, cur) => acc + cur, 0) || 0).toFixed(2) + '%';
    const Vacaciones = ((recuentosSolicitudesPorMes[index]?.['Vacaciones'] || []).reduce((acc, cur) => acc + cur, 0) || 0).toFixed(2) + '%';
    const Incapacidad = ((recuentosSolicitudesPorMes[index]?.['Incapacidad'] || []).reduce((acc, cur) => acc + cur, 0) || 0).toFixed(2) + '%';
    const Licencias = ((recuentosSolicitudesPorMes[index]?.['Licencias'] || []).reduce((acc, cur) => acc + cur, 0) || 0).toFixed(2) + '%';
    const Injustificada = ((recuentosSolicitudesPorMes[index]?.['Injustificada'] || []).reduce((acc, cur) => acc + cur, 0) || 0).toFixed(2) + '%';

    const totalPorMes = (parseFloat(Permisos) + parseFloat(Vacaciones) + parseFloat(Incapacidad) + parseFloat(Licencias) + parseFloat(Injustificada)).toFixed(2) + '%';

    return {
      month: nombreMes,
      Permisos,
      Vacaciones,
      Incapacidad,
      Licencias,
      Injustificada,
      Total: totalPorMes
    };
  });

  const columns = [
    {
      title: 'Mes',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: 'Permisos',
      dataIndex: 'Permisos',
      key: 'Permisos',
    },
    {
      title: 'Vacaciones',
      dataIndex: 'Vacaciones',
      key: 'Vacaciones',
    },
    {
      title: 'Incapacidad',
      dataIndex: 'Incapacidad',
      key: 'Incapacidad',
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
      title: 'Total',
      dataIndex: 'Total',
      key: 'Total',
    },
  ];

  const pagination = {
    pageSize: 4,
  };


  const anualContent = (
    <div>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {Object.entries(sumasIndicadoresPorTipo).map(([tipoSolicitud, suma]) => (
          <li key={tipoSolicitud} style={{ marginBottom: '5px' }}>
            <span style={{ fontWeight: 'bold' }}>{tipoSolicitud}:</span> {suma.toFixed(2) + '%'}
          </li>
        ))}
        <li style={{ fontWeight: 'bold', marginBottom: '5px', color: Object.values(sumasIndicadoresPorTipo).reduce((acc, cur) => acc + cur, 0) > 4 ? 'red' : 'inherit' }}>
          <span>Total Anual:</span> {parseFloat(Object.values(sumasIndicadoresPorTipo).reduce((acc, cur) => acc + cur, 0).toFixed(2)) + '%'}
        </li>
      </ul>
    </div>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}> { }
        <CircularProgress /> { }
      </Box>
    );
  }

  return (
    <div style={{ maxWidth: '800px', minWidth: '400px', width: '100%', margin: '0 auto', marginLeft: '-1rem' }}>
      <div style={{ position: 'relative', width: '100%', height: 0, paddingBottom: '50%', minWidth: '61rem', minHeight: '50rem', marginLeft: '2rem' }}>
      <DatePickerRadioGroup
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        radioValue={radioValue}
        setRadioValue={setRadioValue}
      />
        <Bar data={datosBarras} options={options} />
        <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '1rem', marginTop: '1rem' }}>
          <button
            onClick={showDrawer}
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
            Detalles de Grafico
          </button>
          <Drawer
            title="Detalles de Grafico"
            placement="right"
            closable={false}
            onClose={onCloseDrawer}
            open={drawerOpen}
            width={725}
          >
            <Tabs value={tabIndex} onChange={handleTabChange}>
              <Tab label="Anual" />
              <Tab label="Mesual" />
              <Tab label="Departamentos" />
            </Tabs>
            {tabIndex === 0 && (
              <div>
                {anualContent}
              </div>
            )}
            {tabIndex === 1 && (
              <div>
                <Table
                  dataSource={dataSource}
                  columns={columns}
                  pagination={pagination}
                />
              </div>
            )}
            {tabIndex === 2 && (
              <div>
                <Table
                  dataSource={dataSourceNew}
                  columns={columnsNew}
                  pagination={pagination}
                />
              </div>
            )}
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default BarsNocturno;