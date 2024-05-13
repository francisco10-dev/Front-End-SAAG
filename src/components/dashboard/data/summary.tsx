import ColaboradorService from '../../../services/colaborador.service';
import SolicitudService from '../../../services/solicitud.service';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import RuleIcon from '@mui/icons-material/Rule';
import {fetchData} from '../data/cacheData';



export async function getEmployeeData(): Promise<any> {
    return fetchData<any>(
        async () => {
            const employeeService = new ColaboradorService();
            const employees = await employeeService.obtenerColaboradores();
            return {
                totalCount: employees.length,
                color: "rgb(244, 161, 0)",
                title: "Total Empleados",
                icon: <AssignmentIndIcon />,
            };
        },
        'employeeData'
    );
}

export async function getRequestData(): Promise<any> {
    return fetchData<any>(
        async () => {
            const requestService = new SolicitudService();
            const solicitudes = await requestService.getSolicitudes();
            const solicitudesPendientes = solicitudes.filter(solicitud => solicitud.estado === "Pendiente");
            return {
                totalCount: solicitudesPendientes.length,
                color: "rgb(73, 163, 241)",
                title: "Solicitudes Pendientes",
                icon: <RequestPageIcon />
            };
        },
        'requestData'
    );
}

export async function getAbsenceData(): Promise<any> {
    return fetchData<any>(
        async () => {
            const solicitudService = new SolicitudService();
            const solicitudes = await solicitudService.getSolicitudes();
            const ausencias = solicitudes.filter(solicitud =>
                solicitud.estado === 'Aprobado' && new Date(solicitud.fechaInicio ?? "") <= new Date() && new Date(solicitud.fechaFin ?? "") > new Date());
            return {
                totalCount: ausencias.length,
                color: "rgb(102, 187, 106)",
                title: "Empleados Ausentes",
                icon: <RuleIcon/>
            };
        },
        'absenceData'
    );
}

export async function getFutureAbsenceData(): Promise<any> {
    return fetchData<any>(
        async () => {
            const solicitudService = new SolicitudService();
            const solicitudes = await solicitudService.getSolicitudes();
            const proximasAusencias = solicitudes.filter(solicitud =>
                solicitud.estado === 'Aprobado' && new Date(solicitud.fechaInicio ?? "") > new Date());
            return {
                totalCount: proximasAusencias.length,
                color: "rgb(236, 64, 122)",
                title: "Próximas Ausencias",
                icon: <WatchLaterIcon  />
            };
        },
        'futureAbsenceData'
    );
}
