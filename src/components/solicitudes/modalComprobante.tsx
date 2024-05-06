import React, { useState, useEffect } from 'react';
import { Modal, Button, Typography } from '@mui/material';
import { message} from 'antd';
import SolicitudService from '../../services/solicitud.service';

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
    <Modal open={true} onClose={onClose}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', boxShadow: '24px 24px 48px rgba(0, 0, 0, 0.15)', padding: 4, maxHeight: '80vh', overflowY: 'auto', borderRadius: '5px' }}>
        {comprobante === null &&
          <>
            {contextHolder}
          </>
        }
        <Button variant="contained" color="error" onClick={onClose}>Cerrar</Button>
        {loading && <Typography>Cargando...</Typography>}
        {comprobante && <img src={URL.createObjectURL(comprobante)}
          alt="Comprobante"
          style={{ maxWidth: '100%', objectFit: 'contain', marginTop: '5px' }} // Estilos para ajustar la imagen
        />}
      </div>
    </Modal>
  );
};

export default ModalComprobanteComponent;
