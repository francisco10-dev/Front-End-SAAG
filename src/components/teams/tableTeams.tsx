import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, esES } from '@mui/x-data-grid';
import { Solicitud } from '../../services/solicitud.service';
import { ToastContainer } from 'react-toastify';

export interface DataTableProps {
  rows: any[];
  isLoading: boolean;
  load: () => void;
}

export default function DataTable({ rows, isLoading, load }: DataTableProps) {
  const [filterText] = useState('');
  const [filteredRows, setFilteredRows] = useState(rows);

  const getRowId = (row: Solicitud) => row.idSolicitud;

  const columns: GridColDef[] = [
    { field: 'idSolicitud', headerName: 'ID', width: 150, disableColumnMenu: true },
    { field: 'tipoSolicitud', headerName: 'Tipo', width: 160 },
    { field: 'asunto', headerName: 'Asunto', width: 160 },
    { field: 'nombreColaborador', headerName: 'Colaborador', width: 180 },
  ];

  const onRefresh = () => {
    load();
  };

  const applyFilters = () => {
    const filteredData = rows.filter((row) => filterRow(row));
    setFilteredRows(filteredData);
  };

  const filterRow = (row: Solicitud) => {
    return (
      (row.nombreColaborador && row.nombreColaborador.toLowerCase().includes(filterText.toLowerCase())) ||
      (row.estado && row.estado.toLowerCase().includes(filterText.toLowerCase())) ||
      (row.idColaborador && row.idColaborador.toString().includes(filterText)) ||
      (row.idSolicitud && row.idSolicitud.toString().includes(filterText))
    );
  };

  useEffect(() => {
    applyFilters();
  }, [filterText, rows]);



  return (
    <div style={{ height: '60vh', width: '100%' }}>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        loading={isLoading}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        getRowId={getRowId}
        className="custom-data-grid"
        slotProps={{
          toolbar: { onRefresh }
        }}
        style={{
          marginBottom: '16px',
          border: 'none',
          boxShadow: 'none',
        }}
      />
      <ToastContainer />
    </div>
  );
}
