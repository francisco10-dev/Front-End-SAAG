import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select as AntSelect } from 'antd';
import { toast } from 'react-toastify';
import UsuarioService, { Usuario } from '../../services/usuario.service';
import ColaboradorService from '../../services/colaborador.service';

interface ColaboradorOption {
  value: number;
  label: string;
}

interface EditUsuarioModalProps {
  open: boolean;
  usuario: Usuario | null;
  onClose: () => void;
  onUpdate: (usuarioId: number) => void;
}

const EditUsuarioModal: React.FC<EditUsuarioModalProps> = ({ open, usuario, onClose, onUpdate }) => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [rol, setRol] = useState('empleado');
  const [idColaborador, setIdColaborador] = useState<number | null>(null);
  const service = new UsuarioService();
  const serviceColaborador = new ColaboradorService();
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

  const cargarColaboradores = async () => {
    try {
      const response = await serviceColaborador.colaboradorSinUsuario();
      if (response.length > 0) {
        const options = response.map((colaborador) => ({
          value: colaborador.idColaborador,
          label: colaborador.nombre,
        }));
        setColaboradores(options);
      } else {
        setColaboradores([{ value: 0, label: "No hay colaboradores sin usuario" }]);
      }
    } catch (error) {
      setColaboradores([{ value: 0, label: "Error al cargar colaboradores" }]);
    }
  };

  useEffect(() => {
    cargarColaboradores();
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
        onUpdate(usuario.idUsuario);
        onClose();
      } catch (error) {
        toast.error('Error al actualizar usuario' + error);
      }
    }
  };

  return (
    <Modal title={`Editar Usuario ${usuarioState?.idUsuario}`} open={open} onCancel={onClose} footer={null}>
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
