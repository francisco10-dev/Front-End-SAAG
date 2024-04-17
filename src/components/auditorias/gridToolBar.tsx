import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExport } from '@mui/x-data-grid';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { Button } from '@mui/material';

export function CustomToolbar({onShowDetailClick,selectedIds }: { onRefresh : () => void ,onShowDetailClick: () => void,selectedIds: string[] }) {
    const ShowButtonDisabled = selectedIds.length !== 1;
  
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <Button
            variant="text"
            onClick={onShowDetailClick}
            disabled={ShowButtonDisabled}
            startIcon={<EditNoteOutlinedIcon />}
        >
            Ver Detalle
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