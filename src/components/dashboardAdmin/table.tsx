import  { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ColabUsuario } from './tabs';

interface DataTableProps {
  columns: GridColDef[];
  rows: ColabUsuario[];
  filterFunction: (rows: ColabUsuario[], filterText: string) => ColabUsuario[];
  getRowId: (row: ColabUsuario) => any;
  onDeleteRow: (idsToDelete: number[]) => void;
  onUpdateRow: (idsToUpdate: number) => void;
}

export default function DataTable(props: DataTableProps) {
  const {columns, rows, filterFunction, getRowId, onDeleteRow } = props;
  const [filteredRows, setFilteredRows] = useState(rows);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const applyFilters = () => setFilteredRows(filterFunction(rows, ''));

  useEffect(() => {
    applyFilters();
  }, [rows,filterFunction]);

  const handleDeleteSelected = () => {
    if (selectedRows.length > 0) {
      onDeleteRow(selectedRows);
      setSelectedRows([]);
    }
  };

  const handleSelectionModelChange = (selectionModel: any) => {
    setSelectedRows(selectionModel);
  };

  return (
    <div style={{ height: 370, width: '100%' }}>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        checkboxSelection
        rowSelectionModel={selectedRows}
        onRowSelectionModelChange={handleSelectionModelChange}
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
      <button className='button' onClick={handleDeleteSelected}>Eliminar seleccionados</button>
    </div>
  );
}


