import { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel, esES } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import { AuditoriaLogin } from '../../services/auditoriaLogin.service';
import *  as utils from './utils'; 
import * as  tools from './gridToolBar';
import { ToastContainer } from 'react-toastify';


export interface DataTableProps {
  rows: any[];
  updateAuditoriasLogin: (auditoriasLogin: AuditoriaLogin[]) => void;
}


export default function DataTable(props: DataTableProps) {
  const { rows } = props;
  const [filterText, setFilterText] = useState('');
  const [filteredRows, setFilteredRows] = useState(rows); 
  const [selectedRow ,setSelectedRow] = useState<AuditoriaLogin | null>(null);
  const getRowId = (row: AuditoriaLogin) => row.idAuditoria;
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  selectedRow

  const columns: (GridColDef & { renderCell?: any })[] = [
    { field: 'idAuditoria', headerName: 'ID', width: 60, disableColumnMenu: true },
    { field: 'nombreUsuario', headerName: 'Usuario', width: 120 },
    { field: 'exito', headerName: 'Éxito', width: 60, type: 'boolean' },
    { field: 'fechaLogin', headerName: 'Fecha Login', width: 200, valueGetter: (params) => utils.formatDate(params.value) },
    { field: 'fechaLogout', headerName: 'Fecha Logout', width: 200, valueGetter: (params) => utils.formatDate(params.value) },
    { field: 'direccionIp', headerName: 'Dirección IP', width: 200 },
    { field: 'agenteUsuario', headerName: 'Agente', width: 600 },
  ];


  const applyFilters = () => {
    const filteredData = rows.filter((row) => {
      const formattedDate = utils.formatDate(row.fechaAsetSelectedAuditoriaLogin); 
      return (
        (row.nombreUsuario && row.nombreUsuario.toLowerCase().includes(filterText.toLowerCase())) ||
        (row.fechaLogin && row.fechaLogin.toLowerCase().includes(filterText.toLowerCase())) ||
        (row.fechaLogout && row.fechaLogout.toString().includes(filterText)) ||
        (row.idAuditoria && row.idAuditoria.toString().includes(filterText)) ||
        (formattedDate.toLowerCase().includes(filterText.toLowerCase()))
      );
    });
    setFilteredRows(filteredData);
  };

  useEffect(() => {
    applyFilters();
  },);

  const handleRowClick = (params: { row: AuditoriaLogin }) => {
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
          toolbar: { selectedIds }
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
