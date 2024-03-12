import React, { useState, FormEvent, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Solicitud } from '../../services/solicitud.service';
import TextField from '@mui/material/TextField';
//import SolicitudService from '../../services/solicitud.service';
import { formatDate, updateSolicitud } from './utils';
interface EditSolicitudModalProps {
  open: boolean;
  solicitud: Solicitud | null;
  onClose: () => void;
  onSolicitudUpdate: (id: number, status: string) => void;
}

const EditSolicitudModal: React.FC<EditSolicitudModalProps> = ({ open, solicitud, onClose,onSolicitudUpdate, }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [fechaRecibido, setFechaRecibido] = useState<Date | null>(null);
  const [comentarios, setComentarios] = useState('');
  const [nombreEncargado, setNombreEncargado] = useState('');
  //const service = new SolicitudService();
  const [solicitudState, setSolicitudState] = useState<Solicitud | null>(null);

  useEffect(() => {
    setSolicitudState(solicitud);
    const employee = localStorage.getItem('employee');
    if(employee){
      const encargado = JSON.parse(employee);
      setNombreEncargado(encargado.nombre);
    }
  }, [solicitud]);


  const handleSave =  async (e: FormEvent) => {
    e.preventDefault();
    const updatedSolicitud = { ...solicitudState };
    //updatedSolicitud.fechaRecibidio = fechaRecibido;
    updatedSolicitud.comentarioTalentoHumano = comentarios;
    updatedSolicitud.nombreEncargado = nombreEncargado;
    updatedSolicitud.estado = 'procesada';
    if (solicitud) {
        const data = await updateSolicitud(solicitud.idSolicitud, updatedSolicitud);
        if (data) {
            setIsFormOpen(false);
            setFechaRecibido(null);
            setComentarios('');
            setNombreEncargado('');
            onSolicitudUpdate(data.idSolicitud, 'procesada');
            onClose();
        }
    }
  };

  if (!solicitud) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth >
      <DialogTitle>Solicitud {solicitud.idSolicitud}</DialogTitle>
      <DialogContent>
      <div style={{ width: '100%' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {Object.entries({
                'Tipo de solicitud': solicitud.tipoSolicitud,
                'Con goce salarial': solicitud.conGoceSalarial ? 'Sí' : 'NO',
                'Asunto': solicitud.asunto,
                'Nombre del colaborador': solicitud.nombreColaborador,
                'Fecha de la solicitud': formatDate(solicitud.fechaSolicitud),
                'Inicio': solicitud.fechaInicio ? formatDate(solicitud.fechaInicio) : 'NA',
                'Fin': solicitud.fechaFin ? formatDate(solicitud.fechaFin) : 'NA',
                'Sustitución': solicitud.sustitucion || 'NA',
                'Sustituto': solicitud.nombreSustituto || 'NA'
              }).map(([label, value]) => (
                <TableRow key={label}>
                  <TableCell>{label}</TableCell>
                  <TableCell>{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsFormOpen(true)}>Procesar</Button>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
      <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} maxWidth="sm">
        <DialogTitle>Solicitud {solicitud.idSolicitud}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSave}>
            <TextField
              label="Fecha de recibido"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={fechaRecibido ? fechaRecibido.toISOString().split('T')[0] : ''}
              onChange={(e) => setFechaRecibido(new Date(e.target.value))}
              margin='normal'
              required
            />
            <TextField
              label="Comentarios..."
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              fullWidth
              margin='normal'
              maxRows={4}
              variant='standard'
            />
            <TextField
              label="Tramitado por..."
              value={nombreEncargado}
              //onChange={(e) => setNombreEncargado(e.target.value)}
              fullWidth
              margin='normal'
              variant='standard'
              disabled
            />
            <Button type="submit">Guardar</Button>
            <Button onClick={() => setIsFormOpen(false)}>Cancelar</Button>
          </form>
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default EditSolicitudModal;
