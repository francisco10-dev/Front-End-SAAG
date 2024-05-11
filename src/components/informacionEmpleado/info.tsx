import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import { useAuth } from "../../authProvider";
import PersonalInfo from "../expedientes/info/personalInfo";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Requests from "../expedientes/accordion/requests";
import Absences from "../expedientes/accordion/absences";

const Info = () => {
    
    const { colaborador, photo } = useAuth();

    const renderRequests = () => {
        if (colaborador?.idColaborador) {
            return <Requests id={colaborador.idColaborador} />;
        }
        return null; 
    };
    
    return (
        <Box sx={{ padding: 5 }}>
            <PersonalInfo colaborador={colaborador} isLoadingImage={false} imageUrl={photo} size={3} />
            <Box pt={5}>
                <Box className="acordion">
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                            >
                            <Typography variant='body1'>Mis Solicitudes</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {renderRequests()}
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
                            <Typography variant='body1'>Mis ausencias</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Absences id={colaborador?.idColaborador!}/> 
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Box>
        </Box>
    );
}

export default Info;
