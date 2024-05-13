import { GridToolbarContainer, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay'

export function CustomToolbar({onEditClick, onViewClick, selectedIds, onRefresh }: 
  Readonly<{ onRefresh : () => void ,onEditClick: () => void, onViewClick: () => void; selectedIds: string[] }>) {
    
    const EditButtonDisabled = selectedIds.length !== 1;
  
    return (
      <GridToolbarContainer>
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <Button
            variant="text"
            onClick={onEditClick}
            disabled={EditButtonDisabled}
            startIcon={<VisibilityOutlinedIcon />}
        >
            Ver
        </Button>
        <Button
            variant="text"
            onClick={onViewClick}
            startIcon={<AddIcon />}
        >
            Nuevo
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
