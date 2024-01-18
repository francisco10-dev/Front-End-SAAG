import { Bar } from 'react-chartjs-2';
import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const datosAusenciasQuemados = [
    {
        idAusencia: 1,
        fechaAusencia: new Date('2023-01-01'),
        fechaFin: null,
        razon: 'Vacaciones',
        nombreColaborador: 'Juan',
        idColaborador: 1
    },
    {
        idAusencia: 2,
        fechaAusencia: new Date('2023-02-15'),
        fechaFin: null,
        razon: 'Enfermedad',
        nombreColaborador: 'María',
        idColaborador: 2
    },
    // Agrega más instancias según tus necesidades
];

const recuentosAusenciasPorMes: Record<number, { justificadas: number, injustificadas: number }> = {};

datosAusenciasQuemados.forEach((ausencia) => {
    const fecha = new Date(ausencia.fechaAusencia);
    const mes = fecha.getMonth(); // Obtener el mes (0-11)

    if (!recuentosAusenciasPorMes[mes]) {
        recuentosAusenciasPorMes[mes] = { justificadas: 0, injustificadas: 0 };
    }

    recuentosAusenciasPorMes[mes].justificadas++;
});

const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const datosBarras = {
    labels: meses,
    datasets: [
        {
            label: 'Ausencias Justificadas',
            data: meses.map((_, index) => recuentosAusenciasPorMes[index]?.justificadas || 0),
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
            stack: 'Stack 1'
        }
    ]
};


const misoptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        // Detalles específicos de la animación, o puedes usar `false` si no deseas animación
        duration: 0,
    },
    scales: {
        y: {
            min: 0,
            // Puedes ajustar el máximo según tus necesidades
            max: Math.max(...Object.values(recuentosAusenciasPorMes).map(item => item.justificadas)) + 10,
            grid: {
                color: 'rgba(0, 0, 0, 0.1)',
            },
            ticks: {
                color: 'black'
            }
        },
        x: {
            grid: {
                display: false
            },
            ticks: {
                color: 'black',
                maxRotation: 0,
                minRotation: 0,
                autoSkip: false
            }
        }
    }
};

export default function Bars() {
    return <Bar data={datosBarras} options={misoptions} />;
}
