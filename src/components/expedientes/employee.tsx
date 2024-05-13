import ColaboradorService, { Colaborador } from '../../services/colaborador.service';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { CircularProgress, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';

const columns: GridColDef[] = [
  {
    field: 'nombre',
    headerName: 'Nombre de empleado',
    width: 320,
    editable: false,
    renderCell: (params) => (
        <div style={{cursor: 'pointer'}}>
          <strong>{params.row.nombre}</strong>
          <br />
          ID: {params.row.idColaborador}
        </div>
      ),
  },
];

const service = new ColaboradorService();

interface Props {
  handleOpen: () => void;
  handleSelected: () => void;
  selected: (nuevaVariable: number | null) => void;
}

export default function EmployeeList({ handleOpen, handleSelected, selected }: Readonly<Props>) {

    const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [filteredRows, setFilteredRows] = useState(colaboradores); 
    const getRowId = (row: Colaborador) => row.idColaborador;

    const fetchEmployees = async () => {
        try {
          setIsLoading(true);
          const response = await service.obtenerColaboradores();
          setColaboradores(response);
        } catch (e) {
          console.error('Ocurrió un error al obtener los colaboradores:', e);
        } finally {
          setIsLoading(false);
        }
    };
      
    useEffect(() => {
        fetchEmployees();
    }, []);
      
    useEffect(() => {
        applyFilters();
    }, [filterText, colaboradores]);
      

    const handleRowClick = (params: { row: Colaborador }) => {
      handleSelected();
      selected(params.row.idColaborador);
    };

    const applyFilters = () => {
        const filteredData = colaboradores.filter((row) => {
          return (
            (row.nombre?.toLowerCase().includes(filterText.toLowerCase())) ||
            (row.idColaborador?.toString().includes(filterText)) 
          );
        });
        setFilteredRows(filteredData);
    };
    
  return (
    <Box sx={{ height: 550, width: '25%', position: 'fixed' }}>
      {isLoading? <div style={{ display: 'flex', position: 'absolute', top: '50%', left: '50%' }}> <h6>Cargando información...</h6><CircularProgress  /> </div>: 
        <div>
          <Box sx={{display: 'flex', gap: 1}} >
            <TextField 
                id="outlined-basic" 
                label="Buscar empleado" 
                variant="outlined" 
                sx={{marginBottom: 1, width: 250}}
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
            />
            <Button onClick={handleOpen} variant="contained" sx={{width: 40, height: 54}}> <AddIcon sx={{width: 20}}/></Button>
          </Box>
            <DataGrid
                sx={{height: 445}}
                rows={filteredRows}
                columns={columns}
                initialState={{
                pagination: {
                    paginationModel: {
                    pageSize: 10,
                    },
                },
                }}
                pageSizeOptions={[10]}
                getRowId={getRowId}
                disableRowSelectionOnClick
                disableColumnMenu
                onRowClick={handleRowClick}
            />
        </div>
        }
    </Box>
  );
}
