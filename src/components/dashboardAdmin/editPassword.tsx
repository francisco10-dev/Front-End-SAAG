import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import UsuarioService, { Usuario } from '../../services/usuario.service';
import ColaboradorService from '../../services/colaborador.service';

interface ColaboradorOption {
  value: number;
  label: string;
}

interface EditPasswordModalProps {
  open: boolean;
  usuario: Usuario | null;
  onClose: () => void;
  onUpdate: (usuarioId: number) => void;
}

const EditPasswordModal: React.FC<EditPasswordModalProps> = ({ open, usuario, onClose, onUpdate }) => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [contrasenaValida, setContrasenaValida] = useState(true);
  const [rol, setRol] = useState('empleado');
  const [idColaborador, setIdColaborador] = useState<number | null>(null);
  const [selectedColaborador, setSelectedColaborador] = useState<ColaboradorOption | null>(null);
  const [_colaboradores, setColaboradores] = useState<ColaboradorOption[]>([]);
  const [_loading, setLoading] = useState(false);
  const service = new UsuarioService();
  const serviceColaborador = new ColaboradorService();
  const [usuarioState, setUsuarioState] = useState<Usuario | null>(null);

  const validarContrasena = (contrasena: string): boolean => {
    return (
      contrasena.length >= 8 &&
      /[A-Z]/.test(contrasena) &&
      /[a-z]/.test(contrasena) &&
      /[0-9]/.test(contrasena) &&
      /[@#$%^&*_!.]/.test(contrasena)
    );
  };

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

    if (!validarContrasena(contrasena)) {
        message.error('La contraseña no cumple con los requisitos');
        return;
      }

    const updatedUsuario = { ...usuarioState, nombreUsuario, rol, idColaborador, contrasena };

    if (usuario) {
      try {
        await service.actualizarUsuario(usuario.idUsuario, updatedUsuario);
        message.success('Usuario actualizado exitosamente');
        setNombreUsuario('');
        setContrasena('');
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

  const handleContrasenaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaContrasena = e.target.value;
    setContrasena(nuevaContrasena);
    setContrasenaValida(validarContrasena(nuevaContrasena));
  };

  return (
    <Modal title={`Editar contrasena de usuario ${usuarioState?.idUsuario}`} open={open} onCancel={onClose} footer={null}>
      <Form layout="vertical" onFinish={handleSave}>
        <Form.Item label="Nombre de Usuario">
            <Input value={nombreUsuario} readOnly />
        </Form.Item>
        <Form.Item
          label="Contraseña"
          validateStatus={contrasenaValida ? '' : 'error'}
          help={contrasenaValida ? '' : 'La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula, un número y un carácter especial (@#$%^&*_!.).'}
        >
          <Input.Password value={contrasena} onChange={handleContrasenaChange} />
        </Form.Item>
        <Form.Item label="Tipo de Empleado">
        <Input value={rol} readOnly />
        </Form.Item>
        <Form.Item label="Nombre del Colaborador">
        <Input value={selectedColaborador?.label} readOnly />
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

export default EditPasswordModal;
