import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Usuario } from '../../services/usuario.service';

interface DataTableProps {
  columns: GridColDef[];
  rows: Usuario[];
  filterFunction: (rows: Usuario[], filterText: string) => Usuario[];
  getRowId: (row: Usuario) => any;
  onDeleteRow: (idsToDelete: number[]) => void;
}

export default function DataTable(props: DataTableProps) {
  const { columns, rows, filterFunction, getRowId, onDeleteRow } = props;
  const [filteredRows, setFilteredRows] = useState(rows);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const applyFilters = () => setFilteredRows(filterFunction(rows, ''));

  useEffect(() => {
    applyFilters();
  }, [rows, filterFunction]);

  const handleCheckboxChange = (selectionModel: any) => {
    const selectedIds = selectionModel.map((id: string) => Number(id));

    // Verificar si la fila ya está seleccionada
    const updatedSelectedRows = selectedRows.includes(selectedIds[0])
      ? selectedRows.filter((id) => id !== selectedIds[0]) // Desmarcar la fila si ya está seleccionada
      : [...selectedRows, selectedIds[0]]; // Marcar la fila si no está seleccionada

    setSelectedRows(updatedSelectedRows);
  };

  const handleDeleteSelected = () => {
    if (selectedRows.length > 0) {
      onDeleteRow(selectedRows);
      setSelectedRows([]);
    }
  };

  return (
    <div style={{ height: 370, width: '100%' }}>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        checkboxSelection
        onRowSelectionModelChange={handleCheckboxChange}
        rowSelectionModel={selectedRows.map(String)}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        getRowId={getRowId}
        pageSizeOptions={[5, 10]}
        style={{
          marginBottom: '20px',
          border: 'none',
          boxShadow: 'none',
          fontSize: '20px',
          fontFamily: 'GOTHAM Medium',
        }}
      />
      <button onClick={handleDeleteSelected}>Eliminar seleccionados</button>
    </div>
  );
}

