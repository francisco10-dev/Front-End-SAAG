import {useState, useEffect} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box  from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Chip, IconButton, Typography } from '@mui/material';
import ExpedienteService, {Documento} from '../../../../services/expediente.service';
import { MinusCircleOutlined } from '@ant-design/icons';
import { Popconfirm, message } from 'antd';
import DownloadIcon from '@mui/icons-material/Download';
import { saveAs } from  'file-saver';
import PreviewPdf from '../../file/previewDocument';
import { formatDate } from '../../../solicitudes/utils';
import TextField from '@mui/material/TextField';

interface Props{
    readonly courses: Documento[],
    readonly loadData: () => void;
}

export default function Courses({courses, loadData}: Props) {

    const [loading, setLoading] = useState(false);
    const service = new ExpedienteService();
    const [openPdf, setOpenPdf] = useState(false);
    const [idDocumento, setIdDocumento] = useState<number>(0);
    const [fileType, setFileType] = useState<'image' | 'pdf'>('pdf');
    const [filterText, setFilterText] = useState('');
    const [filteredRows, setFilteredRows] = useState(courses); 


    const handlePreview = (row: Documento) => {
        setIdDocumento(row.idDocumento);
        setOpenPdf(true);
        const fileType = getFileType(row.nombreArchivo);
        if(fileType === 'pdf' || fileType === 'image'){
            setFileType(fileType);
        }
    }   

    const downloadFile = async (row: Documento) => {
        try {
          const fileBlob = await service.getDocument(row.idDocumento);
          saveAs(fileBlob, row.nombreArchivo);
        } catch (error) {
          console.log(error);
        }
    };

    const handleClick = (row: Documento) => {
        const fileType = getFileType(row.nombreArchivo);
        if(fileType === 'other'){
            downloadFile(row);
        }else{
            handlePreview(row);
        }
    }


    const handleDelete = async (row: Documento)=>{
        try {
            setLoading(true);
            const response = await service.deleteDocument(row.idDocumento);
            if(response === 200){
                message.success('Se ha eliminado el registro');
                loadData();
            }else{
                message.info('Ha ocurrido un error al intentar eliminar el registro, vuelve a intentarlo.');
            }
        } catch (error) {
            message.error('Error al comunicarse con el servidor, intente de nuevo más tarde.');
        }finally{
            setLoading(false);
        }
    }

    const deleteButton = (row: Documento) => {
        return (
            <Box>
                <Popconfirm
                    title="Eliminar"
                    description="Eliminar registro?"
                    onConfirm={() => handleDelete(row)}
                    okText="Sí"
                    okButtonProps={{loading: loading}}
                    cancelText="Cancelar"
                >
                    <MinusCircleOutlined style={{color: 'red', fontSize: 18}}/>
                </Popconfirm>
            </Box>
        );
    }


    const getFileType = (name: string): string => {
        const fileExtension = name.split('.').pop()?.toLowerCase(); // Obtener la extensión del archivo
      
        if (fileExtension) {
          if (fileExtension === 'pdf') {
            return 'pdf';
          } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension)) {
            return 'image';
          } else if (['docx', 'doc'].includes(fileExtension)) {
            return 'docx'; // Puedes considerar 'doc' como Word también
          } else if (['xlsx', 'xls'].includes(fileExtension)) {
            return 'excel'; // Puedes considerar 'xls' como Excel también
          } else {
            return 'other';
          }
        }
        return 'other';
    };

    const handleImageDoc = (filename: string): { src: string; size: number; left: number } => {
        const fileType = getFileType(filename);
      
        const iconMapping: { [key: string]: { src: string; size: number; left: number  } } = {
          pdf: { src: '/pdfIcon.svg', size: 35, left: -7 },
          image: { src: '/imgIcon.png', size: 25, left: 0  },
          docx: { src: '/wordIcon.svg', size: 25, left: 0  },
          doc: { src: '/wordIcon.svg', size: 25, left: 0  },
          excel: { src: '/excelIcon.svg', size: 25, left: 0  },
          other: { src: '/file_icon.svg', size: 25, left: 0 },
        };
      
        return iconMapping[fileType] || iconMapping.other;
    };

    const handleInputChange = (value: string) => {
        setFilterText(value);
    }

    const applyFilters = () => {
        const filteredData = courses.filter((row) => filterRow(row));
        setFilteredRows(filteredData);
    };
    
    const filterRow = (row: Documento) => {
        const formattedDate = formatDate(row.fechaVencimiento);
        const formattedDate2 = formatDate(row.fechaSubida);
        return (
            (row.curso?.toLowerCase().includes(filterText.toLowerCase())) ||
            (formattedDate.toLowerCase().includes(filterText.toLowerCase())) ||
            (formattedDate2.toLowerCase().includes(filterText.toLowerCase()))
        );
    };
    
    useEffect(() => {
        applyFilters();
    },[filterText, courses]);

    const styles = {
        position: 'sticky',
        top: 0,
        background: 'white',
        zIndex: 1
    };

  return (
    <Box mt={2}>
        <Box>
         <PreviewPdf open={openPdf} setOpen={setOpenPdf} id={idDocumento} fileType={fileType}/>
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

        {filteredRows.length > 0 ? (
            <Box>

                <TableContainer component={Paper} className='tableContainerDocs'>
                <Table sx={{ minWidth: 65 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell sx={styles}>Curso</TableCell>
                        <TableCell sx={styles}>Documento</TableCell>
                        <TableCell align='center' sx={styles}>Vencimiento</TableCell>
                        <TableCell align='center' sx={styles}>Fecha de registro</TableCell>
                        <TableCell align='center' sx={styles}>Descargar</TableCell>
                        <TableCell align='center' sx={styles}>Eliminar</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {filteredRows.map((row) => (
                        <TableRow
                        key={row.idDocumento}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row" >
                            {row.curso}
                        </TableCell>
                        <TableCell>
                            <Typography 
                                variant='body2'
                                sx={{
                                display: 'flex',
                                alignItems: 'center', // Alinea el icono y el texto verticalmente
                                cursor: 'pointer', 
                                textDecoration: 'none',
                                }} 
                                onClick={() => handleClick(row)}
                            >
                                <img src={handleImageDoc(row.nombreArchivo).src} alt='doc' style={{ width: handleImageDoc(row.nombreArchivo).size, marginRight: 10, marginLeft: handleImageDoc(row.nombreArchivo).left }} />
                                {row.nombreArchivo}
                            </Typography>
                        </TableCell>
                        <TableCell align='center'>
                         <Chip label={formatDate(row.fechaVencimiento)} color="primary" variant='outlined'/>
                        </TableCell>
                        <TableCell align='center'>
                            {formatDate(row.fechaSubida)}
                        </TableCell>
                        <TableCell align='center'>
                            <IconButton color='primary' onClick={()=> downloadFile(row)}>
                            <DownloadIcon/>  
                            </IconButton>
                        </TableCell>
                        <TableCell align='center'>
                            {deleteButton(row)}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
            </Box>
        ) : (
            <Box>
                <Typography variant='body2' sx={{textAlign: 'center', padding: 3}}>No hay información</Typography>
           </Box>
        )}
    </Box>
  );
}
