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



interface ColaboradorOption {
  value: number;
  label: string;
}

const Administrador = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('empleado');
  const [idColaborador, setIdColaborador] = useState(4);
  const usuarioService = new UsuarioService();
  const colaboradorService = new ColaboradorService();
  const [selectedColaborador, setSelectedColaborador] = useState<ColaboradorOption | null>(null);
  const [colaboradores, setColaboradores] = useState<ColaboradorOption[]>([]);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
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
    console.log(idColaborador);
    if (!nombreUsuario || !contrasena || !idColaborador || isNaN(idColaborador)) {
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
      toast.success('Usuario creado exitosamente'+ response);
      limpiarFormulario();
      window.location.reload();
    
    } catch (error) {
      toast.error('Error al crear usuario' + error);
    }
  };
  
  const limpiarFormulario = () => {
    setNombreUsuario('');
    setContrasena('');
    setRol('empleado');
    setSelectedColaborador(null);
  };

  return (
    <div>
      <h1>Administrador SAAG</h1>
      <div className="container">
        <div className="usuarios-container">
          <h2>Crear Usuario:</h2>
          <form>
            <label htmlFor="nombreUsuario">Nombre de Usuario:</label>
            <br />
            <input
              type="text"
              id="nombreUsuario"
              value={nombreUsuario}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (/^[a-zA-Z]*$/.test(inputValue)) {
                  setNombreUsuario(inputValue);
                }
              }}
            />
            <br />
            <br />
            <label htmlFor="contrasena">Contraseña:</label>
            <br />
            <div>
              <div className="input-with-icon">
                <input
                  type={mostrarContrasena ? 'text' : 'password'}
                  id="contrasena"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                />
                <span onClick={alternarVisibilidadContrasena}>
                  <FontAwesomeIcon icon={mostrarContrasena ? faEye : faEyeSlash} />
                </span>
              </div>
            </div>
            <br />
            <label htmlFor="rol">Tipo de empleado:</label>
            <br />
            <select id='rol' value={rol} onChange={(e) => setRol(e.target.value)}>
              <option value="empleado">Empleado</option>
              <option value="admin">Administrador</option>
            </select>
            <br />
            <label htmlFor="idColaborador">ID de Colaborador:</label>
            <br/>
            <Select
            value={selectedColaborador || null}
            onChange={(selectedOption: ColaboradorOption | null) => {
              if (selectedOption) {
                const { value, label } = selectedOption;
                console.log(value);
                console.log(label);
                setIdColaborador(value || 0);
                setSelectedColaborador(selectedOption);
              } else {
                setIdColaborador(0);
                setSelectedColaborador(null);
              }
            }}
            options={colaboradores.map(({ value, label }) => ({ value, label }))}
          />
          </form>
          <br />
          <button type="button" onClick={crearUsuario}>
            Crear Usuario
          </button>
        </div>
        <div className='tablaUsuarios'>
          
        </div>
        </div>
        <div className='tabla'>
        <TabsUsuarios/>
        </div>
      <ToastContainer />
    </div>
  );
};

export default Administrador;


