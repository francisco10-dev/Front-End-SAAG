import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Solicitud } from '../../services/solicitud.service';
import { Alert, Box, Grid, TextField, Typography } from '@mui/material';
import { formatDate } from './utils';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SolicitudService from '../../services/solicitud.service';
import { message } from 'antd';
import { Fragment, useState } from 'react';
import { useAuth } from '../../authProvider';
import moment from 'moment';

interface Props{
    solicitud: Solicitud | null;
    open: boolean;
    onClose: () => void;
    reload: () => void;
}

export default function EditDialog({solicitud, open, onClose, reload}: Props) {

    const [estado, setEstado] = useState<string | null>();
    const [comentario, setComentarios] = useState<string | null>();
    const {colaborador} = useAuth();

    const handleChange = (event: SelectChangeEvent) => {
      setEstado(event.target.value as string);
    };

    if(!solicitud){
        return <div></div>
    }

    const handleClose = () => {
        onClose();
        setEstado(null);
    }

   
    const prepareData = () => {
        const data = {
            idSolicitud: solicitud.idSolicitud,
            fechaSolicitud: solicitud.fechaSolicitud,
            nombreColaborador: solicitud.nombreColaborador,
            fechaFin: solicitud.fechaFin,
            fechaInicio: solicitud.fechaInicio,
            horaInicio: solicitud.horaInicio,
            horaFin: solicitud.horaFin,
            conGoceSalarial: solicitud.conGoceSalarial,
            asunto: solicitud.asunto,
            estado: estado,
            sustitucion: solicitud.sustitucion,
            nombreSustituto: solicitud.nombreSustituto,
            comentarioTalentoHumano: comentario,
            nombreEncargado: colaborador?.nombre,
            fechaRecibido: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        return data;
    }

    const handleSave = async () => {
        const data = prepareData();
        const service = new SolicitudService();
        let hideLoadingMessage;        

        try{
            hideLoadingMessage = message.loading('Cargando', 0);
            const response = await service.actualizarSolicitud(solicitud.idSolicitud, data);
            if(response){
                message.success('Solicitud procesada exitosamente');
                reload();
            }
        }catch(error){
            message.error('Ocurrió un error al procesar la solicitud.');
        }finally{
            if (hideLoadingMessage) {
                hideLoadingMessage();
            }
            handleClose();
        }
    }


  return (
    <Fragment>
      <Dialog
        fullWidth={true}
        maxWidth='lg'
        open={open}
        onClose={onClose}
      > 

        <DialogTitle>
            Solicitud de {solicitud.nombreColaborador} <br />
            Solicitud N#: {solicitud.idSolicitud}
        </DialogTitle>
        <DialogContent>
            <Box id="pdf-content">
                {solicitud.estado != 'Pendiente' ? 
                    <Box mb={2} mr={1}>
                        <Alert severity="info" variant='filled' >Esta solicitud ya ha sido procesada por {solicitud.nombreEncargado + ' '}
                        y se encuentra en estado de {solicitud.estado}.</Alert>
                    </Box> : null 
                }
                <Box>
                    <Grid container spacing={2}>
                        <Grid item xs={6} sm={6} md={2} key="id" >
                            <Typography variant="body2">
                                N# Solicitud
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                { solicitud.idSolicitud}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={2} key="nombre" >
                            <Typography variant="body2">
                                Colaborador
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                { solicitud.nombreColaborador}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={2} key="fecha" >
                            <Typography variant="body2">
                                Identificación
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                { solicitud.colaborador.identificacion}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={2} key="fecha" >
                            <Typography variant="body2">
                            Fecha de solicitud
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                { formatDate(solicitud.fechaSolicitud)}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={2} key="tipo" >
                            <Typography variant="body2">
                                Tipo
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {solicitud.tipoSolicitud}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={2} key="goce" >
                            <Typography variant="body2">
                                Goce
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {solicitud.conGoceSalarial? 'SÍ': 'NO'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={2} key="asunto" >
                            <Typography variant="body2">
                            Asunto
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {solicitud.asunto? solicitud.asunto : 'No indica'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={2} key="inicio" >
                            <Typography variant="body2">
                            Fecha de inicio
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                { solicitud.fechaInicio? formatDate(solicitud.fechaInicio) : 'No indica'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={2} key="fin" >
                            <Typography variant="body2">
                            Fecha fin
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                { solicitud.fechaFin? formatDate(solicitud.fechaFin) : 'No indica'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={2} key="horaInicio" >
                            <Typography variant="body2">
                                Hora inicio
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {solicitud.horaInicio? solicitud.horaInicio : 'No indica'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={2} key="horaFin" >
                            <Typography variant="body2">
                            Hora fin
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {solicitud.horaFin? solicitud.horaFin : 'No indica'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={2} key="sustitucion" >
                            <Typography variant="body2">
                            Requiere Sustitución
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {solicitud.sustitucion? 'SÍ' : 'No indica'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={6} md={2} key="sustituto" >
                            <Typography variant="body2">
                            Sustituto
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {solicitud.nombreSustituto? solicitud.nombreSustituto : 'No indica'}
                            </Typography>
                        </Grid>
                        {solicitud.estado != 'Pendiente' && (
                            <Grid item xs={6} sm={6} md={2} key="estado" >
                                <Typography variant="body2">
                                    Estado
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {solicitud.estado}
                                </Typography>
                            </Grid>                        
                        )}
                        {solicitud.fechaRecibido && (
                            <Grid item xs={6} sm={6} md={2} key="fechaRecibido" mt={2} >
                                <Typography variant="body2">
                                    Fecha de Recibido
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {formatDate(solicitud.fechaRecibido)}
                                </Typography>
                            </Grid>                        
                        )} 
                    </Grid>
                    {solicitud.comentarioTalentoHumano && (
                        <Grid item xs={6} sm={6} md={2} key="estado" mt={2} >
                            <Typography variant="body2">
                                Comentarios
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {solicitud.comentarioTalentoHumano}
                            </Typography>
                        </Grid>                        
                    )}  
                </Box>
            </Box>
            <Box mt={3} sx={{display: { sm: 'block', md: 'flex'}}} gap={2} >
                <FormControl >
                    <InputLabel id="demo-simple-select-label">{solicitud.estado != 'Pendiente' ? 'Indicar otro estado' : 'Estado'}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={estado? estado : ''}
                        label={solicitud.estado === 'Aprobado'? 'Indicar otro estado' : 'Estado'}
                        onChange={handleChange}
                        sx={{width: 200}}
                    >
                        <MenuItem value='Aprobado'>Aprobar</MenuItem>
                        <MenuItem value='Rechazado'>Rechazar</MenuItem>
                    </Select>
                </FormControl> <br />
                <TextField
                    label="Dejar comentarios..."
                    value={comentario}
                    onChange={(e) => setComentarios(e.target.value)}
                    margin='normal'
                    maxRows={4}
                    variant='standard'
                    sx={{width: { sm: 350, md: 600}}}
                />
            </Box>
            </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={handleClose}>Cerrar</Button>
          <Button variant='contained' disabled={estado? false : true} onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  ); 
}


