import { useState, ChangeEvent, useEffect} from 'react';
import { PlusOutlined, MinusCircleOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Button, Col, DatePicker, Spin, Drawer, Popconfirm, message, Form, Select, Input, Row, Space, Modal } from 'antd';
import UploadFiles from './file/uploadFile';
import { Box, IconButton } from '@mui/material';
import type { UploadFile } from 'antd/lib/upload/interface';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useMediaQuery } from 'react-responsive';
import ExpedienteService from '../../services/expediente.service';
import ColaboradorService from '../../services/colaborador.service';
import '../../App.css'
import AddPuesto from './addpuesto';
import PuestoService from '../../services/puesto.service';


interface EmployeeData {
  nombre: string;
  identificacion: string;
  edad: string;
  correoElectronico: string;
  unidad: string;
  puesto: string;
  fechaNacimiento: string;
  fechaIngreso: string;
  fechaSalida: string;
  domicilio: string;
  estado: string;
  equipo: string;
  tipoJornada: string;
}

const initialEmployeeData: EmployeeData = {
  nombre: '',
  identificacion: '',
  edad: '',
  correoElectronico: '',
  unidad: '',
  puesto: 'Jefe de TI',
  fechaNacimiento: '',
  fechaIngreso: '',
  fechaSalida: '',
  domicilio: '',
  estado: 'Activo',
  equipo: '',
  tipoJornada:'Diurna'
};

interface Props{
  openForm: boolean;
  setOpenForm: (value: boolean) => void;
  reload: ()=> void;
}

export interface Puesto{
  value: number;
  label: string;
}

