import React from 'react';
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
import { Auditoria } from '../../services/auditoria.service';
import { Typography } from '@mui/material';

interface ShowDetailModalProps {
  open: boolean;
  auditoria: Auditoria | null;
  onClose: () => void;
}

const ShowDetailModal: React.FC<ShowDetailModalProps> = ({ open, auditoria, onClose }) => {
  if (!auditoria) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>No hay datos de auditoría disponibles</DialogTitle>
        <DialogActions>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Auditoría {auditoria.idAuditoria}</DialogTitle>
      <DialogContent>
        <div style={{ width: '100%' }}>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow key="datosAntiguos">
                  <TableCell>Datos Antiguos</TableCell>
                  <TableCell>
                    <Typography> {auditoria.datosAntiguos?.toString() || 'No hay datos que mostrar'}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow key="datosNuevos">
                  <TableCell>Datos Nuevos</TableCell>
                  <TableCell>
                    <Typography>{auditoria.datosNuevos?.toString()  || 'No hay datos que mostrar'}</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShowDetailModal;
