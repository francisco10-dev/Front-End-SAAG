import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import TableSolicitud from '../components/solicitudes/tableSolicitud';

//Pruebas para el componente TableSolicitud.
describe('TableSolicitud', () => {
  // Verifica la correcta renderización inicial del componente.
  it('Correcta renderización', () => {
    const mockProps = {
      rows: [],
      deleteRows: jest.fn(),
      isLoading: false,
      onSolicitudUpdate: jest.fn(),
      load: jest.fn(),
    };

    // Renderiza el componente con propiedades simuladas.
    render(<TableSolicitud {...mockProps} />);
    // Espera que el campo de búsqueda esté presente en el documento.
    expect(screen.getByLabelText(/Buscar.../i)).toBeInTheDocument();
  });
});

// Verifica que las filas se muestren correctamente en el componente.
it('Muestra filas', () => {
  const mockRows = [
    { idSolicitud: 1, tipoSolicitud: 'Tipo 1', asunto: 'Asunto 1', nombreColaborador: 'Juan', nombreEncargado: 'Pedro', fechaSolicitud: '2022-01-01', estado: 'Nuevo' },
  ];

  const mockProps = {
    rows: mockRows,
    deleteRows: jest.fn(),
    isLoading: false,
    onSolicitudUpdate: jest.fn(),
    load: jest.fn(),
  };

  // Verifica que el texto 'Tipo 1' esté presente.
  render(<TableSolicitud {...mockProps} />);
  expect(screen.getByText(/Tipo 1/i)).toBeInTheDocument();
});

// Prueba la interacción del usuario al seleccionar un checkbox.
it('Selecciona un checkbox', async () => {
  const mockRows = [
    { idSolicitud: 1, tipoSolicitud: 'Tipo 1', asunto: 'Asunto 1', nombreColaborador: 'Juan', nombreEncargado: 'Pedro', fechaSolicitud: '2022-01-01', estado: 'Nuevo' },
  ];

  const mockProps = {
    rows: mockRows,
    deleteRows: jest.fn(),
    isLoading: false,
    onSolicitudUpdate: jest.fn(),
    load: jest.fn(),
  };

  render(<TableSolicitud {...mockProps} />);
  const user = userEvent.setup();

  // Simula la acción del usuario de hacer clic en un checkbox.
  const checkboxes = screen.getAllByRole('checkbox');
  await user.click(checkboxes[1]);
});

// Verifica que el componente filtre las filas basado en el texto de búsqueda.
it('Filtra las filas basado en el texto de búsqueda', async () => {
  const mockRows = [
    { idSolicitud: 1, tipoSolicitud: 'Tipo 1', asunto: 'Filtro', nombreColaborador: 'Juan', nombreEncargado: 'Pedro', fechaSolicitud: '2022-01-01', estado: 'Nuevo' },
    { idSolicitud: 2, tipoSolicitud: 'Tipo 2', asunto: 'No Mostrar', nombreColaborador: 'Ana', nombreEncargado: 'María', fechaSolicitud: '2022-02-01', estado: 'En Progreso' },
  ];

  render(<TableSolicitud rows={mockRows}  isLoading={false} load={jest.fn()} />);
  const user = userEvent.setup();
  // Simula la escritura del usuario en el campo de búsqueda.
  await user.type(screen.getByLabelText(/Buscar.../i), 'Filtro');
  // Espera que solo se muestren las filas que coincidan con el filtro de búsqueda.
  expect(screen.getByText(/Filtro/i)).toBeInTheDocument();
  expect(screen.queryByText(/No Mostrar/i)).not.toBeInTheDocument();
});
