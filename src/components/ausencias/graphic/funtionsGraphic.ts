  const IndicadorDiurnoPorFecha = (fechaInicio: string, fechaFin: string, cantidadActivos: number) => {
    const fechaInicioMs = new Date(fechaInicio).getTime();
    const fechaFinMs = new Date(fechaFin).getTime();
    const diferenciaMs = fechaFinMs - fechaInicioMs;
    const diferenciaDias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
    const diferenciaDiasCorregido = diferenciaDias + 1;
    const horasNoTrabajadas = diferenciaDiasCorregido * 8;
    const horasContratadasDiurnas = 240;
    const totalHorasTrabajadas = horasContratadasDiurnas * cantidadActivos;
    const indicador = (horasNoTrabajadas / totalHorasTrabajadas) * 100;
    return indicador;
  };
  const IndicadorDiurnoPorHora = (horaInicio: string, horaFin: string, cantidadActivos: number) => {
    const [horaInicioHora, horaInicioMinuto, horaInicioSegundo] = horaInicio.split(':').map(Number);
    const [horaFinHora, horaFinMinuto, horaFinSegundo] = horaFin.split(':').map(Number);
    const diferenciaHora = horaFinHora - horaInicioHora;
    const diferenciaMinuto = horaFinMinuto - horaInicioMinuto;
    const diferenciaSegundo = horaFinSegundo - horaInicioSegundo;
    const diferenciaTotalSegundos = (diferenciaHora * 3600) + (diferenciaMinuto * 60) + diferenciaSegundo;
    const horasNoTrabajadas = diferenciaTotalSegundos / 3600;
    const horasContratadasDiurnas = 240;
    const totalHorasTrabajadas = horasContratadasDiurnas * cantidadActivos;
    const indicador = (horasNoTrabajadas / totalHorasTrabajadas) * 100;
    return indicador;
  };

  const IndicadorNocturnoPorFecha = (fechaInicio: string, fechaFin: string, cantidadActivos: number) => {
    const fechaInicioMs = new Date(fechaInicio).getTime();
    const fechaFinMs = new Date(fechaFin).getTime();
    const diferenciaMs = fechaFinMs - fechaInicioMs;
    const diferenciaDias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
    const diferenciaDiasCorregido = diferenciaDias + 1;
    const horasNoTrabajadas = diferenciaDiasCorregido * 6;
    const horasContratadasNocturnas = 180;
    const totalHorasTrabajadas = horasContratadasNocturnas * cantidadActivos;
    const indicador = (horasNoTrabajadas / totalHorasTrabajadas) * 100;
    return indicador;
  };

  const IndicadorNocturnoPorHora = (horaInicio: string, horaFin: string, cantidadActivos: number) => {
    const [horaInicioHora, horaInicioMinuto, horaInicioSegundo] = horaInicio.split(':').map(Number);
    const [horaFinHora, horaFinMinuto, horaFinSegundo] = horaFin.split(':').map(Number);
    const diferenciaHora = horaFinHora - horaInicioHora;
    const diferenciaMinuto = horaFinMinuto - horaInicioMinuto;
    const diferenciaSegundo = horaFinSegundo - horaInicioSegundo;
    const diferenciaTotalSegundos = (diferenciaHora * 3600) + (diferenciaMinuto * 60) + diferenciaSegundo;
    const horasNoTrabajadas = diferenciaTotalSegundos / 3600;
    const horasContratadasNocturnas = 180;
    const totalHorasTrabajadas = horasContratadasNocturnas * cantidadActivos;
    const indicador = (horasNoTrabajadas / totalHorasTrabajadas) * 100;
    return indicador;
  };


  export { IndicadorDiurnoPorFecha, IndicadorDiurnoPorHora, IndicadorNocturnoPorFecha, IndicadorNocturnoPorHora };
