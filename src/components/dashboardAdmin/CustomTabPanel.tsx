    import Box from '@mui/material/Box';
    import Typography from '@mui/material/Typography';
    import { GridColDef } from '@mui/x-data-grid';
    import DataTable from './table';
    import { Usuario } from '../../services/usuario.service';

    interface TabPanelProps {
    index: number;
    value: number;
    usuarios: Usuario[];
    columns: GridColDef[];
    onDeleteRow: (idsToDelete: number[]) => void;
    }

        function CustomTabPanel(props: TabPanelProps) {
            const { value, index, usuarios, columns, onDeleteRow } = props;
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
                        rows={usuarios} 
                        filterFunction={(rows: Usuario[]) => rows}
                        getRowId={(row: Usuario) => row.idUsuario}
                        onDeleteRow={onDeleteRow}
                    />
                    
                    </Typography>
                </Box>
                )}
            </div>
            );
        }
        
        export default CustomTabPanel;
        