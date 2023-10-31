import React, { useState, useEffect } from 'react';
import './admin.css';
import UsuarioService, { Usuario } from '../../services/usuario.service';
import Select from 'react-select';

const Administrador = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('empleado');
  const [selectedColaborador, setSelectedColaborador] = useState(null);
  const [colaboradores, setColaboradores] = useState([]);

  const usuarioService = new UsuarioService();

 /* const cargarColaboradores = async () => {
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
    const nuevoUsuario = {
      nombreUsuario,
      contrasena,
      rol,
     // idColaborador: selectedColaborador.value,
    };

    try {
      const response = await usuarioService.agregarUsuario(nuevoUsuario);
      console.log('Respuesta del servidor:', response);
      limpiarFormulario();
    } catch (error) {
      console.error('Error al crear usuario:', error);
    }
  };

  const limpiarFormulario = () => {
    setNombreUsuario('');
    setContrasena('');
    setRol('empleado');
    setSelectedColaborador(null);
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
              onChange={(e) => setNombreUsuario(e.target.value)}
            />
            <br />
            <label htmlFor="contrasena">Contraseña:</label>
            <br />
            <input
              type="password"
              id="contrasena"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
            <br />
            <label htmlFor="rol">Tipo de empleado:</label>
            <br />
            <select
            id='rol'
              value={rol}
              onChange={(e) => setRol(e.target.value)}
            >
              <option value="empleado">Empleado</option>
              <option value="admin">Administrador</option>
            </select>
            <br />
            <label htmlFor="colaborador">ID de Colaborador:</label>
            <br />
            <Select
              value={selectedColaborador}
              onChange={(value) => setSelectedColaborador(value)}
              options={colaboradores}
            />
          </form>
          <br />
          <button type="button" onClick={crearUsuario}>
            Crear Usuario
          </button>
        </div>
      </div>
    </>
  );
};

export default Administrador;
