import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import { Solicitud } from '../../services/solicitud.service';

export interface DataTableProps {
  columns: GridColDef[];
  rows: any[];
  filterFunction: (rows: any[], filterText: string) => any[];
}

export default function DataTable(props: DataTableProps) {
  const { columns, rows, filterFunction } = props;
  const [filterText, setFilterText] = useState('');
  const [filteredRows, setFilteredRows] = useState(rows); 
  const [selectedRow, setSelectedRow] = useState<Solicitud | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getRowId = (row: Solicitud) => row.idSolicitud;
  selectedRow 
  isModalOpen

  const applyFilters = () => {
    const filteredData = filterFunction(rows, filterText);
    setFilteredRows(filteredData);
  };

  useEffect(() => {
    applyFilters();
  }, [filterText, rows, filterFunction]);

  const handleRowClick = (params: { row: Solicitud }) => {
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
        style={{ marginBottom: '25px'}}
      />
      <DataGrid
        rows={filteredRows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        getRowId={getRowId}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        onRowClick={handleRowClick}
        style={{
            marginBottom: '16px',
            border: 'none', 
            boxShadow: 'none',
          }}
      />
    </div>
  );
}
