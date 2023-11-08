import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExport } from '@mui/x-data-grid';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { Button } from '@mui/material';

export function CustomToolbar({onEditClick, onDeleteClick, selectedIds }: { onRefresh : () => void ,onEditClick: () => void, onDeleteClick: () => void; selectedIds: string[] }) {
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
      </GridToolbarContainer>
    );
}

//traducir el texto de las herramientas a español
export const setToolBartext = {
    toolbarColumns: 'Columnas',
    toolbarFilters: 'Filtros',
    toolbarDensity: 'Densidad',
    toolbarDensityLabel: 'Densidad de filas',
    toolbarDensityCompact: 'Compacta',
    toolbarDensityStandard: 'Estándar',
    toolbarDensityComfortable: 'Cómoda',
    toolbarExport: 'Exportar',
    toolbarExportCSV: 'Descargar a CSV',
    toolbarExportPrint: 'Imprimir a PDF',
    toolbarFilterList: 'Lista de filtros',
    toolbarFilter: 'Filtrar',
    toolbarFilterAnd: 'Y',
    toolbarFilterOr: 'O',
    toolbarFilterEmpty: 'Sin filtro',
    filterPanelAddFilter: 'Agregar filtro',
    filterPanelDeleteIcon: 'Eliminar filtro',
    filterOperatorContains: 'Contiene',
    filterOperatorStartsWith: 'Comienza con',
    filterOperatorEndsWith: 'Termina con',
    filterOperatorEquals: 'Igual a',
    filterOperatorIsAnyOf: 'Es alguno de',
    filterOperatorIsEmpty: 'Está vacío',
    filterOperatorIsNotEmpty: 'No está vacío',
};