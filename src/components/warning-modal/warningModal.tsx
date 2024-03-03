import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'; // Importa los componentes de Material-UI
import './warningModal.css'; // Importa el archivo CSS
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'; // Importa el icono de advertencia de FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


interface WarningProps {
  onClose: () => void; // Función para cerrar la ventana modal
}

const WarningModal: React.FC<WarningProps> = ({ onClose }) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0) {
      onClose();
    }
  }, [countdown, onClose]);

  return (
      <Dialog className='warning-dialog' open={countdown > 0} onClose={onClose}>
      <DialogTitle className='warning-title'>¡Advertencia!</DialogTitle>
      <DialogContent>
        <div className="warning-content">
          <div className="icon-circle">
            <FontAwesomeIcon icon={faExclamationTriangle} className="warning-icon" />
          </div>
          <div className="message">
            <p>Su sesión se cerrará en {countdown}</p>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button className='warning-button' onClick={onClose} color="primary">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
);

};

export default WarningModal;
