import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import UsuarioService from './services/usuario.service';
import { Colaborador } from './services/colaborador.service';
import ExpedienteService from './services/expediente.service';


interface AuthContextType {
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  userRole: string | null;
  setUserRole: (userRole: string) => void;
  logout: () => void;
  colaborador: Colaborador | null;
  setColaborador: (colaborador: Colaborador | null) => void;
  photo: string | null;
  loadPhoto: (id: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  readonly children: ReactNode;
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
  const [photo, setPhoto] = useState<string | null>(localStorage.getItem('photo'));
  const navigate = useNavigate();
  const usuarioService = new UsuarioService();

   const logout = async() => {
  
    const token = localStorage.getItem('refreshToken');
          if (token) {

            const response = await usuarioService.logout(token);
            
            if (response.status === 200) {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              sessionStorage.removeItem('Welcome');
              localStorage.removeItem('photo');
              setPhoto(null);
              setLoggedIn(false);
              navigate('/');
            }
          }
  };

  const loadPhoto = async (id: any) => {
    try {
      const expService = new ExpedienteService();
      const response = await expService.getPhoto(id);
      const imageUrl = response.data.imageUrl;
      setPhoto(imageUrl);
      localStorage.setItem('photo', imageUrl);
    } catch (error) {
      console.log(error);
    }
  }

  const contextValue = useMemo(() => ({
    loadPhoto,
    photo,
    loggedIn,
    setLoggedIn,
    userRole,
    setUserRole,
    logout,
    colaborador,
    setColaborador
  }), [loadPhoto, photo, loggedIn, userRole, colaborador]);


  return (
    <AuthContext.Provider value={contextValue}>
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
