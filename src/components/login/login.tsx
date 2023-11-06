import React, { useState, useEffect  } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import './login.css'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Input } from './loginStyles';
import { useAuth } from '../../authProvider';
import UsuarioService from '../../services/usuario.service';


const usuarioService = new UsuarioService();
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [band, setBand] = useState(false);
  const { setLoggedIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    //Acá debe validarse con la información de la bd
    try {
      const data = {
        nombreUsuario: username,
        contrasena: password
      };
      const tokens= await usuarioService.login(data);

      document.body.style.backgroundImage = 'none';
      /* Aquí se puede hacer algo con el objeto de usuario devuelto, 
      como guardar el token en el estado global o redirigir al usuario a otra página.*/
      setLoggedIn(true);
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      
      } catch (error) {
      setBand(true);
      setTimeout(() => {
        setBand(false);
      }, 5000);
    }
  };

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/src/img/bg-acib.jpg)';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundSize = 'cover';
  }, []); // Se aplica este fondo cuando se ejecuta el componente.

  const passwordVisibilidad = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className='view'>
      <div className='center-container'>
        <div className='logos'>
          <div className="contenedor-imagenes">
            <img src="/src/img/LOGO.png" alt="" id='acibLogo'/>
            <div className="divider-vertical"></div>
            <img src="/src/img/logoSAAG.png" alt="" className='imgSA'/>
          </div>
        </div>
        <div className='login-container'>
          <form onSubmit={handleLogin}>
            <div className='form-group'>
              <Input
                type="text"
                id="username"
                value={username}
                placeholder='Usuario'
                onChange={(e) => setUsername(e.target.value)}
                className={band ? 'error' : ''}
                required
              />
            </div>
            <div className='form-group'>
              <Input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                placeholder='Contraseña'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={band ? 'error' : ''}
                required
              />
            </div>
            <div className="form-group" id='check'>
            <FormControlLabel
              control={<Checkbox onChange={passwordVisibilidad} color="warning" />}
              label="Mostrar contraseña"
            />
            </div>
            <button className='btnLogin' type="submit">INGRESAR</button>
            <div className='msj'>
              {band ? (
                <h6><ErrorOutlineIcon/>  Usuario o contraseña incorrecta...</h6>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  
};

export default Login;


