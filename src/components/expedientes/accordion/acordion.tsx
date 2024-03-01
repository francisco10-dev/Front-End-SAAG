import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import { Colaborador } from '../../../services/colaborador.service';
import { Typography } from '@mui/material';
import PhoneNumbers from './phoneNumbersList';
import Requests from './requests';
import Absences from './absences';
import Files from './documents';
import { useEffect, useState } from 'react';

interface Props{
    data: Colaborador | null
}

const Accordions = ({data}: Props) =>{

    if(!data){
        return <div>No se encontró el colaborador</div>
    }

    const [colaborador, setColaborador] = useState<Colaborador>(data);
 
    useEffect(()=> {
        setColaborador(data);
    }, [data]);

    return (
        <Box>
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
                    <Typography variant='body1'>Documentos</Typography>
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
                    <Requests id={colaborador.idColaborador} />
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
                        <Absences id={colaborador.idColaborador}/> 
                    </AccordionDetails>
                </Accordion>
           </Box>
        </Box>
    );

}

export default Accordions;