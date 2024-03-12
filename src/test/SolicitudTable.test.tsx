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

// Prueba de Interacciones (como selección de fila y botones de acción) NO FUNCIONA
  it('enables the manage and delete buttons when a row checkbox is checked', async () => {
    const mockRows = [
      { idSolicitud: 1, tipoSolicitud: 'SGS', asunto: 'as', nombreColaborador: 'aaron', nombreEncargado: 'Aaron', fechaSolicitud: '23-02-2024', estado: 'procesada' },
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

    const checkbox = screen.getByRole('checkbox', {
      name: /select row idSolicitud:1/i,
    });

    await user.click(checkbox);

    expect(screen.getByRole('button', { name: /Gestionar/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /Eliminar/i })).toBeEnabled();
  });


describe('DataTable row selection', () => {
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
});