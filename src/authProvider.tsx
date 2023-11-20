import { createContext, useContext, useState, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  userRole: string | null;
  setUserRole: (userRole: string) => void;
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

export function AuthProvider({ children }: AuthProviderProps) {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('accessToken'));
  const [userRole, setUserRole] = useState<string | null>(decodeToken());


  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, userRole, setUserRole }}>
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
