    import Box from '@mui/material/Box';
    import Typography from '@mui/material/Typography';
    import { GridColDef } from '@mui/x-data-grid';
    import DataTable from './table';
    import { ColabUsuario } from './tabs';

    interface TabPanelProps {
    index: number;
    value: number;
    colabUsuario: ColabUsuario[];
    columns: GridColDef[];
    onDeleteRow: (idsToDelete: number[]) => void;
    onUpdateRow: (idsToUpdate: number) => void;
    }
        function CustomTabPanel(props: TabPanelProps) {
            const { value, index, colabUsuario, columns, onDeleteRow, onUpdateRow } = props;
            return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
            >
                {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>
                    <DataTable
                        columns={columns}
                        rows={colabUsuario} 
                        filterFunction={(rows: ColabUsuario[]) => rows}
                        getRowId={(row: ColabUsuario) => row.idUsuario}
                        onDeleteRow={onDeleteRow}
                        onUpdateRow={onUpdateRow}
                    />
                    
                    </Typography>
                </Box>
                )}
            </div>
            );
        }
        
        export default CustomTabPanel;
        