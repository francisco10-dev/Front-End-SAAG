import React, { useState,  useEffect } from 'react';
import { Modal, Form, Input, Button, Select as AntSelect } from 'antd';
import { toast } from 'react-toastify';
import UsarioService, { Usuario } from '../../services/usuario.service';

interface ColaboradorOption {
  value: number;
  label: string;
}

interface EditUsuarioModalProps {
  open: boolean;
  usuario: Usuario | null;
  onClose: () => void;
  onUsuarioUpdate: (usuarioId: number) => void;
}

const EditUsuarioModal: React.FC<EditUsuarioModalProps> = ({ open, usuario, onClose, onUsuarioUpdate }) => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [rol, setRol] = useState('empleado');
  const [idColaborador, setIdColaborador] = useState<number | null>(null);
  const service = new UsarioService();
  const [colaboradores, setColaboradores] = useState<ColaboradorOption[]>([]);
  const [usuarioState, setUsuarioState] = useState<Usuario | null>(null);

  useEffect(() => {
    setUsuarioState(usuario);
    if (usuario) {
      setNombreUsuario(usuario.nombreUsuario || '');
      setRol(usuario.rol || 'empleado');
      setIdColaborador(usuario.idColaborador || null);
    }
  }, [usuario]);

  useEffect(() => {
    // Aquí deberías cargar los colaboradores desde tu servicio
    // Simulación de colaboradores
    const options: ColaboradorOption[] = [
      { value: 1, label: 'Colaborador 1' },
      { value: 2, label: 'Colaborador 2' },
      { value: 3, label: 'Colaborador 3' },
    ];
    setColaboradores(options);
  }, []);

  const handleSave = async () => {
    if (!nombreUsuario || !rol || idColaborador === null) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    const updatedUsuario = { ...usuarioState };
    updatedUsuario.nombreUsuario = nombreUsuario;
    updatedUsuario.rol = rol;
    updatedUsuario.idColaborador = idColaborador;

    if (usuario) {
      try {
        const response = await service.actualizarUsuario(usuario.idUsuario, updatedUsuario);
        toast.success('Usuario actualizado exitosamente' + response);
        setNombreUsuario('');
        setRol('empleado');
        setIdColaborador(null);
        onUsuarioUpdate(usuario.idUsuario);
        onClose();
      } catch (error) {
        toast.error('Error al actualizar usuario' + error);
      }
    }
  };

  return (
    <Modal title={`Editar Usuario ${usuarioState?.idUsuario}`} visible={open} onCancel={onClose} footer={null}>
      <Form layout="vertical" onFinish={handleSave}>
        <Form.Item label="Nombre de Usuario">
          <Input value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} />
        </Form.Item>
        <Form.Item label="Tipo de Empleado">
          <Input value={rol} onChange={(e) => setRol(e.target.value)} />
        </Form.Item>
        <Form.Item label="ID de Colaborador">
          <AntSelect value={idColaborador} onChange={(value) => setIdColaborador(value)} options={colaboradores} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUsuarioModal;
