import { useEffect, useState } from 'react';
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AuditService from '../../../services/auditoria.service';
import { Auditoria } from '../../../services/auditoria.service';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from "react-router-dom";
import Button from "@mui/material/Button"; 
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import  Grid  from '@mui/material/Grid';
import '../styles/styles.css'
import  'moment-timezone';
import moment from 'moment';




function RecentActivity() {
  const auditService = new AuditService();
  const [auditLogs, setAuditLogs] = useState<Auditoria[]>([]);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const auditorias = await auditService.getAuditorias();
        auditorias.sort((a, b) => b.idAuditoria - a.idAuditoria);
        setAuditLogs(auditorias.slice(0, 5));
      } catch (error) {
        console.error('Error fetching audit logs:', error);
      }
    };

    fetchAuditLogs();
  }, []);

  function fechaFormateada(fecha: Date){
    return moment(fecha).tz('America/Costa_Rica').format('YYYY-MM-DD HH:mm:ss')
}


  return (
    <Card className="custom-card" sx={{ height: "100%"}}>
      <Box pt={3} px={3} >
        <Grid container spacing={3}>
          {/* Contenedor arriba */}
          <Grid item xs={12} >
            <Typography variant="h6" fontWeight="400" fontFamily= 'Gotham'>
              Actividad Reciente
            </Typography>
          </Grid>
          {/* Contenedor del timeline */}
          <Grid item xs={3}>
            <Box mt={3} ml={8}>
              <Timeline position="left">
                {auditLogs.slice(0, 5).map((log,index) => (
                  <TimelineItem key={log.idAuditoria}>
                    <TimelineSeparator>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        width="2rem"
                        height="2rem"
                        borderRadius="50%"
                        bgcolor={getIconColor(log.accion)}
                        
                      >
                        {getIcon(log.accion)}
                      </Box>
                    {index !== auditLogs.length - 1 && <TimelineConnector sx={{ bgcolor: "#d3d3d3" }} />}
                    </TimelineSeparator>
                  </TimelineItem>
                ))}
              </Timeline>
            </Box>
          </Grid>
          {/* Contenedor del nombre y fecha */}
          <Grid item xs={9}>
            <Box mt={3}>
            {auditLogs.slice(0, 5).map(log => (
              <Box key={log.idAuditoria} display="flex" alignItems="center" >
                <Box mb={2.5}>
                  <Typography variant="subtitle1" color="text.primary" fontWeight="405" fontFamily="Gotham">
                    {log.nombre}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontFamily="Gotham">
                  {fechaFormateada(log.fecha)}
                  </Typography>
                </Box>
              </Box>
            ))}
            </Box>
          </Grid>
          {/* Contenedor del botón */}
          <Grid item xs={12}>
            <Box textAlign="center" mb={2}>
              <Button component={Link} to="/auditorias" variant="contained" color="primary">Ver Todo</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}
// Función para obtener el color del icono según la acción
function getIconColor(accion: string): string {
  switch (accion) {
    case 'Creación':
      return "success.main"; // Color blanco para creación
    case 'Actualización':
      return "primary.main"; // Color blanco para actualización
    case 'Eliminación':
      return "error.main"; // Color blanco para eliminación
    default:
      return "success.main"; // Color negro por defecto
  }
}

// Función para obtener el icono según la acción
function getIcon(accion: string): JSX.Element {
  switch (accion) {
    case 'Creación':
      return <AddCircleOutlineIcon sx={{ color: "white", fontSize:"medium" }} />; // Icono de creación
    case 'Actualización':
      return <UpdateIcon sx={{ color: "white", fontSize:"medium"}} />; // Icono de actualización
    case 'Eliminación':
      return <DeleteIcon sx={{ color: "white", fontSize:"medium"}} />; // Icono de eliminación
    default:
      return <Icon sx={{ color: "white", fontSize:"medium"}} />; // Icono por defecto
  }
}

export default RecentActivity;






