import  { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import { Usuario } from '../../services/usuario.service';

export interface DataTableProps {
  columns: GridColDef[];
  rows: Usuario[];
  filterFunction: (rows: Usuario[], filterText: string) => Usuario[];
  getRowId: (row: Usuario) => any;
  onDeleteRow: (idsToDelete: number[]) => void;
}

export default function DataTable(props: DataTableProps) {
  const { columns, rows, filterFunction, getRowId, onDeleteRow } = props;
  const [filterText, setFilterText] = useState('');
  const [filteredRows, setFilteredRows] = useState(rows);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  const applyFilters = () => {
    const filteredData = filterFunction(rows, filterText);
    setFilteredRows(filteredData);
  };

  useEffect(() => {
    applyFilters();
  }, [filterText, rows, filterFunction]);

  const handleRowClick = (idUsuario: number) => {
    setSelectedRows((prevSelectedRows) => ({
      ...prevSelectedRows,
      [idUsuario]: !prevSelectedRows[idUsuario],
    }));
  };

  const handleDeleteSelected = () => {
    const selectedIds = Object.keys(selectedRows)
      .filter((id) => selectedRows[id] === true)
      .map(Number);

    if (selectedIds.length > 0) {
      onDeleteRow(selectedIds);
      setSelectedRows({});
    }
  };

  return (
    <div style={{ height: 370, width: '100%' }}>
      <TextField
        label="Buscar..."
        variant="standard"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{ marginBottom: '40px' }}
      />
      <DataGrid
        rows={filteredRows}
        columns={columns}
        rowSelectionModel={Object.keys(selectedRows).filter(
          (id) => selectedRows[id] === true
        )}
        onRowSelectionModelChange={(selectionModel: any[]) => {
          const newSelectedRows: Record<string, boolean> = {};
          selectionModel.forEach((id) => {
            newSelectedRows[id] = true;
          });
          setSelectedRows(newSelectedRows);
        }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        getRowId={getRowId}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        onRowClick={(params) => {
          handleRowClick(params.row.idUsuario as number);
        }}
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

