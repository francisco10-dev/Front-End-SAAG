import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { message} from 'antd';
import SolicitudService from '../../services/solicitud.service';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


interface ModalComponentProps {
  idSolicitud: number;
  onClose: () => void;
}

const ModalComprobanteComponent: React.FC<ModalComponentProps> = ({ idSolicitud, onClose }) => {
  const [comprobante, setComprobante] = useState<Blob | null>(null); // Guarda el comprobante en el estado
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchComprobante = async () => {
      try {
        setLoading(true);
        const solicitudService = new SolicitudService();
        const comprobanteBlob = await solicitudService.getComprobante(idSolicitud);
        setComprobante(comprobanteBlob);
      } catch (error) {
        console.error('Error obteniendo el comprobante:', error);
        errorNotification(); // Llama a la función de notificación de error dentro del bloque catch
      } finally {
        setLoading(false);
      }
    };

    fetchComprobante(); // Llama a la función para obtener el comprobante al cargar el componente modal
  }, [idSolicitud]); // Se ejecuta nuevamente si el id de la solicitud cambia

  const errorNotification = () => {
    messageApi.open({
      type: 'error',
      content: 'No hay comprobante adjunto en esta solicitud',
    });
  };
  
  return (
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={true}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Comprobante
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
        {comprobante === null &&
          <>
            {contextHolder}
          </>
        }
        {loading && <Typography>Cargando...</Typography>}
        {comprobante && <img src={URL.createObjectURL(comprobante)}
          alt="Comprobante"
          style={{ maxWidth: '100%', objectFit: 'contain', marginTop: '5px' }} // Estilos para ajustar la imagen
        />}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={onClose}  color='error' >
           Cerrar
          </Button>
        </DialogActions>
      </BootstrapDialog>
  );
};

export default ModalComprobanteComponent;
