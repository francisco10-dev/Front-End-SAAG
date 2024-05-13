import { differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';

export const calcularAntiguedad = (fechaIngreso: Date, fechaActual: Date) => {
  const diferenciaAnios = differenceInYears(fechaActual, fechaIngreso);
  const fechaUltimoAnio = new Date(fechaIngreso);
  fechaUltimoAnio.setFullYear(fechaUltimoAnio.getFullYear() + diferenciaAnios);
  const diferenciaMeses = differenceInMonths(fechaActual, fechaUltimoAnio);
  const fechaUltimoMes = new Date(fechaUltimoAnio);
  fechaUltimoMes.setMonth(fechaUltimoMes.getMonth() + diferenciaMeses);
  const diferenciaDias = differenceInDays(fechaActual, fechaUltimoMes);

  const meses = () => {
    if (diferenciaMeses > 0) {
      return `${diferenciaMeses} ${diferenciaMeses === 1 ? 'mes' : 'meses'}`;
    } else {
      return '';
    }
  }

  const dias = () => {
    if (diferenciaDias > 0) {
      return `${diferenciaDias} ${diferenciaDias === 1 ? 'día' : 'días'}`;
    } else {
      return '';
    }
  }

  const años = () => {
    if(diferenciaAnios > 0){
      return `${diferenciaAnios} ${diferenciaAnios === 1 ? 'año' : 'años'}`;
    }else{
      return '';
    }
  }

  const periodos = [años(), meses(), dias()].filter(texto => texto !== ''); // Filtra textos vacíos

  if (periodos.length === 0) {
    return 'Recién ingresado';
  }

  const periodoTexto = periodos.join(',');

  return periodoTexto;
};

export function calcularEdad(fechaNacimiento: Date): number {
  const fechaActual = new Date();
  return differenceInYears(fechaActual, fechaNacimiento);
}
