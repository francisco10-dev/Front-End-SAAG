import { useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAuth } from "../../authProvider";
import PersonalInfo from "../expedientes/info/personalInfo";
import Requests from "../expedientes/accordion/requests";
import Absences from "../expedientes/accordion/absences";
import PasswordManager from "../expedientes/accordion/passwordManager";
import { Solicitud } from "../../services/solicitud.service";
import ColaboradorService from "../../services/colaborador.service";

const Info = () => {
  const { colaborador, photo } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);

  const loadData = async ()=> {
      try {
          setLoading(true);
          const service = new ColaboradorService();
          const response = await service.obtenerSolicitudesPorColaborador(colaborador!.idColaborador);
          setSolicitudes(response);
      } catch (error) {
          setSolicitudes([]);
      }finally{
        setLoading(false);
      }
  }

  useEffect(() => {
    if(colaborador){
      loadData();
    }
  },[]);

  const renderRequests = () => {
    if (colaborador?.idColaborador) {
      return <Requests data={solicitudes} loading={loading}  />;
    }
    return null;
  };

  const renderAbsences = () => {
    if (colaborador?.idColaborador) {
      return <Absences data={solicitudes} loading={loading} />;
    }
    return null;
  };

  return (
    <Box sx={{ padding: 5 }}>
      <PersonalInfo colaborador={colaborador} isLoadingImage={false} imageUrl={photo} size={3} />
      <Box pt={5}>
        <Box className="acordion">
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
              <Typography variant="body1">Mis solicitudes</Typography>
            </AccordionSummary>
            <AccordionDetails>{renderRequests()}</AccordionDetails>
          </Accordion>
        </Box>
        <Box className="acordion">
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
              <Typography variant="body1">Mis ausencias</Typography>
            </AccordionSummary>
            <AccordionDetails>{renderAbsences()}</AccordionDetails>
          </Accordion>
        </Box>
        <Box className="acordion">
          <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3-content" id="panel3-header">
              <Typography variant="body1">Cambiar contraseña</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <PasswordManager expanded={expanded} setExpanded={setExpanded} />
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </Box>
  );
}

export default Info;
