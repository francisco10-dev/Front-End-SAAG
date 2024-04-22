import './admin.css';
import TabsUsuarios from "./tabs";

const Administrador = () => {
  return (
    <div>
      <div className="container">
        <div className='tabla'>
          <TabsUsuarios />
        </div>
      </div>
    </div>
  );
};

export default Administrador;
