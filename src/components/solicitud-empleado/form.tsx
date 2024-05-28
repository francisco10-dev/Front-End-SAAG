import './form.css';
import { useState, useEffect } from 'react';
import { Input, Select, DatePicker, Typography, Progress, Checkbox, TimePicker, message, Form, Button } from 'antd';
import { Alert, Box, Grid, List, ListItem, IconButton, Avatar, ListItemAvatar, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import { useAuth } from '../../authProvider';
import moment from 'moment';
import ModalComponent from './modal';
import ColaboradorSelect, { ColaboradorOption } from './colaboradorSelect';
import SolicitudService from '../../services/solicitud.service';
import UploadFiles from '../expedientes/file/uploadFile';
import type { UploadFile } from 'antd/lib/upload/interface';
import ColaboradorNameSelect from './colaboradorSubstitute';
import days from 'dayjs';
const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const Formulario = () => {
  const { userRole, colaborador, nameSupervisor } = useAuth();
  const [idUsuario, setId] = useState('');
  const [tipoSolicitud, setTipoSolicitud] = useState('');
  const [asunto, setAsunto] = useState('');
  const [goceSalarial, setGoce] = useState("1");
  const [goceDisabled, setGoceDisabled] = useState(false);
  const [nombreColaborador, setNombreColaborador] = useState('');
  const [unidadColaborador, setUnidadColaborador] = useState('');
  const [nombreEncargado, setNombreEncargado] = useState('');
  const [nombreJefaturaInmediata, setNombreJefaturaInmediata] = useState('');
  const [fechaRecibido, setFechaRecibido] = useState<any>(null);
  let [fechaInicio, setFechaInicio] = useState<any>(null);
  let [fechaFin, setFechaFin] = useState<any>(null);
  const [horaInicio, setHoraInicio] = useState<any>(null);
  const [horaFin, setHoraFin] = useState<any>(null);
  const [esRangoHoras, setEsRangoHoras] = useState<boolean>(false);
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
  const [_userSelect, setUserSelect] = useState<ColaboradorOption | null>(null);
  const [form] = Form.useForm();
  const dateFormat = 'DD/MM/YYYY';
  const [userChoiceDocument, setUserChoiceDocument] = useState<string>('0'); // Cambiado a string
  const [diferencia, setDiferencia] = useState<any>(null);
  const now = days();
  useEffect(() => {
    if (userRole === "admin") {
      setShowModal(true);
    } else {
      recuperarDatos();
    }
    console.log(userChoice)
  }, []);

  const handleAdminChoice = (choice: string | null) => {
    setShowModal(false);
    setUserChoice(choice);
    if (choice === 'solicitudPropia') {
      setFechaRecibido(moment().format('DD-MM-YYYY'));
      recuperarDatos();
      if (colaborador) {
        setNombreEncargado(colaborador.nombre);
      }
    } else {
      setFechaRecibido(moment().format('DD-MM-YYYY'));
      if (colaborador) {
        setNombreEncargado(colaborador.nombre);
      }
    }
  };

  const handleFechaInicioChange = (date: any) => {
    setFechaInicio(date.format());
  };

  const handleUserChoiceDocument = (value: string) => {
    setUserChoiceDocument(value);
  };

  const handleFechaFinChange = (date: any) => {
    setFechaFin(date.format());
  };

  const reset = () => {
    setOpenUploader(true);
    setSelectedFile([]);
  }

  const handleHoraInicioChange = (time: any) => {
    setHoraInicio(time.format('HH:mm:ss'));
    if (horaFin && time && time.isAfter(horaFin, 'second')) {
      setHoraFin(null);
    }
  };

  const disabledHours = () => {
    if (horaInicio) {
      const horaInicioHour = days(horaInicio, 'HH:mm').hour();
      return [horaInicioHour,...Array(horaInicioHour).keys()];
    }
    return [];
  };

  const handleHoraFinChange = (time: any) => {
    setHoraFin(time.format('HH:mm:ss'));
  };

  const handleCheckboxChange = (e: any) => {
    setEsRangoHoras(e.target.checked);
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

  const handleButtonClick = () => {
    setShowModal(true);
  };

  const handleTipoSolicitudChange = (value: any) => {
    setTipoSolicitud(value);
    handleGoceChangeDisabled(value);
  };

  const handleGoceChangeDisabled = (value: any) => {
    if (value === "Vacaciones" || value === "Licencias" || value === "Incapacidad") {
      form.setFieldsValue({ goce_salarial: "1" });
      setGoce("1");
      setGoceDisabled(true);
    } else if (value === "Injustificada") {
      setGoce("0");
      setGoceDisabled(true);
      form.setFieldsValue({ goce_salarial: "0" });
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

  let alerta = (type: "success" | "error" | undefined, content: string) => {
    messageApi.open({
      type: type,
      content: content,
    });
    return null;
  }

  const validarFecha = (fecha: any) => {
    console.log(fecha);
    let diffValid = true;
    if (userRole !== "admin") {
      if (fecha) {
        const selectedDate = days(fecha); 
        const futureDate = days().add(7, 'days').startOf('day'); 
        if (selectedDate >= futureDate) {
          alerta('success', 'La fecha es válida (cumple con el mínimo de 7 días de anticipación)');
        } else {
          diffValid = false;
          alerta('error', 'La fecha no es válida (la solicitud debe hacerse con un mínimo de 7 días de anticipación)');
        }
      }
    } else {
      alerta('success', 'Como administrador no tiene restricciones en el ingreso de fechas');
    }
    setDiferencia(diffValid)
  };

  const handleSelect = (option: ColaboradorOption) => {
    setUserSelect(option);
    setNombreColaborador(option.colaborador.nombre);
    setUnidadColaborador(option.colaborador?.puesto?.nombrePuesto ?? 'Default Unidad');
    setId(option.colaborador?.idColaborador.toString());
    setNombreJefaturaInmediata(option.supervisor?.nombre ?? '');
  };

  const resetDates = () => {
    setFechaInicio(now)
    setFechaFin(now);
  }
  const [enviandoSolicitud, setEnviandoSolicitud] = useState(
    {
      loading: false,
      buttonText: "Enviar",
      isDisabled: false
    }
  );

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

  const resetAll = () => {
    form.resetFields();
    resetDates();
    setDiferencia(0);
    reset();
  }

  const validacionEstado = () => {
    let estadoValid;
    if (userRole === "empleado") {
      estadoValid = "Pendiente"
    } else if (userRole === "supervisor") {
      estadoValid = "AprobadoPorJefatura"
    } else {
      estadoValid = estado;
    }
    return estadoValid;
  }

  const preparedFormData = () => {
    const fechaSolicitud = now.toString();
    let fechaRecibido = (userRole === "admin") ? now.toString() : '';
    const estadoSend = validacionEstado();
    const formData = new FormData();
    formData.append('conGoceSalarial', goceSalarial.toString());
    formData.append('tipoSolicitud', String(tipoSolicitud));
    formData.append('asunto', String(asunto));
    formData.append('nombreColaborador', String(nombreColaborador));
    formData.append('nombreEncargado', String(nombreEncargado));
    formData.append('fechaSolicitud', fechaSolicitud);
    formData.append('fechaInicio', fechaInicio?.toString() ?? now.format().toString());
    formData.append('fechaFin', fechaFin?.toString() ?? now.format().toString());
    if (fechaRecibido) {
      formData.append('fechaRecibido', fechaRecibido);
    }
    formData.append('horaInicio', horaInicio?.toString() ?? '');
    formData.append('horaFin', horaFin?.toString() ?? '');
    formData.append('sustitucion', String(sustitucion));
    formData.append('nombreSustituto', nombreSustituto);
    formData.append('estado', String(estadoSend));
    formData.append('comentarioTalentoHumano', String(comentarioTalentoHumano));
    if (selectedFile[0] && selectedFile[0].originFileObj) {
      formData.append('comprobante', selectedFile[0].originFileObj);
    } else if (selectedFile[0] instanceof File) {
      formData.append('comprobante', selectedFile[0]);
    }
    formData.append('idColaborador', String(idUsuario)); // Convertido a cadena
    return formData;
  }

  const enviarSolicitud = async () => {
    const formData = preparedFormData();
    try {
      estadoBtn();
      const solicitudService = new SolicitudService();
      const response = await solicitudService.agregarSolicitud(formData);
      console.log(response);
      alerta('success', 'La solicitud se ha procesado exitosamente.')
      resetAll();
    } catch (error) {
      alerta('error', 'La solicitud no se ha procesado correctamente.')
      console.error('Error al enviar la solicitud:', error);
      resetAll();
    }
  };

  return (
    <div className='box'>
      <Form form={form}
        initialValues={{
          range_picker: [
            now,
            now,
          ],
          goce_salarial: [
            goceSalarial
          ]
        }}
        action="/profile"
        method="post"
        encType="multipart/form-data"
        name="basic"
        onFinish={enviarSolicitud}
        layout="vertical"
      >
        {userRole === "admin" && (
          <>
            <Button
              className='button-modal'
              style={{ marginTop: 8, marginBottom: 5 }}
              onClick={handleButtonClick}
            >
              ¿Qué tipo de solicitud deseas agregar?
            </Button>
          </>
        )}
        <div>
          {showModal && <ModalComponent onAdminChoice={handleAdminChoice} />}
        </div>
        <Alert severity="error"><Text className='text'>Solicitud debe hacerse minimo con 7 días de anticipación.</Text></Alert>
        <img src="/logoACIB.png" alt="Logo" style={{ height: 50, width: 200 }}></img>
        <div className="contenedor-campos">
          <div className="columna-1">
            {userChoice === 'solicitudEmpleado' && (
              <div className="campo">
                <ColaboradorSelect onSelect={handleSelect} />
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
                  handleTipoSolicitudChange(value)
                  handleGoceChangeDisabled(value)
                }} style={{ width: 150 }}>
                  <Option value="Permisos">Permisos</Option>
                  <Option value="Licencias">Licencias</Option>
                  <Option value="Vacaciones">Vacaciones</Option>
                  <Option value="Incapacidad">Incapacidad</Option>
                  {userRole === 'admin' && (
                    <Option value="Injustificada">Injustificada</Option>
                  )}
                </Select>
              </Form.Item>
            </div>
            <div className="campo campo-goce">
              <Form.Item
                name="goce_salarial"
                label="Goce salarial"
                rules={[{ required: true, message: 'Seleccione' }]}
              >
                <Select placeholder="Con goce salarial"
                  value={goceSalarial} onChange={handleGoceChange} disabled={goceDisabled} style={{ width: 150 }}>
                  {tipoSolicitud === "Injustificada" ? (
                    <Option value="0" disabled={true}>NO</Option>
                  ) : (
                    <>
                      <Option value="1">SI</Option>
                      <Option value="0">NO</Option>
                    </>
                  )}
                </Select>
              </Form.Item>
            </div>
            <div className='campo'>
              {contextHolder}
              <Form.Item
                name="range_picker"
                label="Seleccione las fechas"
                rules={[{ required: true, message: 'Seleccione las fechas' }]}
              >
                <RangePicker
                  format={dateFormat}
                  placeholder={['Fecha de inicio', 'Fecha de fin']}
                  value={[fechaInicio, fechaFin]}
                  hideDisabledOptions
                  disabledDate={userRole !== "admin" ? (current) => {
                    const sevenDaysAhead = days().add(7, 'days').startOf('day');
                    return current && current < sevenDaysAhead;
                  } : undefined}
                  onChange={(dates: any) => {
                    handleFechaInicioChange(dates[0]);
                    validarFecha(dates[0]);
                    handleFechaFinChange(dates[1]);
                  }}
                />
              </Form.Item>
            </div>
            <div>
              <div className="campo">
                <Checkbox checked={esRangoHoras} onChange={handleCheckboxChange}>
                  Rango de horas
                </Checkbox>
              </div>
              {esRangoHoras && (
                <div className='hora'>
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
                        disabledHours={disabledHours}
                        hideDisabledOptions
                      />
                    </Form.Item>
                  </div>
                </div>
              )}
            </div>
            <div className="campo campo-asunto">
              <Text>Asunto</Text>
              <TextArea
                placeholder="Asunto"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                allowClear
                showCount
                maxLength={30}
                autoSize={{ minRows: 2, maxRows: 6 }}
                style={{ zIndex: 0 }}
              />
            </div>
            <div className="campo campo-jefaura">
              <Text>Nombre supervisor</Text>
              <Input placeholder="Nombre supervisor" value={nombreJefaturaInmediata} onChange={(e) => setNombreJefaturaInmediata(e.target.value)} style={{ width: 290 }} disabled />
            </div>
            <div className="campo">
              <Form.Item
                name="subirComprobante"
                label="¿Desea adjuntar comprobante?"
                rules={[{ required: true, message: 'Seleccione' }]}
              >
                <Select placeholder="Seleccione" value={userChoiceDocument} onChange={handleUserChoiceDocument} style={{ width: 150 }}>
                  <Option value="1">SI</Option>
                  <Option value="0">NO</Option>
                </Select>
              </Form.Item>
            </div>
            {userChoiceDocument === "1" && (
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
            )}
          </div>
          <div className="columna-2">
            {userRole === 'admin' && (
              <>
                <div className="box-sustituto">
                  <div className="campo campo-nombre-sustituto">
                    <Form.Item
                      name="selectSustitucion"
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
                      <ColaboradorNameSelect onSelect={(name) => setNombreSustituto(name)} />
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
                  <TextArea
                    placeholder="Comentario de Talento Humano"
                    value={comentarioTalentoHumano}
                    onChange={(e) => setComentarioTalentoHumano(e.target.value)}
                    allowClear
                    showCount
                    maxLength={150}
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    style={{ zIndex: 0 }}
                  />
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
              disabled={enviandoSolicitud.isDisabled || (userRole != "admin" && !diferencia)}
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
