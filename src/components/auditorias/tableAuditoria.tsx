import { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel, esES } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import { Auditoria } from '../../services/auditoria.service';
import *  as utils from './utils'; 
import * as  tools from './gridToolBar';
import { ToastContainer } from 'react-toastify';
import ShowDetailModal from './showDetail';


export interface DataTableProps {
  rows: any[];
  updateAuditorias: (auditorias: Auditoria[]) => void;
}


export default function DataTable(props: DataTableProps) {
  const { rows } = props;
  const [filterText, setFilterText] = useState('');
  const [filteredRows, setFilteredRows] = useState(rows); 
  const [selectedRow ,setSelectedRow] = useState<Auditoria | null>(null);
  const getRowId = (row: Auditoria) => row.idAuditoria;
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuditoria, setSelectedAuditoria] = useState<Auditoria | null>(null);
  selectedRow

  const columns: (GridColDef & { renderCell?: any })[] = [
    { field: 'idAuditoria', headerName: 'ID', width: 60, disableColumnMenu: true },
    { field: 'nombreUsuario', headerName: 'Usuario', width: 120 },
    { field: 'rol', headerName: 'Rol', width: 100 },
    { field: 'accion', headerName: 'Acción', width: 150 },
    { field: 'nombre', headerName: 'Nombre', width: 170 },
    { field: 'fecha', headerName: 'Fecha', width: 200, valueGetter: (params) => utils.formatDate(params.value) },
    { field: 'direccionIp', headerName: 'Direccion IP', width: 100 },
    { field: 'agenteUsuario', headerName: 'Agente', width: 600 },
  ];

  const onShowDetailClick = () => {
    const data = rows.find((auditoria) => auditoria.idAuditoria === selectedIds[0]);
    if (data) {
      setSelectedAuditoria(data);
      setIsModalOpen(true);
    }
  };

  const applyFilters = () => {
    const filteredData = rows.filter((row) => {
      const formattedDate = utils.formatDate(row.fechaAsetSelectedAuditoriaLogin); 
      return (
        (row.nombreUsuario && row.nombreUsuario.toLowerCase().includes(filterText.toLowerCase())) ||
        (row.accion && row.accion.toLowerCase().includes(filterText.toLowerCase())) ||
        (row.nombre && row.nombre.toLowerCase().includes(filterText.toLowerCase())) ||
        (row.idAuditoria && row.idAuditoria.toString().includes(filterText)) ||
        (formattedDate.toLowerCase().includes(filterText.toLowerCase()))
      );
    });
    setFilteredRows(filteredData);
  };

  useEffect(() => {
    applyFilters();
  },);

  const handleRowClick = (params: { row: Auditoria}) => {
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
          toolbar: { onShowDetailClick, selectedIds }
        }}
        style={{
            marginBottom: '16px',
            border: 'none', 
            boxShadow: 'none',
          }}
      /> 
       <ShowDetailModal open={isModalOpen} auditoria={selectedAuditoria} onClose={() => setIsModalOpen(false)}></ShowDetailModal>
       <ToastContainer></ToastContainer>
    </div>
  );
}
