import { differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';

export const calcularAntiguedad = (fechaIngreso: Date, fechaActual: Date) => {
  const diferenciaAnios = differenceInYears(fechaActual, fechaIngreso);
  const fechaUltimoAnio = new Date(fechaIngreso);
  fechaUltimoAnio.setFullYear(fechaUltimoAnio.getFullYear() + diferenciaAnios);
  const diferenciaMeses = differenceInMonths(fechaActual, fechaUltimoAnio);
  const fechaUltimoMes = new Date(fechaUltimoAnio);
  fechaUltimoMes.setMonth(fechaUltimoMes.getMonth() + diferenciaMeses);
  const diferenciaDias = differenceInDays(fechaActual, fechaUltimoMes);

  const aniosTexto = diferenciaAnios > 0 ? `${diferenciaAnios} ${diferenciaAnios === 1 ? 'año' : 'años'}` : '';
  const mesesTexto = diferenciaMeses > 0 ? `${diferenciaMeses} ${diferenciaMeses === 1 ? 'mes' : 'meses'}` : '';
  const diasTexto = diferenciaDias > 0 ? `${diferenciaDias} ${diferenciaDias === 1 ? 'día' : 'días'}` : '';

  const periodos = [aniosTexto, mesesTexto, diasTexto].filter(texto => texto !== ''); // Filtra textos vacíos

  if (periodos.length === 0) {
    return 'Recién ingresado';
  }

  const periodoTexto = periodos.join(',');

  return periodoTexto;
};
