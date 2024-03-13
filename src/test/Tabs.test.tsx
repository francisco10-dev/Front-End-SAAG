import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import TabsSolicitudAdmin  from '../components/solicitudes/tabsSolictud';

//Pruebas para el componente TabsSolicitudAdmin.
describe('TabsSolicitudAdmin', () => {
    //Prueba para verificar la funcionalidad de renderización y cambio entre pestañas.
    it('renderiza y permite cambiar entre pestañas', async () => {
      //Renderiza el componente TabsSolicitudAdmin.
      render(<TabsSolicitudAdmin />);
      const user = userEvent.setup(); //Prepara las simulaciones de eventos de usuario.
    
      //Espera de forma asíncrona a que se cumpla una condición.
      await waitFor(() => {
        //Obtiene la pestaña 'Todas' por su rol y nombre, y verifica que esté seleccionada por defecto.
        const tabTodas = screen.getByRole('tab', { name: /todas/i });
        expect(tabTodas).toHaveAttribute('aria-selected', 'true');
      });
    
      //Obtiene la pestaña 'Procesadas' y simula un clic sobre ella.
      const tabProcesadas = screen.getByRole('tab', { name: /procesadas/i });
      await user.click(tabProcesadas);
      
      //Espera a que el panel correspondiente a la pestaña 'Procesadas' esté presente en el documento.
      await waitFor(() => {
        const panelProcesadas = screen.getByRole('tabpanel', { name: /procesadas/i });
        expect(panelProcesadas).toBeInTheDocument();
      });
    });
  });
