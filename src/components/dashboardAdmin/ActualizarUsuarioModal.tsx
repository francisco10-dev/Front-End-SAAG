import React, { useState } from 'react';
import { Modal, Button, TextField } from '@mui/material';
import { Usuario } from '../../services/usuario.service';

interface UpdateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (usuario: Usuario) => void;
  usuario: Usuario | null;
}

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({ isOpen, onClose, onUpdate, usuario }) => {
  const [nombreUsuario, setNombreUsuario] = useState(usuario?.nombreUsuario || '');
  const [rol, setRol] = useState(usuario?.rol || '');

  const handleUpdate = () => {
    if (usuario) {
      onUpdate({ ...usuario, nombreUsuario, rol });
      onClose();
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div>
        <h2>Actualizar Usuario</h2>
        <TextField
          label="Nombre de Usuario"
          value={nombreUsuario}
          onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setNombreUsuario(e.target.value)}
          fullWidth
        />
        <TextField
          label="Rol"
          value={rol}
          onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setRol(e.target.value)}
          fullWidth
        />
        <Button onClick={handleUpdate}>Actualizar</Button>
        <Button onClick={onClose}>Cancelar</Button>
      </div>
    </Modal>
  );
};

export default UpdateUserModal;
