import { createContext, useContext,useEffect, useState, ReactNode } from 'react';
import {jwtDecode} from "jwt-decode";


interface AuthContextType {
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  userRole?: string;

}



const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('accessToken'));
  const [userRole, setUserRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token){
      login(token);
    }
  }, []);

  const login = (token: string) => {
    try{
      const decodedToken: any = jwtDecode(token);
      if(decodedToken){
        setUserRole(decodedToken.rol);
      }

    }catch (error){
      console.error('Error al decodificar el token');
    }

  };

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, userRole}}>
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
