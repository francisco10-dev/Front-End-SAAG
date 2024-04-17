import { useState, useEffect } from 'react';
import './admin.css';
import UsuarioService from '../../services/usuario.service';
import ColaboradorService from '../../services/colaborador.service';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TabsUsuarios from "./tabs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Modal, Form, Input, Select as AntSelect, Button } from 'antd';

interface ColaboradorOption {
  value: number;
  label: string;
}

const Administrador = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('empleado');
  const [idColaborador, setIdColaborador] = useState<number | null>(null);
  const usuarioService = new UsuarioService();
  const colaboradorService = new ColaboradorService();
  const [selectedColaborador, setSelectedColaborador] = useState<ColaboradorOption | null>(null);
  const [colaboradores, setColaboradores] = useState<ColaboradorOption[]>([]);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [visible, setVisible] = useState(false);

  const alternarVisibilidadContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };
  const cargarColaboradores = async () => {
    try {
      const response = await colaboradorService.colaboradorSinUsuario();
      if (response.length > 0) {
        const options = response.map((colaborador) => ({
          value: colaborador.idColaborador,
          label: colaborador.nombre,
        }));
        setColaboradores(options);
      } else {
        setColaboradores([{ value: 0, label: "No hay registros" }]);
      }
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
      const response = await usuarioService.agregarUsuario(nuevoUsuario);
      toast.success('Usuario creado exitosamente' + response);
      setVisible(false); // Cierra el modal después de guardar exitosamente
      window.location.reload();
    } catch (error) {
      toast.error('Error al crear usuario' + error);
    }
  };

  return (
    <div>
      <h1>Administrador SAAG</h1>
      <div className="container">
        <div className="usuarios-container">
          <h2>Crear Usuario:</h2>
          <Button type="primary" onClick={() => setVisible(true)}>
            Crear Usuario
          </Button>
          <Modal
            title="Crear Usuario"
            open={visible}
            onCancel={() => setVisible(false)}
            footer={[
              <Button key="back" onClick={() => setVisible(false)}>
                Cancelar
              </Button>,
              <Button key="submit" type="primary" onClick={crearUsuario}>
                Crear Usuario
              </Button>,
            ]}
          >
            <Form>
              <Form.Item label="Nombre de Usuario">
                <Input
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                />
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
                <AntSelect
                  value={rol}
                  onChange={(value) => setRol(value)}
                >
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
        </div>
        <div className='tablaUsuarios'>
        </div>
      </div>
      <div className='tabla'>
        <TabsUsuarios />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Administrador;
