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
import { Typography } from '@mui/material';
import { formatDate } from '../../solicitudes/utils';

export default function Absences(props: {id: number}) {

    const [idColaborador, setIdColaborador] = useState(props.id);
    const [absences, setAbsences] = useState<Ausencia[]>([]);

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

    useEffect(()=> {
        setIdColaborador(props.id);
    },[props.id]);

    useEffect(()=> {
        loadData();
    },[idColaborador]);

  return (
    <Box>
        {absences.length > 0 ? (
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
                {absences.map((row) => (
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
  );
}
