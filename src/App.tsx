import React, { useEffect, useState } from 'react';
import Login from './components/login/login';
import { useAuth } from './authProvider'; 
import Welcome from './components/welcome/welcome';
import Main from './components/tools/panel';


const App: React.FC = () => {
  const { loggedIn, logout} = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

 
  useEffect(() => {
    const hasShownWelcome = sessionStorage.getItem('Welcome');

    if (loggedIn && !hasShownWelcome) {
      setShowWelcome(true);
      setTimeout(() => {
        setShowWelcome(false);
        sessionStorage.setItem('Welcome', 'true');
      }, 10000);
    }
  }, [loggedIn]);

  // Funcionalidad para controlar la inactividad del usuario
  useEffect(() => {
      let inactivityTimer: NodeJS.Timeout;

      const handleUserActivity = () => {
        clearTimeout(inactivityTimer);

        inactivityTimer = setTimeout(() => {
        logout();
        },10 * 60 *1000);  //Tiempo de inactividad establecido de 10 minutos
      };

      window.addEventListener('mousemove', handleUserActivity);
      window.addEventListener('keydown', handleUserActivity);

      handleUserActivity();

      return() => {
        window.removeEventListener('mousemove', handleUserActivity);
        window.removeEventListener('keydown', handleUserActivity);
        clearTimeout(inactivityTimer);
      };
      
  }, [logout]);


  return (
    <div>
      {showWelcome ? <Welcome /> : (loggedIn? <Main/> : <Login />)}
    </div>
  );
};

export default App;
