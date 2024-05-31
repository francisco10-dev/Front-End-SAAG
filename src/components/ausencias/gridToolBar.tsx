import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExport } from '@mui/x-data-grid';

export function CustomToolbar({}: { onRefresh: () => void, selectedIds: string[] }) {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
}

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