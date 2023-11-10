import { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import { Solicitud } from '../../services/solicitud.service';
import *  as utils from './utils'; 
import EditSolicitudModal from './editRequest';
import * as  tools from './gridToolBar';
import { ToastContainer } from 'react-toastify';


export interface DataTableProps {
  rows: any[];
  updateSolicitudes: (solicitudes: Solicitud[]) => void;
}


export default function DataTable(props: DataTableProps) {
  const { rows } = props;
  const [filterText, setFilterText] = useState('');
  const [filteredRows, setFilteredRows] = useState(rows); 
  const [selectedRow ,setSelectedRow] = useState<Solicitud | null>(null);
  const getRowId = (row: Solicitud) => row.idSolicitud;
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
  selectedRow

  const columns: (GridColDef & { renderCell?: any })[] = [
    { field: 'idSolicitud', headerName: 'ID', width: 60, disableColumnMenu: true },
    { field: 'conGoceSalarial', headerName: 'Goce', width: 60, type: 'boolean' },
    { field: 'tipoSolicitud', headerName: 'Tipo', width: 100 },
    { field: 'asunto', headerName: 'Asunto', width: 100 },
    { field: 'nombreColaborador', headerName: 'Colaborador', width: 100 },
    { field: 'nombreEncargado', headerName: 'Encargado', width: 100 },
    { field: 'fechaSolicitud', headerName: 'Fecha', width: 200, valueGetter: (params) => utils.formatDate(params.value) },
    { field: 'estado', headerName: 'Estado', width: 100 },
  ];

  
  const onEditClick = () => {
    const data = rows.find((solicitud) => solicitud.idSolicitud === selectedIds[0]);
    if (data) {
      setSelectedSolicitud(data);
      setIsModalOpen(true);
    }
  };

  const onDeleteClick = async () => {
    const confirmation= await utils.showConfirmation();
    if(confirmation) {
        await utils.dropRequests(selectedIds);
        props.updateSolicitudes(props.rows.filter(solicitud => !selectedIds.includes(solicitud.idSolicitud)));
    }
  };

  const applyFilters = () => {
    const filteredData = rows.filter((row) => {
      const formattedDate = utils.formatDate(row.fechaSolicitud); 
      return (
        (row.nombreColaborador && row.nombreColaborador.toLowerCase().includes(filterText.toLowerCase())) ||
        (row.estado && row.estado.toLowerCase().includes(filterText.toLowerCase())) ||
        (row.idColaborador && row.idColaborador.toString().includes(filterText)) ||
        (row.idSolicitud && row.idSolicitud.toString().includes(filterText)) ||
        (formattedDate.toLowerCase().includes(filterText.toLowerCase()))
      );
    });
    setFilteredRows(filteredData);
  };

  useEffect(() => {
    applyFilters();
  },);

  const handleRowClick = (params: { row: Solicitud }) => {
    setSelectedRow(params.row);
  };

  const handleSelectionChange = (selection: GridRowSelectionModel) => {
    setSelectedIds(selection as number[]);
  };


  return (
    <div style={{ height: 400, width: '85%' }}>
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
        localeText={tools.setToolBartext}
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
          toolbar: { onEditClick,onDeleteClick, selectedIds }
        }}
        style={{
            marginBottom: '16px',
            border: 'none', 
            boxShadow: 'none',
          }}
      /> 
      <EditSolicitudModal open={isModalOpen} solicitud={selectedSolicitud} onClose={() => setIsModalOpen(false)} onSolicitudUpdate={(solicitudId) => {
          props.updateSolicitudes([...props.rows.filter(solicitud => solicitud.idSolicitud !== solicitudId)]);
        }} />
        <ToastContainer/>
    </div>
  );
}
