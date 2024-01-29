import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend, Filler);

const datosAusenciasQuemados = [
  {
    idAusencia: 1,
    fechaAusencia: new Date('2023-01-07'),
    fechaFin: null,
    razon: 'Licencias',
    nombreColaborador: 'Juan',
    idColaborador: 1,
  },
  {
    idAusencia: 2,
    fechaAusencia: new Date('2023-02-06'),
    fechaFin: null,
    razon: 'CGS',
    nombreColaborador: 'María',
    idColaborador: 2,
  },
  {
    idAusencia: 3,
    fechaAusencia: new Date('2023-03-09'),
    fechaFin: null,
    razon: 'SGS',
    nombreColaborador: 'Pedro',
    idColaborador: 3,
  },
  {
    idAusencia: 4,
    fechaAusencia: new Date('2023-04-12'),
    fechaFin: null,
    razon: 'Licencias',
    nombreColaborador: 'Juan',
    idColaborador: 1,
  },
  {
    idAusencia: 5,
    fechaAusencia: new Date('2023-05-19'),
    fechaFin: null,
    razon: 'Injustificada',
    nombreColaborador: 'Juan',
    idColaborador: 1,
  },
  {
    idAusencia: 6,
    fechaAusencia: new Date('2023-06-17'),
    fechaFin: null,
    razon: 'Incapacidad',
    nombreColaborador: 'Juan',
    idColaborador: 1,
  },
  {
    idAusencia: 7,
    fechaAusencia: new Date('2023-07-28'),
    fechaFin: null,
    razon: 'Licencias',
    nombreColaborador: 'Juan',
    idColaborador: 1,
  },
  {
    idAusencia: 8,
    fechaAusencia: new Date('2023-08-30'),
    fechaFin: null,
    razon: 'Licencias',
    nombreColaborador: 'María',
    idColaborador: 2,
  },
  {
    idAusencia: 9,
    fechaAusencia: new Date('2023-09-10'),
    fechaFin: null,
    razon: 'SGS',
    nombreColaborador: 'Pedro',
    idColaborador: 3,
  },
  {
    idAusencia: 10,
    fechaAusencia: new Date('2023-10-26'),
    fechaFin: null,
    razon: 'Incapacidad',
    nombreColaborador: 'Juan',
    idColaborador: 1,
  },
  {
    idAusencia: 11,
    fechaAusencia: new Date('2023-11-20'),
    fechaFin: null,
    razon: 'Injustificada',
    nombreColaborador: 'Juan',
    idColaborador: 1,
  },
  {
    idAusencia: 12,
    fechaAusencia: new Date('2023-12-15'),
    fechaFin: null,
    razon: 'CGS',
    nombreColaborador: 'Juan',
    idColaborador: 1,
  },
  {
    idAusencia: 13,
    fechaAusencia: new Date('2023-01-19'),
    fechaFin: null,
    razon: 'CGS',
    nombreColaborador: 'Roberto',
    idColaborador: 3,
  },
  {
    idAusencia: 14,
    fechaAusencia: new Date('2023-01-27'),
    fechaFin: null,
    razon: 'Licencias',
    nombreColaborador: 'Manuelito',
    idColaborador: 4,
  },
  {
    idAusencia: 15,
    fechaAusencia: new Date('2024-01-06'),
    fechaFin: null,
    razon: 'Licencias',
    nombreColaborador: 'Juan',
    idColaborador: 1,
  },
  {
    idAusencia: 16,
    fechaAusencia: new Date('2024-02-05'),
    fechaFin: null,
    razon: 'CGS',
    nombreColaborador: 'María',
    idColaborador: 2,
  },
  {
    idAusencia: 17,
    fechaAusencia: new Date('2024-03-09'),
    fechaFin: null,
    razon: 'SGS',
    nombreColaborador: 'Pedro',
    idColaborador: 3,
  },
  {
    idAusencia: 18,
    fechaAusencia: new Date('2024-04-12'),
    fechaFin: null,
    razon: 'Licencias',
    nombreColaborador: 'Juan',
    idColaborador: 1,
  },
  {
    idAusencia: 19,
    fechaAusencia: new Date('2024-05-19'),
    fechaFin: null,
    razon: 'Injustificada',
    nombreColaborador: 'Juan',
    idColaborador: 1,
  },
  {
    idAusencia: 20,
    fechaAusencia: new Date('2024-06-17'),
    fechaFin: null,
    razon: 'Incapacidad',
    nombreColaborador: 'Juan',
    idColaborador: 1,
  },
  {
    idAusencia: 21,
    fechaAusencia: new Date('2024-07-28'),
    fechaFin: null,
    razon: 'Licencias',
    nombreColaborador: 'Juan',
    idColaborador: 1,
  },
  {
    idAusencia: 22,
    fechaAusencia: new Date('2024-08-30'),
    fechaFin: null,
    razon: 'Licencias',
    nombreColaborador: 'María',
    idColaborador: 2,
  },
  {
    idAusencia: 23,
    fechaAusencia: new Date('2024-09-10'),
    fechaFin: null,
    razon: 'SGS',
    nombreColaborador: 'Pedro',
    idColaborador: 3,
  },
  {
    idAusencia: 24,
    fechaAusencia: new Date('2024-10-26'),
    fechaFin: null,
    razon: 'Incapacidad',
    nombreColaborador: 'Juan',
    idColaborador: 1,
  },
  {
    idAusencia: 25,
    fechaAusencia: new Date('2024-11-20'),
    fechaFin: null,
    razon: 'Injustificada',
    nombreColaborador: 'Juan',
    idColaborador: 1,
  },
  {
    idAusencia: 26,
    fechaAusencia: new Date('2024-12-15'),
    fechaFin: null,
    razon: 'CGS',
    nombreColaborador: 'Juan',
    idColaborador: 1,
  },
  {
    idAusencia: 27,
    fechaAusencia: new Date('2024-01-19'),
    fechaFin: null,
    razon: 'CGS',
    nombreColaborador: 'Roberto',
    idColaborador: 3,
  },
];
const initialRecuentosAusenciasPorMes: Record<number, Record<string, number[]>> = {};

const Bars = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [recuentosAusenciasPorMes, setRecuentosAusenciasPorMes] = useState(initialRecuentosAusenciasPorMes);

  useEffect(() => {

    const filteredAusencias = datosAusenciasQuemados.filter(ausencia => {
      const fechaAusencia = new Date(ausencia.fechaAusencia);
      return fechaAusencia.getFullYear() === selectedYear;
    });

    let updatedRecuentosAusenciasPorMes = { ...initialRecuentosAusenciasPorMes };

    filteredAusencias.forEach(ausencia => {
      const fecha = new Date(ausencia.fechaAusencia);
      const mes = fecha.getMonth();

      if (!updatedRecuentosAusenciasPorMes[mes]) {
        updatedRecuentosAusenciasPorMes[mes] = {};
      }

      updatedRecuentosAusenciasPorMes[mes][ausencia.razon] = updatedRecuentosAusenciasPorMes[mes][ausencia.razon] || [];
      updatedRecuentosAusenciasPorMes[mes][ausencia.razon].push(ausencia.idAusencia);
    });

    setRecuentosAusenciasPorMes(updatedRecuentosAusenciasPorMes);
  }, [selectedYear]);

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedYear = parseInt(event.target.value);
    setSelectedYear(selectedYear);
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
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const datasets = tiposAusencias.map(tipo => ({
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

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      // Resto de opciones...
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
    </div>
  );
};

export default Bars;