import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select as AntSelect, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import UsuarioService from '../../services/usuario.service';
import ColaboradorService from '../../services/colaborador.service';
import { toast } from 'react-toastify';

interface ColaboradorOption {
  value: number;
  label: string;
}

interface AgregarUsuarioModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onAgregar: () => void;
}

const AgregarUsuarioModal: React.FC<AgregarUsuarioModalProps> = ({ visible, setVisible, onAgregar }) => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('empleado');
  const [idColaborador, setIdColaborador] = useState<number | null>(null);
  const [selectedColaborador, setSelectedColaborador] = useState<ColaboradorOption | null>(null);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const usuarioService = new UsuarioService();
  const colaboradorService = new ColaboradorService();
  const [colaboradores, setColaboradores] = useState<ColaboradorOption[]>([]);

  const alternarVisibilidadContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  const cargarColaboradores = async () => {
    try {
      const response = await colaboradorService.colaboradorSinUsuario();
      const options = response.map(colaborador => ({
        value: colaborador.idColaborador,
        label: colaborador.nombre,
      }));
      setColaboradores(options.length > 0 ? options : [{ value: 0, label: "No hay registros" }]);
    } catch (error) {
      setColaboradores([{ value: 0, label: "No existen colaboradores disponibles" }]);
    }
  };
  

  useEffect(() => {
    cargarColaboradores();
  }, []);

  const crearUsuario = async () => {
    if (!nombreUsuario || !contrasena || !idColaborador || isNaN(idColaborador!)) {
      toast.error('Todos los campos son obligatorios y el ID de Colaborador debe ser un número válido');
      return;
    }
    if (contrasena.length < 10) {
      toast.error('La contraseña debe tener al menos 10 caracteres.');
      return;
    }
    if (!/[a-z]/.test(contrasena) || !/[A-Z]/.test(contrasena) || !/\d/.test(contrasena) || !/\W/.test(contrasena)) {
      toast.error('La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial.');
      return;
    }
    const nuevoUsuario = {
      nombreUsuario,
      contrasena,
      rol,
      idColaborador,
    };
    try {
      await usuarioService.agregarUsuario(nuevoUsuario);
      toast.success('Usuario creado exitosamente');
      setVisible(false); // Cierra el modal después de guardar exitosamente
      onAgregar(); // Ejecuta la función onAgregar para actualizar la lista de usuarios
    } catch (error) {
      toast.error('Error al crear usuario: ' + error);
    }
  };

  return (
    <Modal
      title="Agregar Usuario"
      open={visible}
      onCancel={() => setVisible(false)}
      footer={[
        <Button key="back" onClick={() => setVisible(false)}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={crearUsuario}>
          Agregar Usuario
        </Button>,
      ]}
    >
      <Form>
        <Form.Item label="Nombre de Usuario">
          <Input value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} />
        </Form.Item>
        <Form.Item label="Contraseña">
          <Input.Password
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            iconRender={visible => (visible ? <FontAwesomeIcon icon={faEye} onClick={alternarVisibilidadContrasena} /> : <FontAwesomeIcon icon={faEyeSlash} onClick={alternarVisibilidadContrasena} />)}
            type={mostrarContrasena ? 'text' : 'password'}
          />
        </Form.Item>
        <Form.Item label="Tipo de empleado">
          <AntSelect value={rol} onChange={(value) => setRol(value)}>
            <AntSelect.Option value="empleado">Empleado</AntSelect.Option>
            <AntSelect.Option value="admin">Administrador</AntSelect.Option>
          </AntSelect>
        </Form.Item>
        <Form.Item label="ID de Colaborador">
          <Select
            value={selectedColaborador}
            onChange={(value) => {
              setIdColaborador(value?.value || null);
              setSelectedColaborador(value);
            }}
            options={colaboradores}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AgregarUsuarioModal;
