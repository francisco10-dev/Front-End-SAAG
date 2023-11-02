import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import {Usuario} from '../../services/usuario.service';

export interface DataTableProps {
  columns: GridColDef[];
  rows: any[];
  filterFunction: (rows: any[], filterText: string) => any[];
  getRowId: (row: any) => any; 
}

export default function DataTable(props: DataTableProps) {
  const { columns, rows, filterFunction, getRowId } = props;
  const [filterText, setFilterText] = useState('');
  const [filteredRows, setFilteredRows] = useState(rows); 
  const [selectedRow, setSelectedRow] = useState<Usuario | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const applyFilters = () => {
    const filteredData = filterFunction(rows, filterText);
    setFilteredRows(filteredData);
  };

  useEffect(() => {
    applyFilters();
  }, [filterText, rows, filterFunction]);

  const handleRowClick = (params: { row: Usuario }) => {
    setSelectedRow(params.row);
    setIsModalOpen(true);
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <TextField
        label="Buscar..."
        variant="standard"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{ marginBottom: '40px'}}
      />
      <DataGrid
        rows={filteredRows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        getRowId={getRowId} // Usa la función getRowId personalizada
        pageSizeOptions={[5, 10]}
        checkboxSelection
        onRowClick={handleRowClick}
        style={{
            marginBottom: '20px',
            border: 'none', 
            boxShadow: 'none',
          }}
      />
    </div>
  );
}