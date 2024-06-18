import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import ColaboradorService, { Colaborador } from '../../../services/colaborador.service';
import { Typography } from '@mui/material';
import PhoneNumbers from './phoneNumbers/phoneNumbersList';
import Requests from './requests';
import Absences from './absences';
import Files from './documents';
import { useEffect, useState } from 'react';
import TabsLicencias from './licenses/tabsLicencias';
import TabsCourses from './courses/tabsCourses';
import { Solicitud } from '../../../services/solicitud.service';

interface Props{
    data: Colaborador | null
}

const Accordions = ({data}: Props) =>{

    const [colaborador, setColaborador] = useState<Colaborador | null>(null);
    const [loading, setLoading] = useState(false);
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);

    const loadData = async ()=> {
        try {
            setLoading(true);
            const service = new ColaboradorService();
            const response = await service.obtenerSolicitudesPorColaborador(data!.idColaborador);
            setSolicitudes(response);
        } catch (error) {
            setSolicitudes([]);
        }finally{
          setLoading(false);
        }
    }

    useEffect(() => {
        if (data) {
            setColaborador(data);
            loadData();
        }
    }, [data]);

    if (!colaborador) {
        return <div>No se encontró el colaborador</div>;
    }

    return (
        <Box>
            <Box className='acordion'>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                        >
                        <Typography variant='body1'>Licencias</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TabsLicencias idColaborador = {colaborador.idColaborador}/>
                    </AccordionDetails>
                </Accordion>
           </Box>
           <Box className='acordion'>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                        >
                        <Typography variant='body1'>Cursos</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TabsCourses idColaborador = {colaborador.idColaborador}/> 
                    </AccordionDetails>
                </Accordion>
           </Box>
            <Box className='acordion'>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    >
                    <Typography variant='body1'>Números de teléfono</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <PhoneNumbers idColaborador = {colaborador.idColaborador}/>
                </AccordionDetails>
            </Accordion>
           </Box>
           <Box className='acordion'>
           <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    >
                    <Typography variant='body1'>Archivos</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Files idColaborador={colaborador.idColaborador}/>
                </AccordionDetails>
            </Accordion>
           </Box>
           <Box className='acordion'>
           <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    >
                    <Typography variant='body1'>Historial de solicitudes</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Requests data={solicitudes} loading={loading} />
                </AccordionDetails>
            </Accordion>
           </Box>
           <Box className='acordion'>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                        >
                        <Typography variant='body1'>Historial de ausencias</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Absences data={solicitudes} loading={loading} /> 
                    </AccordionDetails>
                </Accordion>
           </Box>
        </Box>
    );

}

export default Accordions;