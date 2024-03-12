import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import DataTable from '../components/solicitudes/tableSolicitud';

describe('DataTable', () => {
  it('renders correctly', () => {
    const mockProps = {
      rows: [],
      deleteRows: jest.fn(),
      isLoading: false,
      onSolicitudUpdate: jest.fn(),
      load: jest.fn(),
    };

    render(<DataTable {...mockProps} />);
    expect(screen.getByLabelText(/Buscar.../i)).toBeInTheDocument();
  });
});

//Prueba de Carga y Visualización de Filas
it('displays rows correctly', () => {
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

  render(<DataTable {...mockProps} />);
  expect(screen.getByText(/Tipo 1/i)).toBeInTheDocument();
});

//Prueba de Seleccion de checkbox
it('enables buttons when a row is selected via checkbox', async () => {
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

  render(<DataTable {...mockProps} />);
  const user = userEvent.setup();

  const checkboxes = screen.getAllByRole('checkbox');
  await user.click(checkboxes[1]);

});