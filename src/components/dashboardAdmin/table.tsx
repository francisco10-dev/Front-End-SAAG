import { useEffect, useState } from 'react';
import { DataGrid, GridColDef, esES } from '@mui/x-data-grid';
import { ColabUsuario } from './tabs';

interface DataTableProps {
    columns: GridColDef[];
    rows: ColabUsuario[];
    filterFunction: (rows: ColabUsuario[], filterText: string) => ColabUsuario[];
    getRowId: (row: ColabUsuario) => any;
    onDeleteRow: (idsToDelete: number[]) => void;
    onUpdateRow: (idsToUpdate: number) => void;
    onSelectionModelChange: (newSelection: number[]) => void;
    loading: boolean;
}

export default function DataTable(props: DataTableProps) {
    const { columns, rows, filterFunction, getRowId, onSelectionModelChange, loading } = props;
    const [filteredRows, setFilteredRows] = useState(rows);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const applyFilters = () => setFilteredRows(filterFunction(rows, ''));

    useEffect(() => {
        applyFilters();
    }, [rows, filterFunction]);

    const handleSelectionModelChange = (selectionModel: any) => {
        setSelectedRows(selectionModel);
        onSelectionModelChange(selectionModel); // Aquí enviamos los IDs de las filas seleccionadas al padre
    };

    return (
        <div style={{ height: 370, width: '100%' }}>
            <DataGrid
                rows={filteredRows}
                columns={columns}
                checkboxSelection
                loading={loading}
                rowSelectionModel={selectedRows} // Esto asegura que las filas seleccionadas estén marcadas en la tabla
                onRowSelectionModelChange={handleSelectionModelChange}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                getRowId={getRowId}
                pageSizeOptions={[5, 10]}
                style={{
                    marginBottom: '20px',
                    border: 'none',
                    boxShadow: 'none',
                    fontSize: '20px',
                    fontFamily: 'GOTHAM Medium',
                }}
            />
        </div>
    );
}
