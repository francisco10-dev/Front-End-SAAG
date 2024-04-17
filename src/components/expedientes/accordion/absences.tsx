import {useState, useEffect} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box  from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import AusenciaService, { Ausencia } from '../../../services/ausencia.service';
import { TextField, Typography } from '@mui/material';
import { formatDate } from '../../solicitudes/utils';

interface Props{
    readonly id: number;
}

export default function Absences({id}: Props) {

    const [idColaborador, setIdColaborador] = useState(id);
    const [absences, setAbsences] = useState<Ausencia[]>([]);
    const [filteredRows, setFilteredRows] = useState(absences); 
    const [filterText, setFilterText] = useState('');

    const loadData = async ()=> {
        try {
            const service = new AusenciaService();
            const response = await service.AusenciasPorColaborador(idColaborador);
            setAbsences(response);
        } catch (error) {
            console.log(error);
            setAbsences([]);
        }
    }

    
    const handleInputChange = (value: string) => {
        setFilterText(value);
    }

    const applyFilters = () => {
        const filteredData = absences.filter((row) => filterRow(row));
        setFilteredRows(filteredData);
      };
    
      const filterRow = (row: Ausencia) => {
        const formattedDate = formatDate(row.fechaAusencia);
        const formattedDate2 = formatDate(row.fechaFin);
        return (
            (row.nombreColaborador?.toLowerCase().includes(filterText.toLowerCase())) ||
            (row.razon?.toLowerCase().includes(filterText.toLowerCase())) ||
            (row.idAusencia?.toString().includes(filterText)) ||
            (formattedDate?.toLowerCase().includes(filterText.toLowerCase())) ||
            (formattedDate2?.toLowerCase().includes(filterText.toLowerCase()))
        );
      };
    
      useEffect(() => {
        applyFilters();
      },[filterText, absences]);

    useEffect(()=> {
        setIdColaborador(id);
    },[id]);

    useEffect(()=> {
        loadData();
    },[idColaborador]);

  return (
    <Box>
        <Box ml={2}>
            <TextField
                id="outlined-basic" 
                label="Buscar" 
                variant="standard" 
                sx={{marginBottom: 5,  marginRight: 2}}
                value={filterText}
                onChange={(e) => handleInputChange(e.target.value)}
            />
        </Box>
        <Box>
            {filteredRows.length > 0 ? (
                <TableContainer component={Paper} sx={{maxHeight: 400}}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell align='center'>N# Ausencia</TableCell>
                        <TableCell>Fecha Ausencia</TableCell>
                        <TableCell>Fecha Fin</TableCell>
                        <TableCell>Razón</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {filteredRows.map((row) => (
                        <TableRow
                        key={row.idAusencia}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row" align='center'>
                            {row.idAusencia}
                        </TableCell>
                        <TableCell>{formatDate(row.fechaAusencia)}</TableCell>
                        <TableCell>{ row.fechaFin? formatDate(row.fechaFin) : 'No indica'}</TableCell>
                        <TableCell>{row.razon? row.razon : 'No indica'}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
            ) : (
                <Box>
                    <Typography variant='body2' sx={{textAlign: 'center', padding: 3}}>No hay ausencias registradas</Typography>
            </Box>
            )}
        </Box>
    </Box>
  );    
}
