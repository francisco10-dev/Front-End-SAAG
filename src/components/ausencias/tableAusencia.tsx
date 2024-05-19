import { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel, esES } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import { Solicitud } from '../../services/solicitud.service';
import *  as utils from './utils'; 
import * as  tools from './gridToolBar';
import { ToastContainer } from 'react-toastify';

export interface DataTableProps {
  rows: any[];
  isLoading: boolean;
  load: () => void;
}
export default function DataTable({rows,isLoading,}: DataTableProps) {

  const [filterText, setFilterText] = useState('');
  const [filteredRows, setFilteredRows] = useState(rows); 
  const [selectedRow ,setSelectedRow] = useState<Solicitud | null>(null);
  const getRowId = (row: Solicitud) => row.idSolicitud;
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  selectedRow

  const columns: GridColDef[] = [
    { field: 'idSolicitud', headerName: 'ID', width: 60, disableColumnMenu: true },
    { field: 'tipoSolicitud', headerName: 'Tipo', width: 100 },
    { field: 'fechaSolicitud', headerName: 'Fecha De Solicitud', width: 145, valueGetter: (params) => utils.formatDate(params.value) },
    { field: 'fechaInicio', headerName: 'Fecha De Inicio', width: 125, valueGetter: (params) => utils.formatDate(params.value) },
    { field: 'fechaFin', headerName: 'Fecha De Fin', width: 115, valueGetter: (params) => utils.formatDate(params.value) },
    {field: 'horaInicio', headerName: 'Hora De Inicio', width: 115, },
    {field: 'horaFin', headerName: 'Hora De fin', width: 115,},
    { field: 'nombreColaborador', headerName: 'Colaborador', width: 115 },
  ];
  
  const applyFilters = () => {
    const filteredData = rows.filter((row) => filterRow(row));
    setFilteredRows(filteredData);
  };

  const filterRow = (row: Solicitud) => {
    const formattedDate = utils.formatDate(row.fechaSolicitud);
    return (
      (row.nombreColaborador && row.nombreColaborador.toLowerCase().includes(filterText.toLowerCase())) ||
      (row.estado && row.estado.toLowerCase().includes(filterText.toLowerCase())) ||
      (row.idColaborador && row.idColaborador.toString().includes(filterText)) ||
      (row.idSolicitud && row.idSolicitud.toString().includes(filterText)) ||
      (formattedDate.toLowerCase().includes(filterText.toLowerCase()))
    );
  };

  useEffect(() => {
    applyFilters();
  },[filterText, rows]);

  const handleRowClick = (params: { row: Solicitud }) => {
    setSelectedRow(params.row);
  };

  const handleSelectionChange = (selection: GridRowSelectionModel) => {
    setSelectedIds(selection as number[]);
  };


  return (
    <div style={{ height: '60vh', width: '100%' }}>
     <TextField 
        label="Buscar..."
        variant="standard"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{ marginBottom: '25px', marginRight: '50%'}}
      />
      <DataGrid
        rows={filteredRows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 50 },
          },
        }}
        loading={isLoading}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        getRowId={getRowId}
        pageSizeOptions={[5, 10, 20, 30, 50]}
        checkboxSelection
        className="custom-data-grid"
        onRowClick={handleRowClick}
        onRowSelectionModelChange={handleSelectionChange}
        slots={{
          toolbar: tools.CustomToolbar
        }}
        slotProps={{
          toolbar: {selectedIds }
        }}
        style={{
            marginBottom: '16px',
            border: 'none', 
            boxShadow: 'none',
        }}
      /> 
        <ToastContainer/>
    </div>
  );
}
