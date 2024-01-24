import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {Chart,CategoryScale,LinearScale,PointElement,BarElement,Title,Tooltip,Legend,Filler} from 'chart.js';

Chart.register(CategoryScale,LinearScale,PointElement,BarElement,Title,Tooltip,Legend,Filler);

const datosAusenciasQuemados = [
  {
    idAusencia: 1,
    fechaAusencia: new Date('2023-01-01'),
    fechaFin: null,
    razon: 'Licencias',
    nombreColaborador: 'Juan',
    idColaborador: 1,
  },
  {
    idAusencia: 2,
    fechaAusencia: new Date('2023-02-01'),
    fechaFin: null,
    razon: 'CGS',
    nombreColaborador: 'María',
    idColaborador: 2,
  },
  {
    idAusencia: 3,
    fechaAusencia: new Date('2023-03-01'),
    fechaFin: null,
    razon: 'SGS',
    nombreColaborador: 'Pedro',
    idColaborador: 3,
  },
  {
    idAusencia: 4,
    fechaAusencia: new Date('2023-04-01'),
    fechaFin: null,
    razon: 'Licencias',
    nombreColaborador: 'Juan',
    idColaborador: 1,
  },
  {
    idAusencia: 5,
    fechaAusencia: new Date('2023-05-01'),
    fechaFin: null,
    razon: 'Injustificada',
    nombreColaborador: 'Juan',
    idColaborador: 1,
  },
  {
    idAusencia: 6,
    fechaAusencia: new Date('2023-06-01'),
    fechaFin: null,
    razon: 'Incapacidad',
    nombreColaborador: 'Juan',
    idColaborador: 1,
  },
  {
    idAusencia: 7,
    fechaAusencia: new Date('2023-07-01'),
    fechaFin: null,
    razon: 'Licencias',
    nombreColaborador: 'Juan',
    idColaborador: 1,
  },
  {
    idAusencia: 8,
    fechaAusencia: new Date('2023-08-01'),
    fechaFin: null,
    razon: 'Licencias',
    nombreColaborador: 'María',
    idColaborador: 2,
  },
  {
    idAusencia: 9,
    fechaAusencia: new Date('2023-09-01'),
    fechaFin: null,
    razon: 'SGS',
    nombreColaborador: 'Pedro',
    idColaborador: 3,
  },
  {
    idAusencia: 10,
    fechaAusencia: new Date('2023-10-01'),
    fechaFin: null,
    razon: 'Incapacidad',
    nombreColaborador: 'Juan',
    idColaborador: 1,
  },
  {
    idAusencia: 11,
    fechaAusencia: new Date('2023-11-01'),
    fechaFin: null,
    razon: 'Injustificada',
    nombreColaborador: 'Juan',
    idColaborador: 1,
  },
  {
    idAusencia: 12,
    fechaAusencia: new Date('2023-12-01'),
    fechaFin: null,
    razon: 'CGS',
    nombreColaborador: 'Juan',
    idColaborador: 1,
  }
];
const initialRecuentosAusenciasPorMes: Record<number, Record<string, number[]>> = {};

const Bars = () => {
  const [selectedDate, setSelectedDate] = useState(formatFirstDayOfYear());
  const [recuentosAusenciasPorMes, setRecuentosAusenciasPorMes] = useState(
    initialRecuentosAusenciasPorMes
  );
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    const selectedYearMonth = new Date(selectedDate);

    const filteredAusencias = datosAusenciasQuemados.filter((ausencia) => {
      const ausenciaDate = new Date(ausencia.fechaAusencia);
      return (
        (!isYearly &&
          ausenciaDate.getFullYear() === selectedYearMonth.getFullYear() &&
          ausenciaDate.getMonth() === selectedYearMonth.getMonth()) ||
        (isYearly && ausenciaDate.getFullYear() === selectedYearMonth.getFullYear())
      );
    });

    let updatedRecuentosAusenciasPorMes = { ...initialRecuentosAusenciasPorMes };

    filteredAusencias.forEach((ausencia) => {
      const fecha = new Date(ausencia.fechaAusencia);
      const mes = fecha.getMonth();

      if (!updatedRecuentosAusenciasPorMes[mes]) {
        updatedRecuentosAusenciasPorMes[mes] = {};
      }

      updatedRecuentosAusenciasPorMes[mes][ausencia.razon] =
        updatedRecuentosAusenciasPorMes[mes][ausencia.razon] || [];
      updatedRecuentosAusenciasPorMes[mes][ausencia.razon].push(ausencia.idAusencia);
    });

    setRecuentosAusenciasPorMes(updatedRecuentosAusenciasPorMes);
  }, [selectedDate, isYearly]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate);
  };

  const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isYearly = event.target.checked;
    setIsYearly(isYearly);
  };
  const tiposAusencias = ['Incapacidad', 'CGS', 'SGS', 'Licencias', 'Injustificada'];

  const colorPorTipo = {
    Incapacidad: '#7cb342',
    CGS: '#3949ab',
    SGS: '#ffb74d',
    Licencias: '#00acc1',
    Injustificada: '#e53935',
  };

  const nombresMeses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  
  const datasets = tiposAusencias.map((tipo) => ({
    label: `Ausencias ${tipo}`,
    data: nombresMeses.map((_nombreMes, index) =>
      (recuentosAusenciasPorMes[index]?.[tipo] || []).length || 0
    ),
    backgroundColor: colorPorTipo[tipo as keyof typeof colorPorTipo],
    stack: 'Stack 1',
  }));
  
  

  const datosBarras = {
    labels: nombresMeses,
    datasets: datasets,
  };

  const misoptions = {
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      afterDraw: (chart: any, _args: any, _options: any) => {
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        const scales = chart.scales;

        if (scales) {
          const yScale = scales.y;

          if (yScale) {
            const tickGap = chartArea.height / (yScale.ticks.length - 1);
            const tickWidth = 10;

            console.log('Drawing red lines...');

            yScale.ticks.forEach((_tick: number, index: number) => {
              const yPosition = chartArea.top + index * tickGap;

              console.log(`Drawing line at yPosition: ${yPosition}`);

              ctx.save();
              ctx.beginPath();
              ctx.moveTo(chartArea.left, yPosition);
              ctx.lineTo(chartArea.left + tickWidth, yPosition);
              ctx.strokeStyle = 'red';
              ctx.lineWidth = 1;
              ctx.setLineDash([5, 5]);
              ctx.stroke();
              ctx.restore();
            });

            console.log('Red lines drawn!');
          }
        }
      },
    },
    responsive: true,
    aspectRatio: 5,
    animation: {
      duration: 0,
    },
  };

  if (Object.keys(recuentosAusenciasPorMes).length === 0) {
    return (
      <div>
        <label htmlFor="datePicker">Selecciona una fecha: </label>
        <input
          type="month"
          id="datePicker"
          value={selectedDate}
          onChange={handleDateChange}
        />
        <Bar data={datosBarras} options={misoptions} />
        <p>No hay datos para la fecha seleccionada.</p>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor="datePicker">Selecciona una fecha: </label>
      <input
        type={isYearly ? 'number' : 'month'}
        id="datePicker"
        value={selectedDate}
        onChange={handleDateChange}
      />
      <label>
        Visualización anual:
        <input
          type="checkbox"
          id="yearlyView"
          checked={isYearly}
          onChange={handleViewChange}
        />
      </label>
      <Bar data={datosBarras} options={misoptions} />
    </div>
  );
};

function formatFirstDayOfYear() {
  const today = new Date();
  return new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
}

export default Bars;