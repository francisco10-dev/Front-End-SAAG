import  Box  from "@mui/material/Box"
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import { formatDate } from "../../solicitudes/utils";
import { DataGrid, GridColDef, esES, GridRowSelectionModel } from '@mui/x-data-grid';
import Formulario from "../createExpediente";
import { CustomToolbar } from "./gridToolBar";
import ColaboradorService, { Colaborador } from "../../../services/colaborador.service";

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
    selected: (nuevoValor : number | null) => void;
    selectedExpediente: (nuevo : Colaborador | null) => void;
}

const List = ({selected, selectedExpediente}: Props) => {

    const [filterText, setFilterText] = useState('');
    const [expedientes, setExpedientes] = useState<Colaborador[]>([]);
    const [filteredRows, setFilteredRows] = useState(expedientes);
    const [isLoading, setLoading] = useState(false);
    const service = new ColaboradorService();
    const getRowId = (row: Colaborador) => row.idColaborador;
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [openForm, setOpenForm] = useState(false);

    const fetchExpedientes =  async () => {
        try {
            setLoading(true);
            const data = await service.obtenerColaboradores();
            setExpedientes(data);
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    const applyFilters = () => {
        const filteredData = expedientes.filter((row) => {
          return (
            (row.idColaborador && row.idColaborador.toString().includes(filterText.toLowerCase())) ||
            (row.identificacion && row.identificacion.toString().includes(filterText)) ||
            (row.nombre && row.nombre.toLowerCase().includes(filterText.toLowerCase())) ||
            (row.fechaIngreso && row.fechaIngreso.toLocaleLowerCase().includes(filterText.toLowerCase()))
          );
        });
        setFilteredRows(filteredData);
    };

    const handleRowClick = (params: { row: Colaborador}) => {
        selected(params.row.idColaborador);
    };

    const handleSelectionChange = (selection: GridRowSelectionModel) => {
        setSelectedIds(selection as number[]);
    };

    const onEditClick = () => {
        const data = expedientes.find((expediente) => expediente.idColaborador === selectedIds[0]);
        if (data) {
            selectedExpediente(data);
        }
    };

    const onViewClick = () => {
        console.log(selectedIds);
        setOpenForm(true);
    }
    
    const closeForm = (value: boolean) => {
        setOpenForm(value);
    }

    useEffect(() => {
        fetchExpedientes();
    }, [])

    useEffect(() => {
        applyFilters();
    }, [filteredRows, expedientes]);

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
                   <Formulario openForm={openForm} setOpenForm={closeForm} reload={fetchExpedientes}/> 
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
                toolbar: { onEditClick,onViewClick, selectedIds }
            }}
            sx={{ border: 'none', height: '81%'}}
            onRowSelectionModelChange={handleSelectionChange}
            getRowId={getRowId}
            pageSizeOptions={[5, 10, 15, 30, 50, 100]}
            onRowClick={handleRowClick}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText} 
            loading={isLoading}
            //checkboxSelection
          />
        </div>
      );
}

export default List;


