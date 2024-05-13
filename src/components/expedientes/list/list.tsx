import  Box  from "@mui/material/Box"
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import { formatDate } from "../../solicitudes/utils";
import { DataGrid, GridColDef, esES, GridRowSelectionModel } from '@mui/x-data-grid';
import Formulario from "../create/createExpediente";
import { CustomToolbar } from "./gridToolBar";
import ColaboradorService, { Colaborador } from "../../../services/colaborador.service";
import FullScreenDialog from "../fullDialog";

const columns: GridColDef[] = [
    { field: 'idColaborador', headerName: 'N# Registro', width: 110 },
    { field: 'colaborador', headerName: 'Colaborador', sortable: false, width: 200,
      renderCell: (params) => (
        <div>
          <strong>{params.row.nombre}</strong>
          <br />
          Identificación: {params.row.identificacion}
        </div>
      ),
    }, { field: 'fechaIngreso', headerName: 'Ingreso', width: 110,
        renderCell: (params) => (
            <div>
                {formatDate(params.row.fechaIngreso)}
            </div>
        ),
    },
];

interface Props{
    selectedPreviewInfo: (nuevo: Colaborador | null) => void;
    loading: (value: boolean) => void;
}

const List = ({selectedPreviewInfo, loading}: Props) => {

    const [filterText, setFilterText] = useState('');
    const [expedientes, setExpedientes] = useState<Colaborador[]>([]);
    const [filteredRows, setFilteredRows] = useState(expedientes);
    const [isLoading, setIsLoading] = useState(false);
    const service = new ColaboradorService();
    const getRowId = (row: Colaborador) => row.idColaborador;
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [openForm, setOpenForm] = useState(false);
    const [selectedExp, setSelectedExp] = useState<Colaborador | null>(null);
    const [openExp, setOpenExp] = useState(false);
    
    const fetchExpedientes = async () => {
        try {
            setIsLoading(true);
            loading(true);
            const data = await service.obtenerColaboradores();
            setExpedientes(data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
            loading(false);
        }
    }

    const clearLocalStorageByPrefix = () => {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('imgUrl')) {
                localStorage.removeItem(key);
            }
        }
    };

    const onRefresh = async () => {
        localStorage.removeItem('expedientesData');
        clearLocalStorageByPrefix();
        fetchExpedientes();
    }

    const updatePreviewInfo = () => {
        if(selectedExp){
            const selected = selectedExp.idColaborador;
            selectedPreviewInfo(null);
            const updateSelectedExp = expedientes.find((exp) => selected === exp.idColaborador);
            selectedPreviewInfo(updateSelectedExp!);            
        }
    }

    const applyFilters = () => {
        const filteredData = expedientes.filter((row) => {
            const formattedDate = formatDate(row.fechaIngreso);
          return (
            (row.idColaborador?.toString().includes(filterText.toLowerCase())) ||
            (row.identificacion?.toString().includes(filterText)) ||
            (row.nombre?.toLowerCase().includes(filterText.toLowerCase())) ||
            (formattedDate?.toLocaleLowerCase().includes(filterText.toLowerCase()))
          );
        });
        setFilteredRows(filteredData);
    };

    const handleRowClick = (params: { row: Colaborador}) => {
        selectedPreviewInfo(params.row);
        setSelectedExp(params.row);
    };

    const handleSelectionChange = (selection: GridRowSelectionModel) => {
        setSelectedIds(selection as number[]);
    };

    const onEditClick = () => {
        setOpenExp(true);
    };

    const onViewClick = () => {
        setOpenForm(true);
    };
    
    const closeForm = (value: boolean) => {
        setOpenForm(value);
    };

    useEffect(() => {
        fetchExpedientes();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filteredRows, expedientes]);

    useEffect(()=> {
        updatePreviewInfo();
        if(selectedExp === null){
            if(expedientes.length > 0){
                selectedPreviewInfo(expedientes[0]);
                setSelectedExp(expedientes[0]);
                setSelectedIds([1]);
            }
        }
    },[expedientes]);


    return (
        <div className="box-data-grid">
            <Box display='' width={550}>
                <TextField 
                    id="outlined-basic" 
                    label="Buscar" 
                    variant="standard" 
                    sx={{marginBottom: 5,  marginRight: 2}}
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />
                <Box>
                   <Formulario openForm={openForm} setOpenForm={closeForm} reload={onRefresh}/> 
                </Box>
            </Box>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 15 },
              },
            }}
            slots={{
                toolbar: CustomToolbar
            }}
            slotProps={{
                toolbar: { onEditClick,onViewClick, selectedIds, onRefresh }
            }}
            sx={{ border: 'none', height: '81%'}}
            onRowSelectionModelChange={handleSelectionChange}
            getRowId={getRowId}
            pageSizeOptions={[5, 10, 15, 30, 50, 100]}
            onRowClick={handleRowClick}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText} 
            loading={isLoading}
          />
          <FullScreenDialog colaboradores={expedientes} colaborador={selectedExp} open={openExp} onClose={()=> setOpenExp(false)} reload={onRefresh} />
        </div>
      );
}

export default List;


