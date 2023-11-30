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
    }
        function CustomTabPanel(props: TabPanelProps) {
            const { value, index, colabUsuario, columns, onDeleteRow } = props;
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
                    />
                    
                    </Typography>
                </Box>
                )}
            </div>
            );
        }
        
        export default CustomTabPanel;
        