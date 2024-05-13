import {useState, useEffect, Fragment} from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ColaboradorService from '../../../services/colaborador.service';
import { Solicitud } from '../../../services/solicitud.service';
import { formatDate } from '../../solicitudes/utils';
import Badge from '../../solicitudes/badge';
import { TextField } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

function Row(props: Readonly<{ row: Solicitud }>) {
  
  const [open, setOpen] = useState(false);
  

  const {row} = props;

  return (
    <Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.idSolicitud}
        </TableCell>
        <TableCell>{row.asunto? row.asunto : 'No indica'}</TableCell>
        <TableCell>{formatDate(row.fechaSolicitud)}</TableCell>
        <TableCell>{row.nombreEncargado? row.nombreEncargado : 'No indica'}</TableCell>
        <TableCell>
            <Badge estado={row.estado}/>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="body1" gutterBottom component="div">
                Más datos
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha Inicio</TableCell>
                    <TableCell>Fecha Fin</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Sustituto</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                      {row.fechaInicio? formatDate(row.fechaInicio): 'No indica'}
                      </TableCell>
                      <TableCell>{row.fechaFin? formatDate(row.fechaFin): 'No indica'}</TableCell>
                      <TableCell>{row.tipoSolicitud}</TableCell>
                      <TableCell>
                        {row.nombreSustituto? row.nombreSustituto : 'No indica'}
                      </TableCell>
                    </TableRow>
                </TableBody>
              </Table>
              <Typography variant="body1" gutterBottom component="div" sx={{marginTop: 2}}>
                Comentarios
              </Typography>
              <Box>
                {row.comentarioTalentoHumano? row.comentarioTalentoHumano : 'Sin comentarios'}
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}


interface Props{
    id: number;
}

export default function Requests({id}: Readonly<Props>) {

  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [idColaborador, setIdColaborador] = useState(id);
  const [filterText, setFilterText] = useState('');
  const [filteredRows, setFilteredRows] = useState(solicitudes); 
  const [sort, setSort] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadData = async ()=> {
    try {
        setLoading(true);
        const service = new ColaboradorService();
        const response = await service.obtenerSolicitudesPorColaborador(idColaborador);
        setSolicitudes(response);
    } catch (error) {
        setSolicitudes([]);
    }finally{
      setLoading(false);
    }
  }

  
  const handleInputChange = (value: string) => {
    setFilterText(value);
  }

  const applyFilters = () => {
    const filteredData = solicitudes.filter((row) => filterRow(row));
    setFilteredRows(filteredData);
  };

  const filterRow = (row: Solicitud) => {
    const formattedDate = formatDate(row.fechaSolicitud);
    return (
      (row.nombreColaborador?.toLowerCase().includes(filterText.toLowerCase())) ||
      (row.estado?.toLowerCase().includes(filterText.toLowerCase())) ||
      (row.tipoSolicitud?.toLowerCase().includes(filterText.toLowerCase())) ||
      (row.idColaborador?.toString().includes(filterText)) ||
      (row.idSolicitud?.toString().includes(filterText)) ||
      (formattedDate.toLowerCase().includes(filterText.toLowerCase()))
    );
  };

  useEffect(() => {
    applyFilters();
  },[filterText, solicitudes]);

  useEffect(()=> {
    setIdColaborador(id);
  },[id]);

  useEffect(() => {
    loadData();
  },[idColaborador]);

  useEffect(()=> {
    handleChangeSort();
  }, [sort]);

  const handleChangeSort = () => {
    
    const newSolicitudes = [...solicitudes];

    newSolicitudes.sort((a, b) => {
      const dateA = new Date(a.fechaSolicitud);
      const dateB = new Date(b.fechaSolicitud);

      return sort ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });
    setSolicitudes(newSolicitudes);
  };

  return (
    <Box>
      {loading ? 
        <Typography variant='body2' sx={{textAlign: 'center', padding: 3}}>
          Cargando información...
        </Typography> :
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
              {filteredRows.length > 0 ? 
                  <TableContainer component={Paper} sx={{maxHeight: 500}} >
                      <Table aria-label="collapsible table">
                      <TableHead>
                          <TableRow>
                          <TableCell />
                          <TableCell>N# Solicitud</TableCell>
                          <TableCell>Asunto</TableCell>
                          <TableCell>
                            Fecha Solicitud
                            <IconButton onClick={() => setSort(!sort)}>
                              {sort ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                            </IconButton>
                          </TableCell>
                          <TableCell>Encargado</TableCell>
                          <TableCell align='center'>Estado</TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          {filteredRows.map((row) => (
                          <Row key={row.idSolicitud} row={row} />
                          ))}
                      </TableBody>
                      </Table>
                  </TableContainer>
              : 
              <Box>
                <Typography variant='body2' sx={{textAlign: 'center', padding: 3}}>No hay solicitudes registradas</Typography>
              </Box>
              }
          </Box>
      </Box> }
    </Box>
  );
}
