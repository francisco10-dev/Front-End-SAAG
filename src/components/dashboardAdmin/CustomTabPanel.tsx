import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DataTable from './table';
import { ColabUsuario } from './tabs';
import { GridColDef } from '@mui/x-data-grid';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import ReplayIcon from '@mui/icons-material/Replay';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import AgregarUsuarioModal from './AgregarUsuarioModal'; 

interface TabPanelProps {
    value: number;
    index: number;
    colabUsuario: ColabUsuario[];
    columns: GridColDef[];
    onDeleteRow: (idsToDelete: number[]) => void;
    onUpdateRow: (idToUpdate: number) => void;
    onRefresh: () => void;
}

function CustomTabPanel(props: TabPanelProps) {
    const { value, index, colabUsuario, columns, onDeleteRow, onUpdateRow, onRefresh } = props;
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [isAgregarModalOpen, setAgregarModalOpen] = useState(false);


    const handleDeleteSelected = async () => {
        const cantidadRegistros = selectedRowIds.length;
        const confirmMessage = `¿Estás seguro de que quieres eliminar ${cantidadRegistros} usuario(s)?`;
        const userConfirmed = window.confirm(confirmMessage);
        if (userConfirmed) {
            try {
                await Promise.all(selectedRowIds.map(async (idToDelete) => {
                    await onDeleteRow([idToDelete]);
                }));
                toast.success(`Se han eliminado ${cantidadRegistros} usuarios`);
                // obtenerYActualizarUsuarios(); // No está definido en este contexto
            } catch (error) {
                toast.error('Error al eliminar usuarios: ' + error);
            }
        } else {
            toast.error('Eliminación cancelada por el usuario');
        }
        setSelectedRowIds([]);
    };


    // Dentro de CustomTabPanel
    const handleUpdateSelected = () => {
        if (selectedRowIds.length === 1) {
            onUpdateRow(selectedRowIds[0]);
            setSelectedRowIds([]);
        }
    };


    const handleRefresh = async () => {
        try {
            await onRefresh(); // Llama a la función de actualización proporcionada desde TabsUsuarioAdmin
            toast.success('Usuarios actualizados');
        } catch (error) {
            toast.error('Error al actualizar usuarios: ' + error);
        }
    };

    const handleAdd = () => {
        setAgregarModalOpen(true);
    };

    const handleAgregarModalClose = () => {
        setAgregarModalOpen(false);
        handleRefresh(); // Actualiza la lista de usuarios después de agregar uno nuevo
    };

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
        >
            {value === index && (
                <Box sx={{ position: 'relative', p: 3 }}>
                    <Typography>
                        <DataTable
                            columns={columns}
                            rows={colabUsuario}
                            filterFunction={(rows: ColabUsuario[]) => rows}
                            getRowId={(row: ColabUsuario) => row.idUsuario}
                            onDeleteRow={onDeleteRow}
                            onUpdateRow={onUpdateRow}
                            onSelectionModelChange={(selectionModel) => setSelectedRowIds(selectionModel)}
                        />
                    </Typography>
                    <Box sx={{ position: 'absolute', top: 0, right: 0, display: 'flex', gap: 1 }}>
                        <Button
                            variant="text"
                            onClick={handleAdd}
                            startIcon={<AddIcon />}
                        >
                            Agregar
                        </Button>
                        <Button
                            variant="text"
                            onClick={handleUpdateSelected}
                            disabled={selectedRowIds.length !== 1}
                            startIcon={<EditNoteOutlinedIcon />}
                        >
                            GESTIONAR
                        </Button>
                        <Button
                            variant="text"
                            onClick={handleDeleteSelected}
                            disabled={selectedRowIds.length === 0}
                            startIcon={<DeleteOutlinedIcon />}
                            color="error"
                        >
                            ELIMINAR
                        </Button>
                        <Button
                            variant="text"
                            onClick={handleRefresh}
                            startIcon={<ReplayIcon />}
                        >
                            Refresh
                        </Button>
                    </Box>
                </Box>
            )}
            <AgregarUsuarioModal
                visible={isAgregarModalOpen}
                setVisible={setAgregarModalOpen}
                onAgregar={handleAgregarModalClose} 
            />
        </div>
    );
}

export default CustomTabPanel;

