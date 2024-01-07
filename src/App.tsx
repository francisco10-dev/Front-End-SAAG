import './App.css';
import Login from './components/login/login';
import { useAuth } from './authProvider'; 
import MenuPanel from './components/tools/menu';
import { useEffect, useState } from 'react';
import Welcome from './components/welcome/welcome';

const App = () => {
  const { loggedIn } = useAuth(); // Accede a loggedIn y setLoggedIn desde el contexto
  const [showWelcome, setShowWelcome] = useState(false);
  const content = loggedIn ? <MenuPanel/> : <Login />;
  
  useEffect(() => {
    const hasShownWelcome = sessionStorage.getItem('Welcome');

    if (loggedIn && !hasShownWelcome) {
      setShowWelcome(true);
      setTimeout(() => {
        setShowWelcome(false);
        sessionStorage.setItem('Welcome', 'true');
      }, 2000); // duración en segundos que dura la pantalla de bienvenida.
    }
  }, [loggedIn]);

  return (
      <div>
        {showWelcome ? <Welcome /> : content}
      </div>
  );
};

export default App;
