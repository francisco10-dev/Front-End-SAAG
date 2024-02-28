import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { Expediente } from '../../../services/expediente.service';
import { calcularAntiguedad } from './period';

interface Props {
  expediente: Expediente;
}

const Info: React.FC<Props> = ({ expediente }: Props) => {
  const colaborador = expediente.colaborador;
  const puesto = colaborador.puesto;
  const excludedProperties = ['fotoCarnet', 'idColaborador', 'idPuesto'];
  const fechaIngreso =  expediente.fechaIngreso;

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
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const periodoEnEmpresa = calcularAntiguedad(new Date(fechaIngreso), new Date());

  return (
    <Box>
      <Grid container spacing={2}>
        {Object.entries(colaborador).map(([key, value]) => (
          !excludedProperties.includes(key) && (
            <Grid item xs={12} sm={6} md={6} key={key} >
              <Typography variant="body2">
                {visualNames[key]}:
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
        <Grid item xs={12} sm={6} md={6} key="periodoEnEmpresa" >
          <Typography variant="body2">
            Periodo en la organización:
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {periodoEnEmpresa}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Info;
