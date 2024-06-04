import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, Select as AntSelect } from 'antd';
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
  const [selectedColaborador, setSelectedColaborador] = useState<ColaboradorOption | null>(null);
  const [colaboradores, setColaboradores] = useState<ColaboradorOption[]>([]);
  const [loading, setLoading] = useState(false);
  const service = new UsuarioService();
  const serviceColaborador = new ColaboradorService();
  const [usuarioState, setUsuarioState] = useState<Usuario | null>(null);

  useEffect(() => {
    console.log(usuario);
    setUsuarioState(usuario);
    if (usuario) {
      setNombreUsuario(usuario.nombreUsuario || '');
      setRol(usuario.rol || 'empleado');
      setIdColaborador(usuario.idColaborador || null);
    }
  }, [usuario]);

  const cargarColaboradores = async () => {
    setLoading(true);
    try {
      const [response, todos] = await Promise.all([
        serviceColaborador.colaboradorSinUsuario(),
        serviceColaborador.obtenerColaboradores(),
      ]);

      const colaboradorDelUsuario = todos.find(
        (colaborador) => colaborador.idColaborador === usuario?.idColaborador
      );

      if (response.length > 0) {
        const options = response.map((colaborador) => ({
          value: colaborador.idColaborador,
          label: colaborador.nombre,
        }));

        if (colaboradorDelUsuario) {
          options.push({
            value: colaboradorDelUsuario.idColaborador,
            label: colaboradorDelUsuario.nombre,
          });
        }

        setColaboradores(options);

        if (usuario) {
          const currentColaborador = options.find(
            (option) => option.value === usuario.idColaborador
          );
          setSelectedColaborador(currentColaborador || null);
        }
      } else {
        setColaboradores([{ value: 0, label: "No hay colaboradores sin usuario" }]);
      }
    } catch (error) {
      setColaboradores([{ value: 0, label: "Error al cargar colaboradores" }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      cargarColaboradores();
    }
  }, [open]);

  const handleSave = async () => {
    if (!nombreUsuario || !rol || idColaborador === null) {
      message.error('Todos los campos son obligatorios');
      return;
    }

    const updatedUsuario = { ...usuarioState, nombreUsuario, rol, idColaborador };

    if (usuario) {
      try {
        await service.actualizarUsuario(usuario.idUsuario, updatedUsuario);
        message.success('Usuario actualizado exitosamente');
        setNombreUsuario('');
        setRol('empleado');
        setIdColaborador(null);
        setSelectedColaborador(null);
        onUpdate(usuario.idUsuario);
        onClose();
      } catch (error) {
        console.error('Error al actualizar usuario', error);
        message.error('Error al actualizar usuario');
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
          <AntSelect
            value={rol}
            onChange={(value) => setRol(value)}
            options={[
              { value: 'admin', label: 'Administrador' },
              { value: 'supervisor', label: 'Supervisor' },
              { value: 'empleado', label: 'Empleado' },
            ]}
          />
        </Form.Item>
        <Form.Item label="Nombre del Colaborador">
          <AntSelect
            value={selectedColaborador?.value}
            onChange={(value) => {
              const selectedOption = colaboradores.find(option => option.value === value);
              setIdColaborador(selectedOption?.value || null);
              setSelectedColaborador(selectedOption || null);
            }}
            options={loading ? [{ value: 0, label: 'Cargando...' }] : colaboradores}
            disabled={loading}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
          <span style={{ marginRight: '10px' }} />
          <Button type="primary" danger onClick={onClose}>Cancelar</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUsuarioModal;
