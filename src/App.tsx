import './App.css';
import Login from './components/login/login';
import { useAuth } from './authProvider'; // Asegúrate de importar useAuth desde el archivo correcto
import MenuPanel from './components/tools/menu';

const App = () => {
  const { loggedIn } = useAuth(); // Accede a loggedIn y setLoggedIn desde el contexto
  const content = loggedIn ? <MenuPanel/> : <Login />;
  

  return (
      <div>
        {content}
      </div>
  );
};

export default App;
