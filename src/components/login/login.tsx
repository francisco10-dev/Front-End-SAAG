import React, { useState, useEffect  } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import './login.css'
import { Input } from './loginStyles';
import { useAuth } from '../../authProvider';
import UsuarioService from '../../services/usuario.service';
import { toast, ToastContainer } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router';

const usuarioService = new UsuarioService();

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [band, setBand] = useState(false);
  const { setLoggedIn, setUserRole, setColaborador, loadPhoto,setNameSupervisor } = useAuth();
  const [isLoading, setIsLoading] =useState(false);
  const navigate = useNavigate();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast.dismiss();
    try {
      const data = {
        nombreUsuario: username,
        contrasena: password
      };
      const response = await usuarioService.login(data);
      if (response.status === 200) {
        console.log(response.data)
        handleSuccessfulLogin(response.data);
      }
    } catch (error) {
      if(error instanceof Error && error.message.includes('401')){
        displayErrorToast('Credenciales de acceso incorrectas.');
      }else{
        displayErrorToast('Ocurrió un error al comunicarse con el servidor, por favor intente más tarde.');
      }
      setBandWithTimeout();
    }finally{
      setIsLoading(false);
    }
  };

  const handleNavigation = (response:any) => {
    const rol = getUserRole(response);
    if(rol === 'admin'){
      navigate('/dashboard');
    }else if(rol === 'supervisor'){
      navigate('/solicitudes');
    }else{
      navigate('/solicitud-form');
    }
  }
  
  const handleSuccessfulLogin = (response: any) => {
    setLoggedIn(true);
    handleNavigation(response);
    saveTokens(response);
    loadPhoto(response.colaborador.idColaborador);
    saveUserData(response);
    document.body.style.backgroundImage = 'none';
  };
  
  const saveTokens = (response: any) => {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('requestsCount', '0');
    localStorage.setItem('employeesCount', '0');
    localStorage.setItem('usersCount', '0');
  };
  
  const saveUserData = (response: any) => {
    localStorage.setItem('employee', JSON.stringify(response.colaborador));
    setColaborador(response.colaborador);
    setNameSupervisor(response.supervisor);
    setUserRole(getUserRole(response));
  };

  const getUserRole = (response: any) => {
    const decodedToken: any = jwtDecode(response.accessToken);
    return decodedToken.rol;
  }
  
  const displayErrorToast = (message: string) => {
    toast.error(message, {
      position: 'bottom-right',
      autoClose: false,
      style: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
      },
    });
  };
  
  const setBandWithTimeout = () => {
    setBand(true);
    setTimeout(() => setBand(false), 1000);
  };

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/bg-acib.jpg)';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundSize = 'cover';
  }, []); // Se aplica este fondo cuando se ejecuta el componente.


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
          <form onSubmit={handleLogin} className='form'>
            <div className='form-group'>
              <Input
                type="text"
                id="username"
                value={username}
                placeholder='Usuario'
                onChange={(e : React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
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
                onChange={(e : React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className={band ? 'error' : ''}
                required
              />
              <span 
                role='button' 
                className="password-toggle" 
                onClick={() => setPasswordVisible(!passwordVisible)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setPasswordVisible(!passwordVisible);
                  }
                }}
              >
                {passwordVisible ?  <VisibilityOffIcon className='showPasswordBtn' /> : <RemoveRedEyeIcon className='showPasswordBtn'/>}
              </span>
            </div>
            <button className={`btnLogin ${isLoading ? 'loading' : ''}`} type="submit">
              {isLoading ? <CircularProgress size={27} color="inherit" /> : 'INGRESAR'}
            </button>          
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
  
};

export default Login;



