import { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel, esES } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import SolicitudService, { Solicitud } from '../../services/solicitud.service';
import *  as utils from './utils'; 
import * as  tools from './gridToolBar';
import Badge from './badge';
import { Box } from '@mui/material';
import EditDialog from './editModal';
import { message } from 'antd';

export interface DataTableProps {
  rows: any[];
  isLoading: boolean;
  load: () => void;
}

export default function DataTable({rows, isLoading, load}: Readonly<DataTableProps>) {

  const [filterText, setFilterText] = useState('');
  const [filteredRows, setFilteredRows] = useState(rows); 
  const getRowId = (row: Solicitud) => row.idSolicitud;
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);


  const columns: GridColDef[] = [
    { field: 'idSolicitud', headerName: 'ID', width: 60, disableColumnMenu: true },
    { field: 'tipoSolicitud', headerName: 'Tipo', width: 100 },
    { field: 'asunto', headerName: 'Asunto', width: 100 },
    { field: 'nombreColaborador', headerName: 'Colaborador', width: 200 },
    { field: 'nombreEncargado', headerName: 'Encargado', width: 180 },
    { field: 'fechaSolicitud', headerName: 'Fecha', width: 100, valueGetter: (params) => utils.formatDate(params.value) },
    { field: 'estado', headerName: 'Estado', width: 150,
      renderCell: (params) => (
          <Box minWidth={100}>
           <Badge estado={params.row.estado}/>
          </Box>
      ),
    },
  ];

  const onEditClick = () => {
    const data = rows.find((solicitud) => solicitud.idSolicitud === selectedIds[0]);
    if (data) {
      setSelectedSolicitud(data);
      setIsModalOpen(true);
    }
  };

  const onRefresh = () => {
    localStorage.removeItem('solicitudesData');
    load();
  }

  const onDeleteClick = async () => {
    const confirmation= await utils.showConfirmation();
    if(confirmation) {
        deleteData();
    }
  };

  const deleteData = async () => {
    const hideLoadingMessage = message.loading('Cargando', 0);
    try {
        const errors = await deleteSolicitudes();
        handleDeleteResponse(errors);
        localStorage.removeItem('solicitudesData');
        load();
    } catch (error) {
        handleError();
    } finally {
        hideLoadingMessage();
    }
  };

  const deleteSolicitudes = async () => {
      const service = new SolicitudService();
      return await service.eliminarSolicitudes(selectedIds);
  };

  const handleDeleteResponse = (errors: number[]) => {
      const deletedIds = selectedIds.filter(id => !errors.includes(id));
      deletedIds.forEach(id => {
          message.success('Solicitud con id: ' + id + ' eliminada.');
      });
      errors.forEach(id => {
          message.error('La solicitud con id: ' + id + ' no se ha podido eliminar');
      });
  };

  const handleError = () => {
    message.error('Ocurrió al eliminar los registros.');
  };

  const applyFilters = () => {
    const filteredData = rows.filter((row) => filterRow(row));
    setFilteredRows(filteredData);
  };

  const filterRow = (row: Solicitud) => {
    const formattedDate = utils.formatDate(row.fechaSolicitud);
    return (
      (row.nombreColaborador?.toLowerCase().includes(filterText.toLowerCase())) ||
      (row.estado?.toLowerCase().includes(filterText.toLowerCase())) ||
      (row.idColaborador?.toString().includes(filterText)) ||
      (row.idSolicitud?.toString().includes(filterText)) ||
      (formattedDate.toLowerCase().includes(filterText.toLowerCase()))
    );
  };

  useEffect(() => {
    applyFilters();
  },[filterText, rows]);



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
        onRowSelectionModelChange={handleSelectionChange}
        slots={{
          toolbar: tools.CustomToolbar
        }}
        slotProps={{
          toolbar: { onRefresh, onEditClick,onDeleteClick, selectedIds }
        }}
        style={{
            marginBottom: '16px',
            border: 'none', 
            boxShadow: 'none',
        }}
      /> 
      <EditDialog open={isModalOpen} solicitud={selectedSolicitud} onClose={() => setIsModalOpen(false)} reload={onRefresh} />
    </div>
  );
}
