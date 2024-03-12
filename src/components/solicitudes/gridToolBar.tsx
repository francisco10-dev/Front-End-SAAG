import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExport } from '@mui/x-data-grid';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { Button } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';


export function CustomToolbar({onEditClick, onDeleteClick, selectedIds, onRefresh }: { onRefresh : () => void ,onEditClick: () => void, onDeleteClick: () => void; selectedIds: string[] }) {
    const DeleteButtonDisabled = selectedIds.length === 0;
    const EditButtonDisabled = selectedIds.length !== 1;
  
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <Button
            variant="text"
            onClick={onEditClick}
            disabled={EditButtonDisabled}
            startIcon={<EditNoteOutlinedIcon />}
        >
            GESTIONAR
        </Button>
        <Button
          variant="text"
          onClick={onDeleteClick}
          disabled={DeleteButtonDisabled}
          startIcon={<DeleteOutlinedIcon />}
          color='error'
        >
          ELIMINAR
        </Button>
        <Button
          variant="text"
          onClick={onRefresh}
          startIcon={<ReplayIcon />}
        >
        </Button>
      </GridToolbarContainer>
    );
}
