// recordar quitar los comentarios 
import /*React,*/ { useState, /*useEffect*/ } from 'react';
import './admin.css';
import UsuarioService from '../../services/usuario.service';
//import Select from 'react-select';    // aun falta agregar lo del combo box que va a suplantar al input que esta, esto se instala con: npm install react-select
import { toast, ToastContainer } from 'react-toastify';  // este es para los mensajes que se ven, esto se instala con: npm install react-toastify
import 'react-toastify/dist/ReactToastify.css';

const Administrador = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('empleado');
  const [idColaborador, setIdColaborador] = useState(4);
  const usuarioService = new UsuarioService();

 // const [selectedColaborador, setSelectedColaborador] = useState(null);
 // const [colaboradores, setColaboradores] = useState([]);

  /*const cargarColaboradores = async () => {
    try {
      const response = await usuarioService.obtenerColaboradores();
      const options = response.map((colaborador) => ({
        value: colaborador.id,
        label: colaborador.nombre,
      }));
      setColaboradores(options);
    } catch (error) {
      console.error('Error al cargar colaboradores:', error);
    }
  };

  useEffect(() => {
    cargarColaboradores();
  }, []);*/

  const crearUsuario = async () => {
    if (!nombreUsuario || !contrasena || !idColaborador || isNaN(idColaborador)) {
      // Mostrar mensaje emergente de error si faltan campos o el ID de Colaborador no es válido
      toast.error('Todos los campos son obligatorios y el ID de Colaborador debe ser un número válido');
      return;
    }
  
    if (contrasena.length < 10) {
      // Validar que la contraseña tenga al menos 10 caracteres
      toast.error('La contraseña debe tener al menos 10 caracteres.');
      return;
    }
  
    if (!/[a-z]/.test(contrasena) || !/[A-Z]/.test(contrasena) || !/\d/.test(contrasena) || !/\W/.test(contrasena)) {
      // Validar que la contraseña contenga al menos una letra minúscula, una letra mayúscula, un número y un carácter especial
      toast.error('La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial.');
      return;
    }
  
    const nuevoUsuario = {
      nombreUsuario,
      contrasena,
      rol,
      idColaborador,
      // idColaborador: selectedColaborador ? selectedColaborador.value : idColaborador,
    };
  
    try {
      const response = await usuarioService.agregarUsuario(nuevoUsuario);
      console.log('Respuesta del servidor:', response);
      toast.success('Usuario creado exitosamente');
      limpiarFormulario();
    } catch (error) {
      console.error('Error al crear usuario:', error);
      toast.error('Error al crear usuario');
    }
  };
  
  const limpiarFormulario = () => {
    setNombreUsuario('');
    setContrasena('');
    setRol('empleado');
    setIdColaborador(4);
   // setSelectedColaborador(null);
  };

  return (
    <>
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
                // Utiliza una expresión regular para validar que solo se ingresen letras (mayúsculas o minúsculas)
                if (/^[a-zA-Z]*$/.test(inputValue)) {
                  setNombreUsuario(inputValue);
                }
              }}
            />
            <br />
            <br />
            <label htmlFor="contrasena">Contraseña:</label>
            <br />
            <input
              type="password"
              id="contrasena"
              value={contrasena}
              onChange={(e) => {
                const inputValue = e.target.value;
                  setContrasena(inputValue);               
              }}
            />
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
            <input
              type="text"
              id="idColaborador"
              value={idColaborador}
              onChange={(e) => {
                const inputValue = e.target.value;
                setIdColaborador(/^\d+$/.test(inputValue) ? parseInt(inputValue, 10) : idColaborador);
              }}
            />
          </form>
          <br />
          <button type="button" onClick={crearUsuario}>
            Crear Usuario
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};
// incompleto aun falta por agregar, estan en pruebas 
export default Administrador;

// El combo box para llenarse con el id de los colaboradores: recordar que es por los colaboradores que no puedo usarlo aún
/*<Select
value={selectedColaborador}
onChange={(value) => setSelectedColaborador(value)}
options={colaboradores}
/>*/
