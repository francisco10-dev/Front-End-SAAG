import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import DataTable from './table';
import { ColabUsuario } from './tabs';
import { GridColDef } from '@mui/x-data-grid';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import ReplayIcon from '@mui/icons-material/Replay';
import AddIcon from '@mui/icons-material/Add';
import AgregarUsuarioModal from './AgregarUsuarioModal'; 
import { message } from 'antd';
import Swal from 'sweetalert2';

interface TabPanelProps {
    value: number;
    index: number;
    colabUsuario: ColabUsuario[];
    columns: GridColDef[];
    onDeleteRow: (idsToDelete: number[]) => Promise<void>;
    onUpdateRow: (idToUpdate: number) => void;
    onUpdatePasswordRow: (idUsuario: number) => Promise<void>;
    onRefresh: () => Promise<void>;
    loading: boolean;
}

function CustomTabPanel(props: TabPanelProps) {
    const { value, index, colabUsuario, columns, onDeleteRow, onUpdateRow, onUpdatePasswordRow, onRefresh, loading } = props;
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [isAgregarModalOpen, setAgregarModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleDeleteSelected = async () => {
        const confirmation = await Swal.fire({
            title: '¿Está seguro?',
            text: 'Esta acción no se puede deshacer',
            showDenyButton: true,
            confirmButtonText: 'Confirmar',
            denyButtonText: 'Cancelar',
            icon: 'warning',
        });
        if (confirmation.isConfirmed) {
            await confirmDelete();
        }
    };

    const confirmDelete = async () => {
        const hideLoadingMessage = message.loading('Esperando', 0);
        try {
            await onDeleteRow(selectedRowIds);
        } catch (error) {
        } finally {
            hideLoadingMessage();
            setDeleteModalOpen(false);
            setSelectedRowIds([]);
        }
    };

    const cancelDelete = () => {
        setDeleteModalOpen(false);
        message.error('Eliminación cancelada por el usuario');
    };

    const handleUpdateSelected = () => {
        if (selectedRowIds.length === 1) {
            onUpdateRow(selectedRowIds[0]);
            setSelectedRowIds([]);
        }
    };

    const handleUpdatePasswordSelected = async () => {
        if (selectedRowIds.length === 1) {
          await onUpdatePasswordRow(selectedRowIds[0]);
          setSelectedRowIds([]);
        }
      };

    const handleRefresh = async () => {
        try {
            await onRefresh();
            message.success('Usuarios actualizados');
        } catch (error) {
            message.error('Error al actualizar usuarios: ' + error);
        }
    };

    const handleAdd = () => {
        setAgregarModalOpen(true);
    };

    const handleAgregarModalClose = () => {
        setAgregarModalOpen(false);
        handleRefresh();
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
                            loading={loading}
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
                        </Button>
                        <Button
                            variant="text"
                            onClick={handleUpdatePasswordSelected}
                            disabled={selectedRowIds.length !== 1}
                            startIcon={<SettingsIcon />}
                        >
                        </Button>
                    </Box>
                    <Modal
                        open={isDeleteModalOpen}
                        onClose={cancelDelete}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 400 }}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Confirmar eliminación
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                ¿Estás seguro de que quieres eliminar {selectedRowIds.length} usuario(s)?
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                <Button onClick={confirmDelete} variant="contained" color="primary">
                                    Eliminar
                                </Button>
                                <Button onClick={cancelDelete} variant="contained" color="error">
                                    Cancelar
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
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
