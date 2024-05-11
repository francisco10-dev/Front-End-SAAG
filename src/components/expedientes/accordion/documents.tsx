import {useState, useEffect} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box  from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { IconButton, Typography, Button } from '@mui/material';
import ExpedienteService, {Documento} from '../../../services/expediente.service';
import { MinusCircleOutlined } from '@ant-design/icons';
import { Popconfirm, message, Modal, Spin } from 'antd';
import DownloadIcon from '@mui/icons-material/Download';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { saveAs } from  'file-saver';
import type { UploadFile } from 'antd/lib/upload/interface';
import UploadFiles from '../file/uploadFile';
import PreviewPdf from '../file/previewDocument';
import SelectedFiles from './selectedFiles';


export default function Files(props: { readonly idColaborador: number}) {

    const {idColaborador} = props;
    const [id, setId] = useState(idColaborador);
    const [files, setFiles] = useState<Documento[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState(false);
    const service = new ExpedienteService();
    const [selectedFiles, setSelectedFiles] = useState<UploadFile[]>([]);
    const [visible, setVisible] = useState(false);
    const [openPdf, setOpenPdf] = useState(false);
    const [idDocumento, setIdDocumento] = useState<number>(0);
    const [fileType, setFileType] = useState<'image' | 'pdf'>('pdf');

    const loadData = async () => {
        try {
          const response = await service.getColaboradorDocumento(id);
          setFiles(response);
        } catch (error) {
          console.log(error);
        }
    };

    const handlePreview = (row: Documento) => {
        setIdDocumento(row.idDocumento);
        setOpenPdf(true);
        const fileType = getFileType(row.nombreArchivo);
        if(fileType === 'pdf' || fileType === 'image'){
            setFileType(fileType);
        }
    }   

    useEffect(()=> {
        setId(idColaborador);
    },[idColaborador]);
    

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

    useEffect(()=> {
        loadData();
    },[id]);

    const handleFilesChange = (files: UploadFile<any>[]) => {
        setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    };

    const handleDelete = async (row: Documento)=>{
        try {
            setLoading(true);
            const response = await service.deleteDocument(row.idDocumento);
            if(response === 200){
                message.success(row.nombreArchivo + ' se ha eliminado.');
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
                    description="Eliminar documento?"
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

    const handleDeleteFile = (name?: string) => {
        const newFiles = selectedFiles.filter(file => file.name !== name);
        setSelectedFiles(newFiles);
    }

    const onCancel = () => {
        setVisible(false);
        setSelectedFiles([]);
    }

    const createForm = () => {
        const formData = new FormData();
        formData.append('idColaborador', id.toString());
        selectedFiles.forEach((file) => {
          if (file.originFileObj) {
            formData.append('file', file.originFileObj);
          } else if (file instanceof File) {
            formData.append('file', file);
          }
        });
        return formData;
    }

    const uploadFiles = async () => {
        try {
            setUploadingFiles(true);
            const response = await service.registrarDocumento(createForm());
            if(response.status === 200){
                message.success(response.data.message);
                setSelectedFiles([]);
                setVisible(false);
                loadData();
            }else{
                message.error('Ocurrió un error, intente de nuevo');
            }
        } catch (error) {
            message.error('Ocurrió  un error al comunicarse con el servidor, por favor intente de nuevo más tarde.');
        }finally{
            setUploadingFiles(false);
        }
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

      
    const styles = {
        position: 'sticky',
        top: 0,
        background: 'white',
    };

  return (
    <Box>
        <Box sx={{backgroundColor: 'blue'}}>
         <PreviewPdf open={openPdf} setOpen={setOpenPdf} id={idDocumento} fileType={fileType}/>
        </Box>
        <Box sx={{marginBottom: 2}}>
            <Button 
                variant="outlined" 
                startIcon={<AddOutlinedIcon />} 
                size='small' 
                onClick={()=> setVisible(true)}
            >
                Subir archivos
            </Button>
        </Box>
        <Modal
            title="Subir archivos"
            open={visible}
            onCancel={()=> setVisible(false)}
            footer={null}
            centered
        >
            {selectedFiles.length === 0 && <UploadFiles onFilesChange={handleFilesChange} isMultiple={true} message='Haz click o arrastra para seleccionar archivos'/>}
            {uploadingFiles && (
                <Box className = 'spinDocs'>
                    <Spin size="large" />
                </Box>
            )}
            <SelectedFiles handleDeleteFile={handleDeleteFile} selectedFiles={selectedFiles} />
            <Box textAlign='right' mt={3}>
                <Button size='small' variant='outlined' color='error' sx={{marginRight: 1}} onClick={onCancel}>
                    Cancelar
                </Button>                 
                <Button  onClick={()=> uploadFiles()} size='small' disabled={(selectedFiles.length === 0)} variant='contained'>
                    Guardar
                </Button>
            </Box>
        </Modal>           
        {files.length > 0 ? (
            <TableContainer component={Paper} className='tableContainerDocs'>
            <Table sx={{ minWidth: 65 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell sx={styles}>Archivo</TableCell>
                    <TableCell align='center' sx={styles}>Tamaño</TableCell>
                    <TableCell align='center' sx={styles}>Fecha de registro</TableCell>
                    <TableCell align='center' sx={styles}>Descargar</TableCell>
                    <TableCell align='center' sx={styles}>Eliminar</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {files.map((row) => (
                    <TableRow
                    key={row.idDocumento}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
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
                            <img src={handleImageDoc(row.nombreArchivo).src} style={{ width: handleImageDoc(row.nombreArchivo).size, marginRight: 10, marginLeft: handleImageDoc(row.nombreArchivo).left }} alt='...' />
                            {row.nombreArchivo}
                        </Typography>
                    </TableCell>
                    <TableCell align='center'>
                        {row.tamano}
                    </TableCell>
                    <TableCell align='center'>
                        {row.fechaSubida}
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
        ) : (
            <Box>
                <Typography variant='body2' sx={{textAlign: 'center', padding: 3}}>No hay archivos registrados</Typography>
           </Box>
        )}
    </Box>
  );
}
