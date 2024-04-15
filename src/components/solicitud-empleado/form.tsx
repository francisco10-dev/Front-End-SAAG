import './form.css';
import { useState, useEffect } from 'react';
import { Input, Select, DatePicker, Typography, Progress, Checkbox, TimePicker } from 'antd';
import Button from '@mui/material/Button';
import { useAuth } from '../../authProvider';
import { toast } from 'react-toastify';
import moment from 'moment';
import SolicitudService from '../../services/solicitud.service';
const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const Form = () => {
  const { userRole, colaborador,nameSupervisor } = useAuth();
  const [idUsuario, setId] = useState('');
  const [tipoSolicitud, setTipoSolicitud] = useState('');
  const [asunto, setAsunto] = useState('');
  const [goceSalarial, setGoce] = useState('');
  const [goceDisabled, setGoceDisabled] = useState<any>(null);
  const [nombreColaborador, setNombreColaborador] = useState('');
  const [unidadColaborador, setUnidadColaborador] = useState('');
  const [nombreEncargado, setNombreEncargado] = useState('');
  //@ts-ignore
  const [fechaSolicitud, setFechaSolicitud] = useState(null);
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

  useEffect(() => {
    // Lógica para recuperar los datos y establecer el nombre del colaborador
    recuperarDatos();
  }, []); // El segundo argumento del useEffect es un array vacío para que se ejecute solo una vez al montar el componente

  //@ts-ignore
  const handleChange = (event: any) => {
    // Lógica para manejar cambios en el input si es necesario
    setNombreColaborador(event.target.value);
  };

  const handleTipoSolicitudChange = (value: any) => {
    setTipoSolicitud(value);
  };
  //@ts-ignore
  const handleFechaSolicitudChange = (date: any) => {
    setFechaSolicitud(date);
  };

  const handleFechaInicioChange = (date: any) => {
    setFechaInicio(date);
  };

  const handleFechaFinChange = (date: any) => {
    setFechaFin(date);
  };

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
      }, 350); // Cambiado a 500 milisegundos
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
      setNombreEncargado(nameSupervisor??"");
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

  const [enviandoSolicitud, setEnviandoSolicitud] = useState(false); // Nuevo estado para el estado de envío de la solicitud

  const enviarSolicitud = async () => {
    const fechaSolicitud = new Date(); // Esto creará un nuevo objeto Date con la fecha y hora actuales
    const fechaSolicitudFormateada = moment(fechaSolicitud, "DD-MM-YYYY").format("YYYY-MM-DD");
    const fechaInicioFormateada = formatearFecha(fechaInicio);
    const fechaFinFormateada = formatearFecha(fechaFin);
    const horaInicioFormateada = formatearHora(horaInicio); // Agrega segundos si son necesarios
    const horaFinFormateada = formatearHora(horaFin); // Agrega segundos
    const goceSalarialFormat = parseInt(goceSalarial); // Parsea la cadena "1" a un número
    setEnviandoSolicitud(true); // Establecer el estado de envío a true
    const nuevaSolicitud = {
      // Crear objeto de solicitud con los datos del formulario
      idSolicitud: null, // Esto podría ser un valor predeterminado o nulo, dependiendo de cómo manejes las solicitudes nuevas
      conGoceSalarial: goceSalarialFormat,
      tipoSolicitud: tipoSolicitud,
      asunto: asunto,
      nombreColaborador: nombreColaborador,
      nombreEncargado: nombreEncargado,
      fechaSolicitud: fechaSolicitudFormateada,
      fechaInicio: fechaInicioFormateada,
      fechaFin: fechaFinFormateada,
      horaInicio: horaInicioFormateada,
      horaFin: horaFinFormateada,
      sustitucion: sustitucion,
      nombreSustituto: nombreSustituto,
      estado: estado,
      comentarioTalentoHumano: comentarioTalentoHumano,
      idColaborador: idUsuario // Asegúrate de proporcionar el id del colaborador aquí
    };

    try {
      // Llamar al método de envío de solicitud de tu servicio de solicitud
      console.log(nuevaSolicitud);
      const solicitudService = new SolicitudService();
      const response = await solicitudService.agregarSolicitud(nuevaSolicitud);
      console.log(response);
      toast.success('La solicitud se ha procesado exitosamente.');
      limpiarFormulario();
      // Manejar el éxito (p. ej., limpiar el formulario)
      setEnviandoSolicitud(false); // Establecer el estado de envío a false
      // Limpia el formulario, muestra una notificación, redirige, etc.
    } catch (error) {
      // Manejar el error (p. ej., mostrar un mensaje de error)
      console.error('Error al enviar la solicitud:', error);
      setEnviandoSolicitud(false); // Establecer el estado de envío a false
      // Muestra una notificación de error, etc.
    }
  };


  return (
    <div className='box'>
      <div className="contenedor-campos">
        <div className="columna-1">
          <div className="campo">
            <Text>Nombre colaborador</Text>
            <Input placeholder="Nombre colaborador" value={nombreColaborador} className="inputWidth" style={{ width: 290 }} disabled />
          </div>
          <div className="campo">
            <Text>Unidad a la que pertenece</Text>
            <Input placeholder="Unidad colaborador" value={unidadColaborador} className="inputWidth" style={{ width: 290 }} disabled />
          </div>
          <div className='campo campo-tipo'>
            <Text>Tipo</Text>
            <Select showSearch placeholder="Tipo de solicitud" value={tipoSolicitud} onChange={(value) => {
              handleTipoSolicitudChange(value);
              handleGoceChangeDisabled(value);
            }} style={{ width: 150 }}>
              <Option value="Permisos">Permisos</Option>
              <Option value="Licencias">Licencias</Option>
              <Option value="Vacaciones">Vacaciones</Option>
            </Select>
          </div>
          <div className="campo campo-goce">
            <Text>Goce salarial</Text>
            <Select placeholder="Con goce salarial" value={goceSalarial} onChange={handleGoceChange} disabled={goceDisabled} style={{ width: 100 }}>
              <Option value="1">SI</Option>
              <Option value="0">NO</Option>
            </Select>
          </div>
          <div>
            <div className="campo">
              <Checkbox checked={esRangoDias} onChange={handleCheckboxChange}>
                Rango de horas
              </Checkbox>
            </div>
            {!esRangoDias ? (
              <div>
                <RangePicker
                  placeholder={['Fecha de inicio', 'Fecha de fin']}
                  value={[fechaInicio, fechaFin]}
                  onChange={(dates: any) => {
                    handleFechaInicioChange(dates[0]);
                    handleFechaFinChange(dates[1]);
                  }}
                />
              </div>
            ) : (
              <div className='hora'>
                <RangePicker
                  placeholder={['Fecha de inicio', 'Fecha de fin']}
                  value={[fechaInicio, fechaFin]}
                  onChange={(dates: any) => {
                    handleFechaInicioChange(dates[0]);
                    handleFechaFinChange(dates[1]);
                  }}
                />
                <div className='horas'>
                  <TimePicker
                    placeholder="Hora de inicio"
                    value={horaInicio}
                    onChange={handleHoraInicioChange}
                    format="HH:mm"
                    style={{ marginRight: '5px' }} />
                  <TimePicker
                    placeholder="Hora de fin"
                    value={horaFin}
                    onChange={handleHoraFinChange}
                    format="HH:mm"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="campo campo-asunto">
            <Text>Asunto</Text>
            <TextArea placeholder="Asunto" value={asunto} onChange={(e) => setAsunto(e.target.value)} allowClear />
          </div>
        </div>
        <div className="columna-2">
          <div className="campo campo-encargado">
            <Text>Nombre encargado</Text>
            <Input placeholder="Nombre encargado" value={nombreEncargado} onChange={(e) => setNombreEncargado(e.target.value)} style={{ width: 290 }} disabled />
          </div>
          {userRole === 'admin' && (
            <>
              <div className="box-sustituto">
                <div className="campo campo-nombre-sustituto">
                  <Text>Requiere sustituto</Text>
                  <Select
                    placeholder="Sustitución"
                    value={sustitucion}
                    onChange={handleSustitucionChange}
                    style={{ width: 100 }}
                  >
                    <Option value="SI">SI</Option>
                    <Option value="NO">NO</Option>
                  </Select>
                </div>
                <div className="progress-bar">
                  {mostrarProgress && <Progress percent={100} status="active" style={{ width: '290px' }} />}
                </div>
                {sustitucion === 'SI' && !mostrarProgress && (
                  <div className="campo">
                    <Text>Nombre del sustituto</Text>
                    <Input
                      placeholder="Nombre del sustituto"
                      value={nombreSustituto}
                      onChange={(e) => setNombreSustituto(e.target.value)}
                      style={{ width: 290 }}
                    />
                  </div>
                )}
              </div>
              <div className="campo campo-tramitado">
                <Text>Tramitado por</Text>
                <Input placeholder="Tramitado por" value={unidadColaborador} style={{ width: 290 }} disabled />
              </div>
              <div className="campo campo-fecha-recibido">
                <Text>Fecha recibido</Text>
                <Input placeholder="Fecha recibido" value={unidadColaborador} style={{ width: 290 }} disabled />
              </div>
              <div className="campo campo-comentario">
                <Text>Comentario</Text>
                <TextArea placeholder="Comentario de Talento Humano" value={comentarioTalentoHumano} onChange={(e) => setComentarioTalentoHumano(e.target.value)} allowClear />
              </div>
              <div className="campo campo-estado">
                <Text>Estado</Text>
                <Select placeholder="Estado" value={estado} onChange={handleEstadoChange} style={{ width: 110 }}>
                  <Option value="Aprobado">Aprobado</Option> {/*el admin es el unico que puede aprobar solicitudes */}
                  {/*<Option value="Pendiente">Aprobar</Option> */}  {/*el supervisor aprueba una solicud para enviarla a admin */}
                  <Option value="Rechazado">Rechazada</Option> {/* Rezachazada se muestra para seleccionar a admin y supervisor */}
                </Select>
              </div>
            </>
          )}
        </div>
        <Button
          className='button-submit'
          variant="contained"
          color="success"
          style={{ marginTop: 8 }}
          onClick={enviarSolicitud} // Llama a la función enviarSolicitud cuando se hace clic en el botón
          disabled={enviandoSolicitud} // Deshabilita el botón mientras se está enviando la solicitud
        >
          <Text className='text'>Enviar</Text>
        </Button>
      </div>
    </div>
  );
}

export default Form;
