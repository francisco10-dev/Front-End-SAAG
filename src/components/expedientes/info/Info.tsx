import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { calcularAntiguedad, calcularEdad } from './period';
import { formatDate } from '../../solicitudes/utils';
import { Colaborador } from '../../../services/colaborador.service';

interface Props {
  colaborador: Colaborador | null;
  size: number;
  marginBottom: number;
}

const Info: React.FC<Props> = ({ colaborador, size, marginBottom }: Props) => {

  if (!colaborador) {
    return <div>Expediente no disponible</div>;
  }

  const { puesto, fechaIngreso, fechaSalida } = colaborador || {};
  const excludedProperties = ['fotoCarnet', 'idColaborador', 'idPuesto', 'nombre', 'unidad', 'puesto','fechaIngreso', 'fechaSalida' ];
  const periodoEnEmpresa = calcularAntiguedad(new Date(fechaIngreso), new Date());

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
                {key === 'puesto' && puesto
                  ? `${puesto.nombrePuesto}`
                  : key === 'fechaNacimiento'
                  ? formatDate(value as string)
                  : value === null
                  ? 'No indica'
                  : typeof value === 'object'
                  ? JSON.stringify(value)
                  : value}
              </Typography>
            </Grid>
          )
        ))}
        <Grid item xs={12} sm={6} md={size} key="edad" >
          <Typography variant="body2">
            Edad
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {calcularEdad(colaborador.fechaNacimiento) + ' años'}
          </Typography>
        </Grid>
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
              { fechaSalida? formatDate(fechaSalida) : 'No indica'}
            </Typography>
         </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Info;