const Formulario = ({openForm, setOpenForm, reload}:Props) => {

  //@ts-ignore
  const [open, setOpen] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<UploadFile[]>([]);
  const [employeeData, setEmployeeData] = useState<EmployeeData>(initialEmployeeData);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImage2, setSelectedImage2] = useState<File | null>(null);
  const [form] = Form.useForm();
  const isLargeScreen = useMediaQuery({ query: '(min-width:750px)' }); 
  const service = new ExpedienteService();
  const [isLoading, setLoading] = useState(false);
  const [openP, setOpenP] = useState(false);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const colaboradorService = new ColaboradorService();

  

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setSelectedImage(result);
          setSelectedImage2(file);
        }
      };

      reader.readAsDataURL(file);
    } else {
      console.error('error');
    }
  };

  const deleteImages = () => {
    setSelectedImage(null);
    setSelectedImage2(null);
  }
  
  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };


  const onClose = () => {
    setOpen(false);
    setOpenForm(false);
    form.resetFields();
    setEmployeeData(initialEmployeeData);
    deleteImages();
    setSelectedFiles([]);
    setPhoneNumbers([]);
  };

  const handleUploadPhoto = async (id: number ) => {
    if (selectedImage2) {
      try {
        await service.updatePhoto(id, selectedImage2);
      } catch (error) {
        message.error('No se ha podido guardar la foto.');
      }
    }
  };

  const handleAddPhoneNumbers = async (id: any) => {
    if (phoneNumbers) {
      // Filtrar los números de teléfono que no tienen valor
      const validPhoneNumbers = phoneNumbers.filter((phoneNumber) => phoneNumber.trim() !== '');
  
      if (validPhoneNumbers.length > 0) {
        const service = new ColaboradorService();
        await service.agregarTelefonos(id, validPhoneNumbers);
      } else {
        console.log('No hay números de teléfono válidos para enviar.');
      }
    }
  };

  const createForm = (id: string) => {
    const formData = new FormData();
    formData.append('idColaborador', id);
    selectedFiles.forEach((file) => {
      if (file.originFileObj) {
        formData.append('file', file.originFileObj);
      } else if (file instanceof File) {
        formData.append('file', file);
      }
    });
    return formData;
  }

  const uploadFiles = async (id : string) => {
    try {
        const response = await service.registrarDocumento(createForm(id));
        if(response.status === 200){
            setSelectedFiles([]);
        }else{
            message.error('Ocurrió un error al registrar los documentos.');
        }
    } catch (error) {
        message.error('Ocurrió un error al registrar documentos, intente de nuevo más tarde.');
      }
  }
  
  const loadPuestos = async () => {
    try {
      const service = new PuestoService();
      const response = await service.getPuestos();

      const opciones= response.map(puesto => ({
        value: puesto.idPuesto,
        label: puesto.nombrePuesto
      }));
      setPuestos(opciones);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadPuestos();
  }, []);

  async function checkExistingEmployee(): Promise<{ emailExists: boolean, idExists: boolean }> {
    try {
      const { correoElectronico, identificacion } = employeeData;
      const response = await colaboradorService.obtenerColaboradores();
  
      const emailExists = response.some(c => c.correoElectronico === correoElectronico);
      const idExists = response.some(c => c.identificacion === identificacion);
  
      return { emailExists, idExists };
    } catch (error) {
      console.error(error);
      return { emailExists: false, idExists: false };
    }
  }
  
  const handleSuccessfulRegistration = (idColaborador: any) => {
    handleUploadPhoto(idColaborador);
    handleAddPhoneNumbers(idColaborador);
    uploadFiles(idColaborador);
    message.success('Registro exitoso!');
    onClose();
    reload();
  };
  
  const handleSubmit = async () => {
    try {
      setLoading(true);
  
      const data: EmployeeData = Object.fromEntries(
        Object.entries(employeeData).filter(([_, value]) => value !== '')
      ) as EmployeeData;
  
      const { emailExists, idExists } = await checkExistingEmployee();
  
      if (emailExists) {
        message.warning('El correo electrónico ingresado ya existe.');
      } else if (idExists) {
        message.warning('La identificación ingresada ya existe.');
      } else {
        const response = await colaboradorService.agregarColaborador(data);

        console.log(response.data);
  
        if (response.status === 200) {
          handleSuccessfulRegistration(response.data.data.idColaborador);
        }
      }
    } catch (error) {
      message.error('Ocurrió un error al registrar la informaación, por favor intente más tarde. ');
    } finally {
      setLoading(false);
    }
  };

  //@ts-ignore
  const onChange = (date : any, dateString : any, fieldName : string ) => {
    setEmployeeData({
      ...employeeData,
      [fieldName]: dateString,
    });
  };

  const handleAddPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, '']);
  };

  const handleRemovePhoneNumber = (index : any) => {
    const newPhoneNumbers = [...phoneNumbers];
    newPhoneNumbers.splice(index, 1);
    setPhoneNumbers(newPhoneNumbers);
  };

  const handlePhoneNumberChange = (index : any, value : any) => {
    const newPhoneNumbers = [...phoneNumbers];
    newPhoneNumbers[index] = value;
    setPhoneNumbers(newPhoneNumbers);
  };

  
  const handleChangeItem = (value: string) => {
    handleChange('estado', value);
  };

  const handleChangePuesto = (value: string) => {
    handleChange('puesto', value);
  }

  const handleChange = (fieldName : any, value : any) => {
    setEmployeeData({
      ...employeeData,
      [fieldName]: value
    });
  };

  const handleFilesChange = (files: UploadFile<any>[]) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    setVisible(false); 
  };

  const handleRemoveFile = (index : any) => {
    const filename = selectedFiles[index].name;
    const files = [...selectedFiles];
    files.splice(index, 1);
    setSelectedFiles(files);
    message.success(filename + ' se ha quitado de la lista');
  };

  const openAddPuesto = () => {
    setOpenP(true);
  }

  return (
    <>
      <Drawer
        title="Ingresar nuevo"
        width={800}
        onClose={onClose}
        open={openForm}
        style={{marginTop: 58}}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancelar</Button>
            <Button htmlType="submit" onClick={() => form.submit()} type="primary">
              Guardar
            </Button>
          </Space>
        }
      > 
      {isLoading ? 
        <Box className='spin-antd'>
          <Spin size="large" />
        </Box> : 
        <Form form={form} layout="vertical" initialValues={initialEmployeeData} requiredMark  onFinish={handleSubmit}>
        <Box display='flex'>
          <label htmlFor="file-input">
           <Box
              component="div"
              className='container-input-foto'
              sx={{
                border: selectedImage? 'none' :  'dashed 1px',
                opacity: selectedImage? 1 : 0.7,
                width: selectedImage ? 'auto' : 100, // Establecer el ancho automático si hay una imagen
                height: selectedImage ? 'auto' : 100, // Establecer la altura automática si hay una imagen
              }}
            >
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className='input-Foto'
              />
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className='image-'
                  />
                ) : (
                  <Typography variant="body1" color="text.primary">
                    Foto carné
                  </Typography>
                )}
              </Box>
            </label>
            <Box>
              {selectedImage? 
                <IconButton onClick={()=> deleteImages()} sx={{color: 'red'}}>
                  <DeleteOutlineOutlinedIcon/>
                </IconButton> : ''
              }
            </Box>
          </Box>
          <Row gutter={16}>
            <Col span={isLargeScreen ? 12 : 24}>
              <Form.Item
                name="nombre"
                label="Nombre completo"
                rules={[{ required: true, message: 'Complete este campo' }]}
              >
                <Input placeholder="Nombre completo" onChange={(e) => handleChange('nombre', e.target.value)} />
              </Form.Item>
            </Col>
            <Col span={isLargeScreen ? 12 : 24}>
              <Form.Item
                name="identificacion"
                label="Identificación"
                rules={[{ required: true, message: 'Complete este campo' }]}
              >
                <Input placeholder="Ingrese ID" onChange={(e) => handleChange('identificacion', e.target.value)} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={isLargeScreen ? 12 : 24}>
                <Form.Item
                  name="equipo"
                  label="Equipo"
                  rules={[{ required: true, message: 'Complete este campo' }]}
                >
                  <Input placeholder="Equipo" onChange={(e) => handleChange('equipo', e.target.value)} />
                </Form.Item>
              </Col>
              <Col span={isLargeScreen ? 12 : 24}>
                <Form.Item
                  name="estado"
                  label="Estado"
                >
                  <Select
                    style={{ width: '100%' }}
                    defaultValue='Activo'
                    onChange={handleChangeItem}
                    options={[
                      { value: 'Activo', label: 'Activo' },
                      { value: 'Inactivo', label: 'Inactivo' },
                    ]}
                  />
                </Form.Item>
              </Col>
          </Row>
          <Row gutter={16}>
          <Col span={isLargeScreen ? 12 : 24}>
              <Form.Item
                name="fechaNacimiento"
                label="Fecha de nacimiento"
                rules={[{ required: true, message: 'Complete este campo' }]}
              >
                <DatePicker  onChange={(date, dateString) => onChange(date, dateString, 'fechaNacimiento')} placeholder="Seleccione" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={isLargeScreen ? 12 : 24}>
              <Form.Item
                name="correoElectronico"
                label="Correo electrónico"
                rules={[{ required: true, message: 'Complete este campo' }]}
              >
                <Input placeholder="Ingrese email" type="email" onChange={(e) => handleChange('correoElectronico', e.target.value)} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={isLargeScreen ? 12 : 24}>
              <Form.Item
                name="unidad"
                label="Unidad de gestión"
              >
                <Input placeholder="Unidad de gestión" onChange={(e) => handleChange('unidad', e.target.value)} />
              </Form.Item>
            </Col>
            <Col span={isLargeScreen ? 12 : 24}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Form.Item
                  name="puesto"
                  label="Puesto"
                  style={{ marginRight: '8px', width: 320 }}
                >
                  <Select
                    style={{ width: '100%' }}
                    placeholder = 'Seleccione'
                    onChange={handleChangePuesto}
                    options={puestos}
                  />
                </Form.Item>
                  <Button onClick={openAddPuesto} type='primary' icon={<PlusCircleFilled />} style={{marginTop: 5}} />
                   <AddPuesto open={openP} setOpen={setOpenP} reload = {loadPuestos} existentes={puestos}  /> 
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={isLargeScreen ? 12 : 24}>
              <Form.Item
                name="fechaIngreso"
                label="Fecha de ingreso"
                rules={[{ required: true, message: 'Complete este campo' }]}
              >
                <DatePicker  onChange={(date, dateString) => onChange(date, dateString, 'fechaIngreso')} placeholder="Seleccione" style={{ width: '100%' }}/>
              </Form.Item>
            </Col>
            <Col span={isLargeScreen ? 12 : 24}>
              <Form.Item
                name="fechaSalida"
                label="Fecha de salida"
              >
                <DatePicker  onChange={(date, dateString) => onChange(date, dateString, 'fechaSalida')} placeholder="Seleccione" style={{ width: '100%' }}/>
              </Form.Item>
            </Col>            
          </Row>
          <Row gutter={16}>
            <Col span={isLargeScreen ? 12 : 24}>
              <Form.Item
                name="domicilio"
                label="Domicilio"
                rules={[
                  {
                    required: true,
                    message: 'Complete este campo',
                  },
                ]}
              >
                <Input.TextArea rows={2} placeholder="Ingrese domicilio" onChange={(e) => handleChange('domicilio', e.target.value)} />
              </Form.Item>
            </Col>
            <Col span={isLargeScreen ? 12 : 24}>
                <Form.Item
                  name="tipoJornada"
                  label="Jornada"
                >
                  <Select
                    style={{ width: '100%' }}
                    defaultValue='Diurna'
                    onChange={(value) => handleChange('tipoJornada', value)}
                    options={[
                      { value: 'Diurna', label: 'Diurna' },
                      { value: 'Nocturna', label: 'Nocturna' },
                    ]}
                  />
                </Form.Item>
              </Col>
          </Row>
          <Row gutter={16}>
            <Col span={isLargeScreen? 12 : 24}>
              <Form.Item
                label="Números de teléfono"
              >
                { phoneNumbers.map((phoneNumber, index) => (
                  <Space className='space' key={index}>
                    <Input
                      style={{ flex: 1  }}
                      placeholder="Ingrese"
                      value={phoneNumber}
                      onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
                      type="number"
                    />
                    {index >= 0 && (
                      <MinusCircleOutlined 
                        onClick={()=> handleRemovePhoneNumber(index)} 
                        style={{color: 'red', fontSize: 18}}
                      />
                    )}
                  </Space>
                ))}
                <Button type="dashed" onClick={handleAddPhoneNumber} icon={<PlusOutlined />}>
                  Agregar
                </Button>
              </Form.Item>
            </Col>
          </Row>
          <Box mb={5}>
            <Box width={550}>
              <h5 style={{marginBottom: 25}}>Documentos</h5>
              <Button style={{marginBottom: 25}} type="dashed" onClick={showModal} icon={<PlusOutlined />}>
                  Agregar
              </Button>
              <Modal
                title="Subir archivos"
                open={visible}
                onCancel={handleCancel}
                footer={null}
                centered
              >
                <UploadFiles onFilesChange={handleFilesChange} isMultiple= {true} message='Seleccione archivos'/>
              </Modal>
              {selectedFiles.length > 0? 
                <Box sx={{width: 725}}>
                  <TableContainer component={Paper} sx={{width: isLargeScreen? 700 : 350}}>
                    <Table sx={{ minWidth: 250 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Archivo</TableCell>
                          <TableCell align='center'>
                            <Popconfirm
                                title="Quitar archivos"
                                description="Limpiar?"
                                onConfirm={() => setSelectedFiles([])}
                                okText="Sí"
                                cancelText="No"
                              >
                                <MinusCircleOutlined style={{color: 'red', fontSize: 18}}/>
                            </Popconfirm>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedFiles.map((row, index) => (
                          <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align='center'>
                              <Popconfirm
                                title="Quitar archivo"
                                description="Quitar archivo de la lista?"
                                onConfirm={() => handleRemoveFile(index)}
                                okText="Sí"
                                cancelText="No"
                              >
                                <MinusCircleOutlined style={{color: 'red', fontSize: 18}}/>
                              </Popconfirm>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box> : <Box></Box> 
              }
            </Box>
          </Box>
        </Form> }
      </Drawer>
      
    </>
  );
}

export default Formulario;