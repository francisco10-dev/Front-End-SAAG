import { Button, Form, Input, DatePicker, message, Select } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { Box, Grid, Typography } from '@mui/material';
import ExpedienteService from '../../../services/expediente.service';
import 'moment/locale/es'
import UploadImage from '../uploadFoto';
import ColaboradorService, { Colaborador } from '../../../services/colaborador.service';
import { Puesto } from '../create/createExpediente';
import PuestoService from '../../../services/puesto.service';
import { PlusCircleFilled } from '@ant-design/icons';
import AddPuesto from '../addpuesto';
import dayjs from 'dayjs'; // Importar Dayjs


type FieldType = {
  identificacion?: string;
  nombre?: string;
  correo?: string;
  edad?: number;
  domicilio: string;
  fechaNacimiento: Date;
  unidad: string;
  puesto: string;
  fechaIngreso: string;
  fechaSalida: string;
  equipo: string;
  jornada: string;
  estado: string;
  razon: string;
};

interface Props{
  colaborador: Colaborador | null;
  setIsEdit: (value:boolean) => void;
  imageUrl: string | null;
  loadData: ()=> void;
  reload: ()=> void;
}

const EditInfo = ({colaborador, setIsEdit, imageUrl, loadData, reload}: Props) => {

  const [nombre, setNombre] = useState(colaborador?.nombre);
  const [identificacion, setIdentificacion] = useState(colaborador?.identificacion);
  const [correo, setCorreo] = useState(colaborador?.correoElectronico);
  const [domicilio, setDomicilio] = useState(colaborador?.domicilio);
  const [fechaNacimiento, setFechaNacimiento] = useState(colaborador?.fechaNacimiento);
  const [unidad, setUnidad] = useState(colaborador?.unidad);
  const [tipoJornada, setTipoJornada] = useState(colaborador?.tipoJornada);
  const [equipo, setEquipo] = useState(colaborador?.equipo);
  const [estado, setEstado ] = useState(colaborador?.estado); 
  const [estadoRazon, setEstadoRazon] = useState<string | null>(null);
  const [idPuesto, setIdPuesto] = useState(colaborador?.puesto?.idPuesto);
  const [fechaIngreso, setFechaIngreso] = useState(colaborador?.fechaIngreso);
  const [fechaSalida, setFechaSalida] = useState(colaborador?.fechaSalida);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [openP, setOpenP] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      fechaNacimiento: colaborador?.fechaNacimiento ? dayjs(colaborador.fechaNacimiento) : null,
      fechaIngreso: colaborador?.fechaIngreso ? dayjs(colaborador.fechaIngreso) : null,
      fechaSalida: colaborador?.fechaSalida ? dayjs(colaborador.fechaSalida) : null,
    });
  }, [colaborador?.fechaNacimiento, colaborador?.fechaSalida, colaborador?.fechaIngreso, form]);

  useEffect(() => {
    loadPuestos();
  }, []);

  if(!colaborador){
    return <div>No se encontró el expediente</div>
  }

  const onFinish = async () => {
    try {
      setLoading(true);
      const data = dataColaborador();

      const service = new ColaboradorService();
      const response = await service.actualizarColaborador(colaborador.idColaborador, data);
      await handleUploadPhoto();
      if(response.status === 200){
        setIsEdit(false);
        localStorage.removeItem("expedientesData");
        loadData();
        reload();
        message.success('Información actualizada');
      }else{
        message.error('Ocurrió un error al tratar de actualizar la información, intente de nuevo.');
      }
    } catch (error) {
      message.error('Error del servidor, por favor intente nuevamente más tarde.');
    }finally{
      setLoading(false);
    }
  };

  const changeEstado = (value: string) =>{
    setEstadoRazon(value);
    if(value){
      const newDate = new Date();
      const fechaValida = moment(newDate).format("YYYY-MM-DD");
      setFechaSalida(fechaValida);
    }
  }

  const handleUploadPhoto = async () => {
    if (image) {
      try {
        const service = new ExpedienteService();
        await service.updatePhoto(colaborador.idColaborador, image);
        localStorage.removeItem(`imgUrl${colaborador.idColaborador}`);
      } catch (error) {
        message.error('No se ha podido guardar la foto.');
      }
    }
  };


  const dataColaborador = ()=> {

     let estadoFinal = estadoRazon ?  estado + ' ('+ estadoRazon +')' : estado;

     if(estadoFinal === 'Activo' && fechaSalida !== null ) {
       estadoFinal = 'Inactivo';
     }
    
      const data = {
        nombre: nombre,
        identificacion: identificacion,
        correoElectronico: correo,
        domicilio: domicilio,
        fechaNacimiento: fechaNacimiento,
        unidad: unidad,
        equipo: equipo,
        tipoJornada: tipoJornada,
        estado: estadoFinal,
        fechaIngreso: fechaIngreso,
        fechaSalida: fechaSalida,
        idPuesto: idPuesto,
      }
      return data;
  }
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };


  const setNacimiento = (_date: any, dateString: any) => {
    if(dateString && dateString.trim() !== ""){
      const fechaValida = moment(dateString, "DD-MM-YYYY").format("YYYY-MM-DD");
      setFechaNacimiento(fechaValida);
    }
  }

  const setIngreso = (_date: any, dateString: any) => {
    if(dateString && dateString.trim() !== ""){
      const fechaValida = moment(dateString, "DD-MM-YYYY").format("YYYY-MM-DD");
      setFechaIngreso(fechaValida);
   }
  }

  const setSalida = (_date: any, dateString: any) => {
    if (dateString && dateString.trim() !== "") {
      const fechaValida = moment(dateString, "DD-MM-YYYY").format("YYYY-MM-DD");
      setFechaSalida(fechaValida);
    } else {
      setFechaSalida(null);
    }
  };

  const handleImage = (file: File | null) => {
    setImage(file);
  }

  
  const openAddPuesto = () => {
    setOpenP(true);
  };

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
  };

  const handleChangePuesto = (id: number) => {
    setIdPuesto(id);
  }

  return (

    <Box>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 16 }}
        style={{ width: '90%' }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Box display='flex'>
          <Box mr={3}>
           <UploadImage imageUrl={imageUrl} Image={handleImage}/>
          </Box>
          <Box>
            <Form.Item<FieldType>
              name="nombre"
              style={{  marginLeft: -12 }}
              initialValue={colaborador.nombre}
            >
              <Input style={{border: 'none', fontSize: 25}} onChange={(e)=> setNombre(e.target.value)}/>
            </Form.Item>
            <Box display='flex'>
              <Box mt={-2} width={270}>
               <Typography variant='body2'>Unidad de gestión:</Typography>
              </Box>
              <Form.Item<FieldType>
                name="unidad"
                initialValue={colaborador.unidad}
                style={{ width: '150%', marginTop: -22 }}
              >
                <Input style={{border: 'none'}} onChange={(e)=> setUnidad(e.target.value)}/>
              </Form.Item>              
            </Box>
            <Box display='flex'>
              <Box sx={{width: 100, marginTop: -1}}>
                <Typography variant='body2'>Puesto:</Typography>
              </Box>
              <Box display='flex' width='100%'>
                <Form.Item<FieldType>
                  name="puesto"
                  initialValue={colaborador.puesto?.nombrePuesto}
                  style={{ width: '100%', marginTop: -15, marginLeft: -20 }}
                >
                  <Select
                      style={{ width: '100%' }}
                      placeholder = 'Seleccione'
                      onChange={handleChangePuesto}
                      options={puestos}
                  />
                </Form.Item>     
                <Button onClick={openAddPuesto} type='primary' icon={<PlusCircleFilled />} style={{marginTop: -15.5, marginLeft: -115 }} />
                <AddPuesto open={openP} setOpen={setOpenP} reload = {loadPuestos} existentes={puestos} /> 
              </Box>
            </Box>
          </Box>
        </Box>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} md={3}>
         <Form.Item<FieldType>
            label="Identificación"
            name="identificacion"
            initialValue={colaborador.identificacion}
            style={{ width: '150%' }}
          >
            <Input onChange={(e)=> setIdentificacion(e.target.value)}/>
          </Form.Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
         <Form.Item<FieldType>
            label="Correo"
            name="correo"
            initialValue={colaborador.correoElectronico}
            style={{ width: '150%' }}
          >
            <Input onChange={(e)=> setCorreo(e.target.value)} />
          </Form.Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
         <Form.Item<FieldType>
            label="Fecha de Nacimiento"
            name="fechaNacimiento"
            style={{ width: '150%' }}
          >
            
            <DatePicker format='DD-MM-YYYY' style={{ width: '100%' }} placeholder='Ingrese o seleccione' onChange={(date, dateString) => setNacimiento(date, dateString)} />
          </Form.Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
         <Form.Item<FieldType>
            label="Fecha de Ingreso"
            name="fechaIngreso"
            style={{ width: '150%' }}
          >
              <DatePicker format='DD-MM-YYYY' style={{ width: '100%' }} placeholder='Ingrese o seleccione' onChange={(date, dateString) => setIngreso(date, dateString)}/>
          </Form.Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
         <Form.Item<FieldType>
            label="Fecha de salida"
            name="fechaSalida"
            style={{ width: '150%' }}
          > 
              <DatePicker format='DD-MM-YYYY' style={{ width: '100%' }} placeholder='Ingrese o seleccione' onChange={(date, dateString) => setSalida(date, dateString)}/>
          </Form.Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
         <Form.Item<FieldType>
            label="Domicilio"
            name="domicilio"
            initialValue={colaborador.domicilio}
            style={{ width: '150%' }}
          >
            <Input.TextArea autoSize={{ minRows: 1, maxRows: 6 }} onChange={(e)=> setDomicilio(e.target.value)} />
          </Form.Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
         <Form.Item<FieldType>
            label="Jornada"
            name="jornada"
            initialValue={colaborador.tipoJornada ? colaborador.tipoJornada : 'No indica'}
            style={{ width: '150%' }}
          >
              <Select
                onChange={setTipoJornada}
                options={[
                  { value: 'Diurna', label: 'Diurna' },
                  { value: 'Nocturna', label: 'Nocturna' },
                ]}
              />
          </Form.Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
        <Form.Item<FieldType>
            label="Equipo"
            name="equipo"
            initialValue={colaborador.equipo}
            style={{ width: '150%' }}
          >
            <Input onChange={(e)=> setEquipo(e.target.value)}/>
          </Form.Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <Form.Item
                name="estado"
                label="Estado"
                initialValue={colaborador.estado}
              >
                <Select
                  style={{ width: '150%' }}
                  defaultValue='Activo'
                  onChange={setEstado}
                  options={[
                    { value: 'Activo', label: 'Activo' },
                    { value: 'Inactivo', label: 'Inactivo' },
                  ]}
                />
              </Form.Item>
        </Grid>
        {estado === 'Inactivo' && (
          <Grid item xs={12} sm={6} md={3}>
              <Form.Item
                  name="razon"
                  label="Indique"
                  initialValue={estadoRazon || ''}
                  rules={[{ required: true, message: 'Complete este campo' }]}
                >
                  <Select
                    style={{ width: '150%' }}
                    onChange={changeEstado}
                    options={[
                      { value: 'Despido', label: 'Despido' },
                      { value: 'Jubilado', label: 'Jubilado' },
                      { value: 'Renuncia', label: 'Renuncia' },
                      { value: 'Defunción', label: 'Defunción' },
                    ]}
                  />
                </Form.Item>
          </Grid>          
        )}
      </Grid>
      <Box>
        <Form.Item>
          <Button danger onClick={() => setIsEdit(false)} style={{ marginRight: 5 }}>
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
             {loading? 'Guardando': 'Guardar'}
          </Button>
        </Form.Item>
      </Box>

      </Form>
    </Box>
  );
}

export default EditInfo;