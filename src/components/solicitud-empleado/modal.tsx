import { Modal, Button } from 'antd';
import React from 'react';

interface ModalProps {
  onAdminChoice: (choice: string | null) => void;
}

const ModalComponent: React.FC<ModalProps> = ({ onAdminChoice }) => {
  return (
    <Modal
      title="Agregar Solicitud"
      open={true}
      footer={null}
      onCancel={() => onAdminChoice(null)}
    >
      <p>¿Qué tipo de solicitud deseas agregar?</p>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={() => onAdminChoice('solicitudPropia')} type="primary">Solicitud Propia</Button>
        <Button onClick={() => onAdminChoice('solicitudEmpleado')} type="primary">Solicitud de Empleado</Button>
      </div>
    </Modal>
  );
};

export default ModalComponent; 
