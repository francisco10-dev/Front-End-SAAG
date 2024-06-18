import {useState, useEffect} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box  from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { TextField, Typography, Alert } from '@mui/material';
import { formatDate } from '../../solicitudes/utils';
import { Solicitud } from '../../../services/solicitud.service';

interface Props{
    data: Solicitud[];
    loading: boolean;
}

export default function Absences({data, loading}: Props) {

    const [absences, setAbsences] = useState<Solicitud[]>(data);
    const [filteredRows, setFilteredRows] = useState(absences); 
    const [filterText, setFilterText] = useState('');
    
    const handleInputChange = (value: string) => {
        setFilterText(value);
    }

    const applyFilters = () => {
        const filteredData = absences.filter((row) => filterRow(row));
        setFilteredRows(filteredData);
      };
    
      const filterRow = (row: Solicitud) => {
        const fechaSolicitud = formatDate(row.fechaSolicitud);
        const fechaInicio = formatDate(row.fechaInicio!);
        const fechaFin = formatDate(row.fechaInicio!);

        return (
            (row.nombreColaborador?.toLowerCase().includes(filterText.toLowerCase())) ||
            (row.asunto?.toLowerCase().includes(filterText.toLowerCase())) ||
            (row.tipoSolicitud?.toLowerCase().includes(filterText.toLowerCase())) ||
            (row.idSolicitud?.toString().includes(filterText)) ||
            (row.horaInicio?.toLowerCase().includes(filterText.toLowerCase())) ||
            (row.horaFin?.toLowerCase().includes(filterText.toLowerCase())) ||
            (fechaSolicitud?.toLowerCase().includes(filterText.toLowerCase())) ||
            (fechaInicio?.toLowerCase().includes(filterText.toLowerCase())) ||
            (fechaFin?.toLowerCase().includes(filterText.toLowerCase())) 
        );
      };
    
      useEffect(() => {
        applyFilters();
      },[filterText, absences]);

    useEffect(()=> {
        setAbsences(data);
    },[data]);

    if(loading){
        return (
            <Typography variant='body2' sx={{textAlign: 'center', padding: 3}}>
            Cargando información...
          </Typography>
        );
    }

  return (
    <Box>
        <Box>
            <Alert variant='filled' severity='info'>Las ausencias registradas se generan de las solicitudes.</Alert>
        </Box>
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
                        <TableCell align='left' >N# Ausencia</TableCell>
                        <TableCell>Fecha Ausencia</TableCell>
                        <TableCell>Fecha Fin</TableCell>
                        <TableCell>Asunto</TableCell>
                        <TableCell>Hora Inicio</TableCell>
                        <TableCell>Hora Fin</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {filteredRows.map((row, index) => (
                        <TableRow
                        key={row.idSolicitud}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{formatDate(row.fechaInicio!)}</TableCell>
                        <TableCell>{ row.fechaFin? formatDate(row.fechaFin) : 'No indica'}</TableCell>
                        <TableCell>{row.asunto? row.asunto : 'No indica'}</TableCell>
                        <TableCell>{row.horaInicio? row.horaInicio : 'No indica'}</TableCell>
                        <TableCell>{row.horaFin? row.horaFin : 'No indica'}</TableCell>
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
