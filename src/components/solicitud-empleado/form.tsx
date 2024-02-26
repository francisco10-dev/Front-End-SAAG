import './form.css';
import React, { useState } from 'react';
import { Input, Select, DatePicker, Typography, Progress, Checkbox, TimePicker } from 'antd';
import Button from '@mui/material/Button';
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment';
import SolicitudService from '../../services/solicitud.service';
const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const Form = () => {


  const [idUsuario, setId] = useState('');
  const [tipoSolicitud, setTipoSolicitud] = useState('');
  const [asunto, setAsunto] = useState('');
  const [goceSalarial, setGoce] = useState('');
  const [nombreColaborador, setNombreColaborador] = useState('');
  const [nombreEncargado, setNombreEncargado] = useState('');
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

  // const handleIdUsuarioChange = (value: any) => {
  //   setId(value);
  // };

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

  const handleGoceChange = (value: any) => {
    setGoce(value);
  };

  const handleEstadoChange = (value: any) => {
    setEstado(value);
  };

  const recuperarDatos = () => {
    const employee = localStorage.getItem('employee');
    if (employee) {
      const employeeParse = JSON.parse(employee);
      setId(employeeParse.idColaborador);
      setNombreColaborador(employeeParse.nombre);
    }
  }
  const limpiarFormulario = () => {
    setTipoSolicitud('');
    setAsunto('');
    setGoce('');
    setNombreColaborador('');
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

  const [enviandoSolicitud, setEnviandoSolicitud] = useState(false); // Nuevo estado para el estado de envío de la solicitud

  const enviarSolicitud = async () => {
    recuperarDatos();
    const fechaSolicitud = new Date(); // Esto creará un nuevo objeto Date con la fecha y hora actuales
    const fechaSolicitudFormateada = moment(fechaSolicitud, "DD-MM-YYYY").format("YYYY-MM-DD");
    const fechaInicioFormateada = moment(fechaInicio, "DD-MM-YYYY").format("YYYY-MM-DD");
    const fechaFinFormateada = moment(fechaFin, "DD-MM-YYYY").format("YYYY-MM-DD");
    const horaInicioFormateada = null; // Agrega segundos si son necesarios
    const horaFinFormateada = null; // Agrega segundos
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
            <Text type='secondary'>Nombre colaborador</Text>
            <Input placeholder="Nombre colaborador" value={nombreColaborador} onChange={(e) => setNombreColaborador(e.target.value)} className="inputWidth" style={{ width: 290 }} />
          </div>
          <div className="campo campo-goce">
            <Text type='secondary'>Goce salarial</Text>
            <Select placeholder="Con goce salarial" value={goceSalarial} onChange={handleGoceChange} style={{ width: 100 }}>
              <Option value="1">SI</Option>
              <Option value="0">NO</Option>
            </Select>
          </div>
          <div className='campo campo-tipo'>
            <Text type='secondary'>Tipo</Text>
            <Select showSearch placeholder="Tipo de solicitud" value={tipoSolicitud} onChange={handleTipoSolicitudChange} style={{ width: 150 }}>
              <Option value="Incapacidad">Incapacidad</Option>
              <Option value="CGS">CGS</Option>
              <Option value="SGS">SGS</Option>
              <Option value="Licencias">Licencias</Option>
              <Option value="Injustificada">Injustificada</Option>
            </Select>
          </div>
          <div>
            <Checkbox checked={esRangoDias} onChange={handleCheckboxChange}>
              Rango de horas
            </Checkbox>
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
                    format="HH:mm:ss"
                    style={{ marginRight: '5px' }} />
                  <TimePicker
                    placeholder="Hora de fin"
                    value={horaFin}
                    onChange={handleHoraFinChange}
                    format="HH:mm:ss"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="campo campo-asunto">
            <Text type='secondary'>Asunto</Text>
            <TextArea placeholder="Asunto" value={asunto} onChange={(e) => setAsunto(e.target.value)} allowClear />
          </div>
        </div>
        <div className="columna-2">
          <div className="campo campo-encargado">
            <Text type='secondary'>Nombre encargado</Text>
            <Input placeholder="Nombre encargado" value={nombreEncargado} onChange={(e) => setNombreEncargado(e.target.value)} style={{ width: 290 }} />
          </div>
          <div className="box-sustituto">
            <div className="campo campo-nombre-sustituto">
              <Text type='secondary'>Requiere sustituto</Text>
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
                <Text type='secondary'>Nombre del sustituto</Text>
                <Input
                  placeholder="Nombre del sustituto"
                  value={nombreSustituto}
                  onChange={(e) => setNombreSustituto(e.target.value)}
                  style={{ width: 290 }}
                />
              </div>
            )}
          </div>
          <div className="campo campo-estado">
            <Text type='secondary'>Estado</Text>
            <Select placeholder="Estado" value={estado} onChange={handleEstadoChange} style={{ width: 110 }}>
              <Option value="Activo">Aceptada</Option>
              <Option value="Inactivo">Rechazada</Option>
            </Select>
          </div>
          <div className="campo campo-comentario">
            <Text type='secondary'>Comentario</Text>
            <TextArea placeholder="Comentario de Talento Humano" value={comentarioTalentoHumano} onChange={(e) => setComentarioTalentoHumano(e.target.value)} allowClear />
          </div>
        </div>
        <Button
          className='button-submit'
          variant="contained"
          color="success"
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
