import { createContext, useContext, useState, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import UsuarioService from './services/usuario.service';
import { Colaborador } from './services/colaborador.service';


interface AuthContextType {
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  userRole: string | null;
  setUserRole: (userRole: string) => void;
  logout: () => void;
  colaborador: Colaborador | null;
  setColaborador: (colaborador: Colaborador | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const decodeToken = () => {
  
  try{
    const token = localStorage.getItem('accessToken');
    if(token){
      const decodedToken: any = jwtDecode(token);
      return decodedToken.rol || null;
    }
    else{
      return null;
    }
  }catch(error){
    console.error('Error al decodificar el token: ', error);
    return null;
  }
};

const StoredData = () => {
  const data = localStorage.getItem('employee');
  if(data){
    const colaborador = JSON.parse(data);
    return colaborador;
  }
  return null;
}


export function AuthProvider({ children }: AuthProviderProps) {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('accessToken'));
  const [userRole, setUserRole] = useState<string | null>(decodeToken());
  const [colaborador, setColaborador] = useState<Colaborador | null>(StoredData());
  const navigate = useNavigate();
  const usuarioService = new UsuarioService();

   const logout = async() => {
  
    const token = localStorage.getItem('refreshToken');
          if (token) {

            console.log('enra aqui')
            const response = await usuarioService.logout(token);
            
            if (response.status === 200) {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              sessionStorage.removeItem('Welcome');
              setLoggedIn(false);
              navigate('/');
            }
          }
  };


  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, userRole, setUserRole, logout, colaborador, setColaborador }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
