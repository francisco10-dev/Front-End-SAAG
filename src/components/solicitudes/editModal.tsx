import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Solicitud } from '../../services/solicitud.service';
import { Alert, Box, Grid, TextField, Typography, List, ListItem, IconButton, Avatar, ListItemAvatar, ListItemText } from '@mui/material';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import { formatDate } from './utils';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SolicitudService from '../../services/solicitud.service';
import { message } from 'antd';
import { Fragment, useState } from 'react';
import { useAuth } from '../../authProvider';
import moment from 'moment';
import ModalComprobanteComponent from './modalComprobante';
import UploadFiles from '../expedientes/file/uploadFile';
import type { UploadFile } from 'antd/lib/upload/interface';
import ColaboradorNameSelect from '../solicitud-empleado/colaboradorSubstitute';
interface Props {
    solicitud: Solicitud | null;
    open: boolean;
    onClose: () => void;
    reload: () => void;
}

export default function EditDialog({ solicitud, open, onClose, reload }: Props) {
    const { userRole } = useAuth();
    const [estado, setEstado] = useState<string | null>();
    const [estadoComprobante, setEstadoComprobante] = useState<string | null>('');
    const [comentario, setComentarios] = useState<string | null>();
    const { colaborador } = useAuth();
    const [mostrarModal, setMostrarModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<UploadFile[]>([]);
    const [openUploader, setOpenUploader] = useState(true);
    const [nombreSustituto, setNombreSustituto] = useState('');
    const [requiereSustituto, setRequiereSustituto] = useState('');

    const handleFilesChange = (files: UploadFile<any>[]) => {
        setSelectedFile(files);
        setOpenUploader(false);
    };

    const reset = () => {
        setOpenUploader(true);
        setSelectedFile([]);
    }

    const handleModal = () => {
        setMostrarModal(true);
    };

    const handleCloseModal = () => {
        setMostrarModal(false); // Cierra el modal
    };

    const handleChange = (event: SelectChangeEvent) => {
        setEstado(event.target.value as string);
    };
    const handleChangeSelect = (event: SelectChangeEvent) => {
        setEstadoComprobante(event.target.value as string);
    };
    if (!solicitud) {
        return <div></div>
    }

    const handleClose = () => {
        onClose();
        setRequiereSustituto("NO");
        setEstado(null);
        setEstadoComprobante(null);
    }

    const handleChangeSelectSub = (event: SelectChangeEvent<string>) => {
        setRequiereSustituto(event.target.value);
    };

    const renderMenuItems = () => {
        const menuItems = {
            supervisor: [
                { value: 'AprobadoPorJefatura', label: 'Aprobado por Jefatura' },
                { value: 'RechazadoPorJefatura', label: 'Rechazado por Jefatura' }
            ],
            default: [
                { value: 'Aprobado', label: 'Aprobar' },
                { value: 'Rechazado', label: 'Rechazar' }
            ]
        };

        const items = userRole === 'supervisor' ? menuItems.supervisor : menuItems.default;

        return items.map(item => (
            <MenuItem key={item.value} value={item.value}>
                {item.label}
            </MenuItem>
        ));
    };


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
            sustitucion: requiereSustituto ? requiereSustituto : null,
            nombreSustituto: nombreSustituto ? nombreSustituto : null,
            comentarioTalentoHumano: comentario ? comentario : null, // Si comentario es truthy, se usa comentario, de lo contrario se usa null
            nombreEncargado: colaborador?.nombre,
            fechaRecibido: moment().format('YYYY-MM-DD'),
            comprobante: selectedFile ? selectedFile : null
        }
        return data;
    }

    const handleSave = async () => {
        const data = prepareData();
        const service = new SolicitudService();
        let hideLoadingMessage;

        try {
            hideLoadingMessage = message.loading('Cargando', 0);
            console.log(data);
            const response = await service.actualizarSolicitud(solicitud.idSolicitud, data);
            if (response) {
                message.success('Solicitud procesada exitosamente');
                reload();
            }
        } catch (error) {
            message.error(`Ocurrió un error al procesar la solicitud. ${error}`);
        } finally {
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
                style={{ zIndex: 20 }}
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
                                        {solicitud.idSolicitud}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={6} md={2} key="nombre" >
                                    <Typography variant="body2">
                                        Colaborador
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {solicitud.nombreColaborador}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={6} md={2} key="fecha" >
                                    <Typography variant="body2">
                                        Identificación
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {solicitud.colaborador.identificacion}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={6} md={2} key="fecha" >
                                    <Typography variant="body2">
                                        Fecha de solicitud
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {formatDate(solicitud.fechaSolicitud)}
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
                                        {solicitud.conGoceSalarial ? 'SÍ' : 'NO'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={6} md={2} key="asunto" >
                                    <Typography variant="body2">
                                        Asunto
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {solicitud.asunto ? solicitud.asunto : 'No indica'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={6} md={2} key="inicio" >
                                    <Typography variant="body2">
                                        Fecha de inicio
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {solicitud.fechaInicio ? formatDate(solicitud.fechaInicio) : 'No indica'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={6} md={2} key="fin" >
                                    <Typography variant="body2">
                                        Fecha fin
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {solicitud.fechaFin ? formatDate(solicitud.fechaFin) : 'No indica'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={6} md={2} key="horaInicio" >
                                    <Typography variant="body2">
                                        Hora inicio
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {solicitud.horaInicio ? solicitud.horaInicio : 'No indica'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={6} md={2} key="horaFin" >
                                    <Typography variant="body2">
                                        Hora fin
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {solicitud.horaFin ? solicitud.horaFin : 'No indica'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={6} md={2} key="sustitucion" >
                                    <Typography variant="body2">
                                        Requiere Sustitución
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                    {solicitud.sustitucion === '' ? 'No indica' : solicitud.sustitucion}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={6} md={2} key="sustituto" >
                                    <Typography variant="body2">
                                        Sustituto
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {solicitud.nombreSustituto ? solicitud.nombreSustituto : 'No indica'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={6} md={2} key="comprobante">
                                    <Typography variant="body2">Comprobante</Typography>
                                    <Button variant='contained' onClick={handleModal} style={{ width: '85px' }}>Mostrar</Button>
                                    {mostrarModal && (
                                        <ModalComprobanteComponent
                                            idSolicitud={solicitud.idSolicitud} // Pasa el id de la solicitud al componente modal
                                            onClose={handleCloseModal} // Pasa la función de cierre al componente modal
                                        />
                                    )}
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
                    <Box mt={3} sx={{ display: { sm: 'block', md: 'block' } }} gap={2} >
                        <FormControl >
                            <InputLabel id="demo-simple-select-label-1">{solicitud.estado != 'Pendiente' ? 'Indicar otro estado' : 'Estado'} </InputLabel>
                            <Select
                                labelId="demo-simple-select-label-1"
                                id="demo-simple-select-1"
                                style={{ borderRadius: 10 }}
                                value={estado ? estado : ''}
                                label={solicitud.estado === 'Aprobado' ? 'Indicar otro estado' : 'Estado'}
                                onChange={handleChange}
                                sx={{ width: 200, marginBottom: 3 }}
                            >
                                {renderMenuItems()}
                            </Select>
                        </FormControl>
                        <br />
                        {userRole === "supervisor" && (
                            <>
                                <FormControl>
                                    <InputLabel id="demo-simple-select-label">Requiere sustituto?</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={requiereSustituto}
                                        onChange={handleChangeSelectSub}
                                        style={{ borderRadius: 10, width: 200, marginBottom: 20 }}
                                        label="Requiere sustituto?"
                                    >
                                        <MenuItem value="SI">Si</MenuItem>
                                        <MenuItem value="NO">No</MenuItem>
                                    </Select>
                                </FormControl>
                                {requiereSustituto === "SI" && (
                                    <ColaboradorNameSelect onSelect={(name) => setNombreSustituto(name)} />
                                )}
                            </>
                        )}
                        {userRole !== "supervisor" && (
                            <>
                                <TextField
                                    label="Dejar comentarios..."
                                    value={comentario}
                                    onChange={(e) => setComentarios(e.target.value)}
                                    margin='normal'
                                    maxRows={4}
                                    variant='standard'
                                    sx={{ width: { sm: 350, md: 600 } }}
                                />                                <Box mb={2}>
                                    <FormControl>
                                        <InputLabel id="comprobante" style={{ marginBottom: 50 }}>Adjuntar el comprobante</InputLabel>
                                        <Select
                                            labelId="comprobante"
                                            id="demo-simple-select"
                                            label={estadoComprobante}
                                            value={estadoComprobante ?? 'NO'}
                                            onChange={handleChangeSelect}
                                            sx={{ width: 200, marginTop: 2 }}
                                        >
                                            <MenuItem value="SI">SI</MenuItem>
                                            <MenuItem value="NO">NO</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                {estadoComprobante === "SI" && (
                                    <Box mb={2} >
                                        {openUploader && (
                                            <div style={{ width: '25%', height: '100%' }}> {/* Establece el tamaño deseado */}
                                                <UploadFiles onFilesChange={handleFilesChange} isMultiple={false} message='Seleccione un documento' />
                                            </div>)}
                                        <Box>
                                            <Grid item xs={12} md={6}>
                                                <List dense={true}>
                                                    {selectedFile.map((file, index) =>
                                                        <ListItem key={index}
                                                            secondaryAction={
                                                                <IconButton edge="end" aria-label="delete" onClick={reset} color='error'>
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            }
                                                        >
                                                            <ListItemAvatar>
                                                                <Avatar>
                                                                    <AttachFileOutlinedIcon />
                                                                </Avatar>
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={file.name}
                                                            />
                                                        </ListItem>,
                                                    )}
                                                </List>
                                            </Grid>
                                        </Box>
                                    </Box>
                                )}
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' onClick={handleClose}>Cerrar</Button>
                    <Button variant='contained' disabled={estado ? false : true} onClick={handleSave}>Guardar</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}


