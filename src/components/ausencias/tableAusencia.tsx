import { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import { Ausencia } from '../../services/ausencia.service';
import *  as utils from './utils'; 
import * as  tools from './gridToolBar';


export interface DataTableProps {
  rows: any[];
  updateAusencias: (Ausencias: Ausencia[]) => void;
}


export default function DataTable(props: DataTableProps) {
  const { rows } = props;
  const [filterText, setFilterText] = useState('');
  const [filteredRows, setFilteredRows] = useState(rows); 
  const [selectedRow ,setSelectedRow] = useState<Ausencia | null>(null);
  const getRowId = (row: Ausencia) => row.idAusencia;
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  selectedRow

  const columns: (GridColDef & { renderCell?: any })[] = [
    { field: 'idAusencias', headerName: 'ID', width: 60, disableColumnMenu: true },
    { field: 'fechaAusencia', headerName: 'Fecha', width: 200, valueGetter: (params) => utils.formatDate(params.value) },
    { field: 'fechaFin', headerName: 'Fecha', width: 200, valueGetter: (params) => utils.formatDate(params.value) },
    { field: 'razon', headerName: 'Asunto', width: 100 },
    { field: 'nombreColaborador', headerName: 'Colaborador', width: 100 },
  ];

  const onDeleteClick = async () => {
    const confirmation= await utils.showConfirmation();
    if(confirmation) {
        await utils.dropRequests(selectedIds);
        props.updateAusencias(props.rows.filter(ausencia => !selectedIds.includes(ausencia.idAusencia)));
    }
  };

  const applyFilters = () => {
    const filteredData = rows.filter((row) => {
      const formattedDate = utils.formatDate(row.fechaAusencia); 
      return (
        (row.nombreColaborador && row.nombreColaborador.toLowerCase().includes(filterText.toLowerCase())) ||
        (row.razon && row.razon.toLowerCase().includes(filterText.toLowerCase())) ||
        (row.idColaborador && row.idColaborador.toString().includes(filterText)) ||
        (row.idAusencia && row.idAusencia.toString().includes(filterText)) ||
        (formattedDate.toLowerCase().includes(filterText.toLowerCase()))
      );
    });
    setFilteredRows(filteredData);
  };

  useEffect(() => {
    applyFilters();
  },);

  const handleRowClick = (params: { row: Ausencia }) => {
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
          toolbar: {onDeleteClick, selectedIds }
        }}
        style={{
            marginBottom: '16px',
            border: 'none', 
            boxShadow: 'none',
          }}
      /> 
    </div>
  );
}
