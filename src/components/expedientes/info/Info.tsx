import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { calcularAntiguedad, calcularEdad } from './period';
import { formatDate } from '../../solicitudes/utils';
import { Colaborador } from '../../../services/colaborador.service';
import { useAuth } from '../../../authProvider';
import { Puesto } from '../../../services/puesto.service';

interface Props {
  colaborador: Colaborador | null;
  size: number;
  marginBottom: number;
}

const Info: React.FC<Props> = ({ colaborador, size, marginBottom }: Props) => {

  const { userRole } = useAuth();

  if (!colaborador) {
    return <div>Expediente no disponible</div>;
  };

  const validate = (value: string) => {
    return userRole === 'empleado' ? value : null;
  };

  const { puesto, fechaIngreso, fechaSalida } = colaborador || {};
  const excludedProperties = [
    'fotoCarnet', 
    'idColaborador',
    'idPuesto',
    'nombre',
    'unidad',
    'puesto',
    'fechaIngreso',
    'fechaSalida',
    'idColaborador_fk',
    'supervisor',
    validate('tipoJornada'),
    validate('estado')
  ];

  const visualNames: { [key: string]: string } = {
    idColaborador: 'ID Colaborador',
    identificacion: 'Identificación',
    nombre: 'Nombre',
    correoElectronico: 'Correo',
    edad: 'Edad',
    domicilio: 'Domicilio',
    fechaNacimiento: 'Fecha de Nacimiento',
    unidad: 'Unidad de gestión',
    idPuesto: 'ID Puesto',
    puesto: 'Puesto',
    estado: 'Estado',
    equipo: 'Equipo',
    tipoJornada: 'Jornada'
  };

  const renderValue = (key: string, value: any, puesto: Puesto | null | undefined) => {
    if (key === 'puesto' && puesto) {
      return puesto.nombrePuesto;
    } else if (key === 'fechaNacimiento') {
      return formatDate(value as string);
    } else if (value === null) {
      return 'No indica';
    } else if (typeof value === 'object') {
      return JSON.stringify(value);
    } else {
      return value;
    }
  };

  const renderDateFields = () => {
    if (userRole !== 'empleado') {

      const desde = new Date(fechaIngreso);
      const hasta = colaborador.fechaSalida ? new Date(colaborador.fechaSalida) : new Date();
      const periodoEnEmpresa = calcularAntiguedad(desde, hasta);

      return (
        <>
          <Grid item xs={12} sm={6} md={size} key="fechaIngreso" >
            <Typography variant="body2">
              Fecha de ingreso
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {formatDate(fechaIngreso)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={size} key="periodoEnEmpresa" >
            <Typography variant="body2">
              Periodo en la organización
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {periodoEnEmpresa}
            </Typography>
          </Grid>
          {fechaSalida && (
            <Grid item xs={12} sm={6} md={size} key="fechaSalida" >
              <Typography variant="body2">
                Fecha de salida
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {fechaSalida ? formatDate(fechaSalida) : 'No indica'}
              </Typography>
            </Grid>
          )}
        </>
      );
    }
    return null;
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {Object.entries(colaborador).map(([key, value]) => (
          !excludedProperties.includes(key) && (
            <Grid item xs={12} sm={6} md={size} key={key} marginBottom={marginBottom} >
              <Typography variant="body2">
                {visualNames[key]}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {renderValue(key, value, puesto)}
              </Typography>
            </Grid>
          )
        ))}
        {renderDateFields()}
        <Grid item xs={12} sm={6} md={size} key="edad" >
          <Typography variant="body2">
            Edad
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {calcularEdad(colaborador.fechaNacimiento) + ' años'}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Info;
