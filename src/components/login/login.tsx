import React, { useState, useEffect  } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import './login.css'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Input } from './loginStyles';
import { useAuth } from '../../authProvider';
import UsuarioService from '../../services/usuario.service';
import { toast, ToastContainer } from 'react-toastify';
import LinearProgress from '@mui/material/LinearProgress';
import { jwtDecode } from 'jwt-decode';

const usuarioService = new UsuarioService();
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [band, setBand] = useState(false);
  const { setLoggedIn, setUserRole } = useAuth();
  const [isLoading, setLoading] =useState(false);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        nombreUsuario: username,
        contrasena: password
      };
      setLoggedIn(true);

      const tokens= await usuarioService.login(data);
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      
      const decodedToken: any = jwtDecode(tokens.accessToken);
      setUserRole(decodedToken.rol);

      document.body.style.backgroundImage = 'none';
    } catch (error) {
        setLoading(false);
        toast.error('Usuario o contraseña incorrecta', {
          position: 'bottom-right', 
          autoClose: 1500,
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white', 
          },
        }); 
      setBand(true);
      setTimeout(() => {
        setBand(false);
      }, 1000);
    }
  };

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/bg-acib.jpg)';
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
            <img src="/LOGO.png" alt="" id='acibLogo'/>
            <div className="divider-vertical"></div>
            <img src="/logoSAAG.png" alt="" className='imgSA'/>
            <img src="/LOGO.png" alt="" id='acibLogo2'/>
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
              label={<span className="custom-label">Mostrar contraseña</span>}
            />
            </div>
            <button className='btnLogin' type="submit">INGRESAR</button>
            {isLoading ? <LinearProgress  /> : ''}
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
  
};

export default Login;


