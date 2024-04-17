import React, { useEffect, useState } from 'react';
import Login from './components/login/login';
import { useAuth } from './authProvider'; 
import Welcome from './components/welcome/welcome';
import Main from './components/tools/panel';
import WarningModal from './components/warning-modal/warningModal';


const App: React.FC = () => {
  const { loggedIn, logout} = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
 
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

  function getReadableStatus() {
    if (showWelcome) {
      return <Welcome/>
    }
    return loggedIn ? <Main/>  : <Login/>;
  }

  // Funcionalidad para controlar la inactividad del usuario
  useEffect(() => {
      let inactivityTimer: NodeJS.Timeout;
      let warningTimer: NodeJS.Timeout;

      if(loggedIn){
      const handleUserActivity = () => {
        clearTimeout(inactivityTimer);
        clearTimeout(warningTimer);

        inactivityTimer = setTimeout(() => {
        logout();
        }, 10 * 60 *1000);  //Tiempo de inactividad establecido de 10 minutos
     
        warningTimer = setTimeout(() => {
          setShowWarning(true);
        }, 9.833 * 60 * 1000); // Mostrar advertencia cuando queden 15 segundos menos (9.75 minutos)
      };
     

      window.addEventListener('mousemove', handleUserActivity);
      window.addEventListener('keydown', handleUserActivity);

      handleUserActivity();

      return() => {
        window.removeEventListener('mousemove', handleUserActivity);
        window.removeEventListener('keydown', handleUserActivity);
        clearTimeout(inactivityTimer);
        clearTimeout(warningTimer);
      };
    }
  }, [loggedIn, logout]);

  const handleWarningClose = () => {
    setShowWarning(false);
  };

  return (
    <div>
      {getReadableStatus()}
      {showWarning && <WarningModal onClose={handleWarningClose} />}
    </div>
  );
};

export default App;
