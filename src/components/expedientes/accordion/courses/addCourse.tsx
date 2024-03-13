import { useEffect, useState } from 'react';
import { Select, Modal, message, Input, DatePicker } from 'antd';
import { Box, IconButton } from '@mui/material';
import ExpedienteService from '../../../../services/expediente.service';
import type { UploadFile } from 'antd/lib/upload/interface';
import moment from 'moment';
import UploadFiles from '../../file/uploadFile';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import List from '@mui/material/List';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';


const { Option } = Select;

const posiblesOpciones= [
    'CURSO DE BUENAS PRÁCTICAS',
    'CARNÉ PROFESIONAL',
    'CÉDULA',
    'CONIS',
    'CURRÍCULUM',
    'CURSO DE SEGURIDAD DE LA INFORMACIÓN',
    'LICENCIA DE CONDUCIR',
    'IATA',
    'ACLS',
    'BLS',
    'SALVACORAZONES',
    'OTRO'
];

interface Props{
    open: boolean;
    setOpen: (value: boolean) => void;
    reload: () => void;
    idColaborador: number;
}

const Add = ({open, setOpen, reload, idColaborador}: Props) => {
  const service = new ExpedienteService();
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(idColaborador);
  const [selectedFile, setSelectedFile] = useState<UploadFile[]>([]);
  const [fechaVencimiento, setFechaVencimiento] = useState<string | null>();
  const [fecha, setFecha] = useState<Date| null>();
  const [seleccion, setSeleccion] = useState<string>();
  const [nombre, setNombre] = useState<string>('IATA');
  const [openUploader, setOpenUploader] = useState(true);

  const createForm = () => {
    if(selectedFile.length > 0  && fechaVencimiento){
        const formData = new FormData();
        formData.append('idColaborador', id.toString());
        formData.append('curso', nombre);
        formData.append('fechaVencimiento', fechaVencimiento);
        if (selectedFile[0].originFileObj) {
            formData.append('file', selectedFile[0].originFileObj);
        } else if (selectedFile[0] instanceof File) {
            formData.append('file', selectedFile[0]);
        }     
        return formData;
    }
    return null;
  }

  useEffect(()=> {
    setId(idColaborador);
  },[idColaborador]);

  const handleOk = async () => {
    try {
      setLoading(true);
  
      const data = createForm();
  
      if (data !== null) {
        const response = await service.registrarDocumento(data);
        if(response.status === 200){
            setOpen(false);
            setSelectedFile([]);
            setOpenUploader(true);
            setFechaVencimiento(null);
            setFecha(null);
            message.success('Operación exitosa!')
        }
      } else {
        message.info('Debe completar todos los campos.');
      }
    } catch (error) {
      message.error('Ocurrió un error al guardar la información.');
    } finally {
      setLoading(false);
      reload();
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleChange = (value: string) => {
    setSeleccion(value);
    setNombre(value);
  };

  const handleVencimiento = (date: any, dateString: any) => {
    if(dateString && dateString.trim() !== ""){
      const fechaValida = moment(dateString, "DD-MM-YYYY").format("YYYY-MM-DD");
      setFechaVencimiento(fechaValida);
      setFecha(date);
    }
  }

  const handleFilesChange = (files: UploadFile<any>[]) => {
    setSelectedFile(files);
    setOpenUploader(false); 
 };

 const reset = () => {
    setOpenUploader(true);
    setSelectedFile([]);
 }

  return (
    <div>
      <Modal 
        title="Registrar" 
        open={open} 
        onOk={handleOk} 
        okText = 'Guardar'
        cancelText = 'Cancelar'
        onCancel={handleCancel} 
        width={400}
        confirmLoading={loading}
        centered
      > 
        <Box>
            <Box mb={2}>
                
                <Select
                    style={{ width: '100%' }}
                    placeholder="TIPO DE LICENCIA"
                    onChange={handleChange}
                    defaultValue='IATA'
                >
                {posiblesOpciones.map((puesto) => (
                    <Option key={puesto} value={puesto}>
                    {puesto}
                    </Option>
                ))}
                </Select>
            </Box>
            <Box mb={2}>
                {seleccion === 'OTRO' && (
                    <Input placeholder='TIPO DE CURSO' onChange={(e)=> setNombre(e.target.value)} />
                )}                
            </Box>
            <Box mb={2}>
                <DatePicker value={fecha} format='DD-MM-YYYY' style={{ width: '100%' }} placeholder='FECHA DE VENCIMIENTO' onChange={(date, dateString) => handleVencimiento(date, dateString)} />
            </Box>
            <Box mb={2} >
                {openUploader && (
                    <UploadFiles onFilesChange={handleFilesChange} isMultiple={false} message='Seleccione documento' />
                )}
                <Box>
                <Grid item xs={12} md={6}>
                    <List dense={true}>
                    {selectedFile.map((file) => 
                        <ListItem
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete" onClick={reset} color='error'>
                            <DeleteIcon />
                            </IconButton>
                        }
                        >
                        <ListItemAvatar>
                            <Avatar>
                            <AttachFileOutlinedIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={file.name}
                        />
                        </ListItem>,
                    )}
                    </List>
                </Grid>
                </Box>
            </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Add;
