import './form.css';
import React, { useState } from 'react';
import { Input, Select, DatePicker, Typography, Progress } from 'antd';
import Button from '@mui/material/Button';
import { colors } from '@mui/material';

const { Option } = Select;
const { TextArea } = Input;
const { Text, Link } = Typography;

const Form = () => {
  const [tipoSolicitud, setTipoSolicitud] = useState('');
  const [asunto, setAsunto] = useState('');
  const [goceSalarial, setGoce] = useState('');
  const [nombreColaborador, setNombreColaborador] = useState('');
  const [nombreEncargado, setNombreEncargado] = useState('');
  const [fechaSolicitud, setFechaSolicitud] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [horaInicio, setHoraInicio] = useState(null);
  const [horaFin, setHoraFin] = useState(null);
  const [sustitucion, setSustitucion] = useState('');
  const [nombreSustituto, setNombreSustituto] = useState('');
  const [estado, setEstado] = useState('');
  const [comentarioTalentoHumano, setComentarioTalentoHumano] = useState('');
  const [mostrarProgress, setMostrarProgress] = useState(false);

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
            <Option value="SI">SI</Option>
            <Option value="NO">NO</Option>
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
        <div className="fechas">
          <div className="campo">
            <DatePicker placeholder="Fecha de inicio" value={fechaInicio} onChange={handleFechaInicioChange} />
          </div>
          <div className="campo">
            <DatePicker placeholder="Fecha de fin" value={fechaFin} onChange={handleFechaFinChange} />
          </div>
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
            {mostrarProgress && <Progress percent={100} status="active" />}
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
        <Button className='button-submit' variant="contained" color="success">
          <Text className='text'>Enviar</Text>
        </Button>
      </div>
    </div>
  );
}

export default Form;
