import './form.css';
import { useState, useEffect } from 'react';
import { Input, Select, DatePicker, Typography, Progress, Checkbox, TimePicker, message, Form, Button } from 'antd';
import { Alert, Box, Grid, List, ListItem, IconButton, Avatar, ListItemAvatar, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import { useAuth } from '../../authProvider';
import { toast } from 'react-toastify';
import moment from 'moment';
import ModalComponent from './modal';
import ColaboradorSelect, { ColaboradorOption } from './colaboradorSelect';
import SolicitudService from '../../services/solicitud.service';
import UploadFiles from '../expedientes/file/uploadFile';
import type { UploadFile } from 'antd/lib/upload/interface';
const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const Formulario = () => {
  const { userRole, colaborador, nameSupervisor } = useAuth();
  const [idUsuario, setId] = useState('');
  const [tipoSolicitud, setTipoSolicitud] = useState('');
  const [asunto, setAsunto] = useState('');
  const [goceSalarial, setGoce] = useState('');
  const [goceDisabled, setGoceDisabled] = useState<any>(null);
  const [nombreColaborador, setNombreColaborador] = useState('');
  const [unidadColaborador, setUnidadColaborador] = useState('');
  const [nombreEncargado, setNombreEncargado] = useState('');
  const [nombreJefaturaInmediata, setNombreJefaturaInmediata] = useState('');
  const [fechaSolicitud, setFechaSolicitud] = useState(null);
  const [fechaRecibido, setFechaRecibido] = useState<any>(null);
  const [fechaInicio, setFechaInicio] = useState<any>(null);
  const [fechaFin, setFechaFin] = useState<any>(null);
  const [horaInicio, setHoraInicio] = useState<any>(null);
  const [horaFin, setHoraFin] = useState<any>(null);
  const [esRangoDias, setEsRangoDias] = useState<boolean>(false);
  const [sustitucion, setSustitucion] = useState('');
  const [nombreSustituto, setNombreSustituto] = useState('');
  const [estado, setEstado] = useState('');
  const [comentarioTalentoHumano, setComentarioTalentoHumano] = useState('');
  const [mostrarProgress, setMostrarProgress] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedFile, setSelectedFile] = useState<UploadFile[]>([]);
  const [openUploader, setOpenUploader] = useState(true);
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [userChoice, setUserChoice] = useState<string | null>(null); // Estado para almacenar la elección del usuario
  const [userSelect, setUserSelect] = useState<ColaboradorOption | null>(null);
  const [form] = Form.useForm();
  const dateFormat = 'DD/MM/YYYY';

  useEffect(() => {
    if (userRole === "admin") {
      setShowModal(true);
    } else {
      recuperarDatos();
    }
    console.log(userChoice)
  }, []); // El segundo argumento del useEffect es un array vacío para que se ejecute solo una vez al montar el componente

  const handleAdminChoice = (choice: string | null) => {
    setShowModal(false);
    setUserChoice(choice);
    if (choice === 'solicitudPropia') {
      setFechaRecibido(moment().format('DD-MM-YYYY'));
      recuperarDatos();
    } else {
      setFechaRecibido(moment().format('DD-MM-YYYY'));
      if (colaborador) {
        setNombreEncargado(colaborador.nombre);
      }
    }
  };

  const handleTipoSolicitudChange = (value: any) => {
    setTipoSolicitud(value);
  };

  const handleFechaSolicitudChange = (date: any) => {
    setFechaSolicitud(date);
  };

  const handleFechaInicioChange = (date: any) => {
    setFechaInicio(date);
  };

  const handleFechaFinChange = (date: any) => {
    setFechaFin(date);
  };

  const reset = () => {
    setOpenUploader(true);
    setSelectedFile([]);
  }

  const handleHoraInicioChange = (time: any) => {
    setHoraInicio(time);
  };

  const handleHoraFinChange = (time: any) => {
    setHoraFin(time);
  };

  const handleCheckboxChange = (e: any) => {
    setEsRangoDias(e.target.checked);
  };

  const handleSustitucionChange = (value: any) => {
    if (value === 'SI') {
      setMostrarProgress(true);
      setTimeout(() => {
        setSustitucion(value);
        setMostrarProgress(false);
      }, 350);
    } else {
      setSustitucion(value);
      setNombreSustituto('');
    }
  };

  const handleGoceChangeDisabled = (value: any) => {
    if (value === "Vacaciones" || value === "Licencias") {
      setGoce("1");
      setGoceDisabled(true);
    } else {
      setGoceDisabled(false);
    }
  }

  const handleFilesChange = (files: UploadFile<any>[]) => {
    setSelectedFile(files);
    setOpenUploader(false);
  };

  const handleGoceChange = (value: any) => {
    setGoce(value);
  };

  const handleEstadoChange = (value: any) => {
    setEstado(value);
  };

  const recuperarDatos = () => {
    if (colaborador) {
      setId(colaborador?.idColaborador.toString());
      setNombreColaborador(colaborador.nombre);
      setUnidadColaborador(colaborador?.unidad ?? "");
      setNombreJefaturaInmediata(nameSupervisor ?? "");
    }
  }

  const limpiarFormulario = () => {
    setTipoSolicitud('');
    setAsunto('');
    setGoce('');
    setNombreEncargado('');
    setFechaSolicitud(null);
    setFechaInicio(null);
    setFechaFin(null);
    setHoraInicio(null);
    setHoraFin(null);
    setEsRangoDias(false);
    setSustitucion('');
    setNombreSustituto('');
    setEstado('');
    setComentarioTalentoHumano('');
    setMostrarProgress(false);
  };

  const formatearFecha = (fecha: any) => {
    if (fecha) {
      const anio = fecha.$y;
      const mes = (fecha.$M + 1).toString().padStart(2, '0');
      const dia = fecha.$D.toString().padStart(2, '0');
      return `${anio}-${mes}-${dia}`;
    } else {
      return null
    }
  };

  let alerta = (type: "success" | "error" | undefined, content: string) => {
    messageApi.open({
      type: type,
      content: content,
    });
    return null;
  }

  const validarFecha = (fecha: any) => {
    console.log(fecha);
    if (userRole !== "admin") {
      if (fecha) {
        const a = moment();
        const b = formatearFecha(fecha);

        const diferencia = a.diff(b, 'days'); // Calcular la diferencia en días
        console.log(`diferencia ${diferencia}`);

        if (diferencia >= 7) {
          alerta('success', 'La fecha es válida  (cumple con el minimo de 7 días de anticipación)');
        } else {
          alerta('error', 'La fecha no es válida (solicitud debe hacerse minimo con 7 días de anticipación)');
        }
      }
    } else {
      alerta('success', 'Como administrador no tiene restrcciones en el ingreso de fechas')
    }
  };

  const handleSelect = (option: ColaboradorOption) => {
    setUserSelect(option);
    setNombreColaborador(option.colaborador.nombre);
    setUnidadColaborador(option.colaborador?.puesto?.nombrePuesto ?? 'Default Unidad');
    if (option.usuario) {
      setId(option.usuario.idUsuario.toString());
    } else {
      alerta('error', 'Error, este colaborador no tiene usuario en el sistema');
    }
    setNombreJefaturaInmediata(option.supervisor?.nombre ?? '');
  };


  const formatearHora = (horas: any) => {
    if (horas) {
      console.log('estas son', horas);
      const hora = horas.$H.toString().padStart(2, '0');;
      const min = horas.$m.toString().padStart(2, '0');
      const mili = horas.$ms.toString().padStart(2, '0');
      return `${hora}:${min}:${mili}`;
    } else {
      return null;
    }
  };

  const [enviandoSolicitud, setEnviandoSolicitud] = useState(
    {
      loading: false,
      buttonText: "Enviar",
      isDisabled: false
    }
  ); // Nuevo estado para el estado de envío de la solicitud

  const estadoBtn = () => {
    setEnviandoSolicitud(prevState => ({
      ...prevState,
      loading: true
    }));
    setTimeout(() => {
      setEnviandoSolicitud({
        buttonText: "Enviado",
        isDisabled: true,
        loading: false
      });

      setTimeout(() => {
        setEnviandoSolicitud({
          buttonText: "Enviar",
          isDisabled: false,
          loading: false
        });
      }, 2000);
    }, 2000);
  };


  const enviarSolicitud = async () => {
    const fechaSolicitud = new Date(); // Esto creará un nuevo objeto Date con la fecha y hora actuales
    const fechaSolicitudFormateada = moment(fechaSolicitud, "DD-MM-YYYY").format("YYYY-MM-DD");
    let fechaRecibidoFormateada;
    if (userRole == "admin") {
      if (moment(fechaRecibido, 'DD-MM-YYYY', true).isValid()) {
        fechaRecibidoFormateada = moment(fechaRecibido, 'DD-MM-YYYY').format("YYYY-MM-DD");
      } else {
        console.error('La fecha recibida no es válida');
      }
    } else {
      fechaRecibidoFormateada = null;
    }
    const fechaInicioFormateada = formatearFecha(fechaInicio);
    const fechaFinFormateada = formatearFecha(fechaFin);
    const horaInicioFormateada = formatearHora(horaInicio); // Agrega segundos si son necesarios
    const horaFinFormateada = formatearHora(horaFin); // Agrega segundos
    const goceSalarialFormat = parseInt(goceSalarial); // Parsea la cadena "1" a un número
    if (userRole != "admin") {
      setEstado("Pediente");
    }
    const formData = new FormData();
    formData.append('conGoceSalarial', goceSalarialFormat.toString());
    formData.append('tipoSolicitud', String(tipoSolicitud)); // Convertido a cadena
    formData.append('asunto', String(asunto)); // Convertido a cadena
    formData.append('nombreColaborador', String(nombreColaborador)); // Convertido a cadena
    formData.append('nombreEncargado', String(nombreEncargado)); // Convertido a cadena
    formData.append('fechaSolicitud', fechaSolicitudFormateada);
    formData.append('fechaInicio', fechaInicioFormateada?.toString() ?? '');
    formData.append('fechaFin', fechaFinFormateada?.toString() ?? '');
    formData.append('fechaRecibido', fechaRecibidoFormateada?.toString() ?? '');
    formData.append('horaInicio', horaInicioFormateada?.toString() ?? '');
    formData.append('horaFin', horaFinFormateada?.toString() ?? '');
    formData.append('sustitucion', String(sustitucion)); // Convertido a cadena
    formData.append('nombreSustituto', String(nombreSustituto)); // Convertido a cadena
    formData.append('estado', String(estado)); // Convertido a cadena
    formData.append('comentarioTalentoHumano', String(comentarioTalentoHumano)); // Convertido a cadena
    if (selectedFile[0] && selectedFile[0].originFileObj) {
      formData.append('comprobante', selectedFile[0].originFileObj);
    } else if (selectedFile[0] instanceof File) {
      formData.append('comprobante', selectedFile[0]);
    }    
    formData.append('idColaborador', String(idUsuario)); // Convertido a cadena
    try {
      estadoBtn();
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      const solicitudService = new SolicitudService();
      const response = await solicitudService.agregarSolicitud(formData);
      console.log(response);
      toast.success('La solicitud se ha procesado exitosamente.');
      limpiarFormulario();
    } catch (error) {
      toast.error('La solicitud no se ha procesado correctamente.');
      console.error('Error al enviar la solicitud:', error);
    }
  };
  

return (
  <div className='box'>
    <Form form={form}
      action="/profile"
      method="post"
      encType="multipart/form-data"
      name="basic"
      initialValues={{
        range_picker: [
          moment('00/00/0001', dateFormat),
          moment('00/00/0002', dateFormat),
        ],
      }}
      onFinish={enviarSolicitud}
      layout="vertical"
    >
      <div>
        {showModal && <ModalComponent onAdminChoice={handleAdminChoice} />}
      </div>
      <Alert severity="error"><Text className='text'>Solicitud debe hacerse minimo con 7 días de anticipación.</Text></Alert>
      <div className="contenedor-campos">
        <div className="columna-1">
          {userChoice === 'solicitudEmpleado' && (
            <div className="campo">
              <Form.Item
                name="selectColaborador"
                label="Seleccione el colaborador"
                rules={[{ required: true, message: 'Debe seleccionar un colaborador' }]}
              >
                <ColaboradorSelect onSelect={handleSelect} />
              </Form.Item>
            </div>
          )}
          <div className="campo">
            <Text>Nombre colaborador</Text>
            <Input placeholder="Nombre colaborador" value={nombreColaborador} className="inputWidth" style={{ width: 290 }} disabled />
          </div>
          <div className="campo">
            <Text>Unidad a la que pertenece</Text>
            <Input placeholder="Unidad colaborador" value={unidadColaborador} className="inputWidth" style={{ width: 290 }} disabled />
          </div>
          <div className='campo campo-tipo'>
            <Form.Item
              name="tipo"
              label="Tipo"
              rules={[{ required: true, message: 'Seleccione el tipo' }]}
            >
              <Select showSearch placeholder="Tipo de solicitud" value={tipoSolicitud} onChange={(value) => {
                handleTipoSolicitudChange(value);
                handleGoceChangeDisabled(value);
              }} style={{ width: 150 }}>
                <Option value="Permisos">Permisos</Option>
                <Option value="Licencias">Licencias</Option>
                <Option value="Vacaciones">Vacaciones</Option>
              </Select>
            </Form.Item>
          </div>
          <div className="campo campo-goce">
            <Form.Item
              name="goceSalarial"
              label="Goce salarial"
              rules={[{ required: true, message: 'Seleccione' }]}
            >
              <Select placeholder="Con goce salarial" value={goceSalarial} onChange={handleGoceChange} disabled={goceDisabled} style={{ width: 150 }}>
                <Option value="1">SI</Option>
                <Option value="0">NO</Option>
              </Select>
            </Form.Item>
          </div>
          <div>
            <div className="campo">
              <Checkbox checked={esRangoDias} onChange={handleCheckboxChange}>
                Rango de horas
              </Checkbox>
            </div>
            {!esRangoDias ? (
              <div>
                <Form.Item
                  name="range_picker"
                  label="Seleccione las fechas"
                  rules={[{ required: true, message: 'Seleccione las fechas' }]}
                >
                  {contextHolder}
                  <RangePicker
                    format={dateFormat}
                    placeholder={['Fecha de inicio', 'Fecha de fin']}
                    value={[fechaInicio, fechaFin]}
                    onChange={(dates: any) => {
                      handleFechaInicioChange(dates[0]);
                      validarFecha(dates[0]);
                      handleFechaFinChange(dates[1]);
                    }}
                  />
                </Form.Item>
              </div>
            ) : (
              <div className='hora'>
                <Form.Item
                  name="selectDate2"
                  label="Seleccione las fechas"
                  rules={[{ required: true, message: 'Seleccione las fechas' }]}
                >
                  {contextHolder}
                  <RangePicker
                    placeholder={['Fecha de inicio', 'Fecha de fin']}
                    value={[fechaInicio, fechaFin]}
                    onChange={(dates: any) => {
                      handleFechaInicioChange(dates[0]);
                      validarFecha(dates[0]);
                      handleFechaFinChange(dates[1]);
                    }}
                  />
                </Form.Item>
                <div className='horas'>
                  <Form.Item
                    name="selectHoras"
                    label="Seleccione la hora"
                    rules={[{ required: true, message: 'Seleccione la horas' }]}
                  >

                    <TimePicker
                      placeholder="Hora de inicio"
                      value={horaInicio}
                      onChange={handleHoraInicioChange}
                      format="HH:mm"
                      style={{ marginRight: '5px' }} />
                  </Form.Item>
                  <Form.Item
                    name="selectHoras2"
                    label="Seleccione la hora"
                    rules={[{ required: true, message: 'Seleccione la hora' }]}
                  >
                    <TimePicker
                      placeholder="Hora de fin"
                      value={horaFin}
                      onChange={handleHoraFinChange}
                      format="HH:mm"
                    />
                  </Form.Item>
                </div>
              </div>
            )}
          </div>
          <div className="campo campo-asunto">
            <Text>Asunto</Text>
            <TextArea placeholder="Asunto" value={asunto} onChange={(e) => setAsunto(e.target.value)} allowClear showCount maxLength={30} />
          </div>
          <div className="campo campo-jefaura">
            <Text>Nombre supervisor</Text>
            <Input placeholder="Nombre supervisor" value={nombreJefaturaInmediata} onChange={(e) => setNombreJefaturaInmediata(e.target.value)} style={{ width: 290 }} disabled />
          </div>
          <div className="campo campo-comprobante" style={{ marginTop: '1rem' }}>
            <Box mb={2} >
              {openUploader && (
                <UploadFiles onFilesChange={handleFilesChange} isMultiple={false} message='Seleccione un documento' />
              )}
              <Box>
                <Grid item xs={12} md={6}>
                  <List dense={true}>
                    {selectedFile.map((file, index) =>
                      <ListItem key={index}
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
          </div>
        </div>
        <div className="columna-2">
          {userRole === 'admin' && (
            <>
              <div className="box-sustituto">
                <div className="campo campo-nombre-sustituto">
                  <Form.Item
                    name="selectSustituto"
                    label="Requiere sustituto"
                    rules={[{ required: true, message: 'Seleccione una opcion' }]}
                  >
                    <Select
                      placeholder="Sustitución"
                      value={sustitucion}
                      onChange={handleSustitucionChange}
                      style={{ width: 100 }}
                    >
                      <Option value="SI">SI</Option>
                      <Option value="NO">NO</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="progress-bar">
                  {mostrarProgress && <Progress percent={100} status="active" style={{ width: '290px' }} />}
                </div>
                {sustitucion === 'SI' && !mostrarProgress && (
                  <div className="campo">
                    <Form.Item
                      name="inputName"
                      label="Nombre del sustituto"
                      rules={[{ required: true, message: 'Seleccione el susutito' }]}
                    >
                      <Input
                        placeholder="Nombre del sustituto"
                        value={nombreSustituto}
                        onChange={(e) => setNombreSustituto(e.target.value)}
                        style={{ width: 290 }}
                      />
                    </Form.Item>
                  </div>
                )}
              </div>
              <div className="campo campo-tramitado">
                <Text>Tramitado por</Text>
                <Input placeholder="Tramitado por" value={nombreEncargado} style={{ width: 290 }} disabled />
              </div>
              <div className="campo campo-fecha-recibido">
                <Text>Fecha recibido</Text>
                <Input placeholder="Fecha recibido" value={fechaRecibido} style={{ width: 290 }} disabled />
              </div>
              <div className="campo campo-comentario">
                <Text>Comentario</Text>
                <TextArea placeholder="Comentario de Talento Humano" value={comentarioTalentoHumano} onChange={(e) => setComentarioTalentoHumano(e.target.value)} allowClear showCount maxLength={150} />
              </div>
              <div className="campo campo-estado">
                <Form.Item
                  name="selectEstado"
                  label="Seleccione un estado"
                  rules={[{ required: true, message: 'Seleccione un estado' }]}
                >
                  <Select placeholder="Estado" value={estado} onChange={handleEstadoChange} style={{ width: 110 }}>
                    <Option value="Aprobado">Aprobado</Option>
                    <Option value="Rechazado">Rechazada</Option>
                    <Option value="Pendiente">Pendiente</Option>
                  </Select>
                </Form.Item>
              </div>
            </>
          )}
        </div>
        <Form.Item>
          <Button
            className='button-submit'
            type="primary"
            htmlType="submit"
            style={{ marginTop: 8 }}
            loading={enviandoSolicitud.loading}
            disabled={enviandoSolicitud.isDisabled}
          >
            {enviandoSolicitud.buttonText}
          </Button>
        </Form.Item>
      </div>
    </Form>
  </div>

);
}

export default Formulario;
