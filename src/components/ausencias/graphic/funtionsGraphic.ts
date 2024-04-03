const IndicadorDiurnoPorFecha = (fechaInicio: string, fechaFin: string, cantidadActivos: number) => {
    //console.log(`la Fecha de inicio es ${fechaInicio} y la fecha de fin es ${fechaFin}`);
    console.log(`la cantidad de colaboradores es: ${cantidadActivos}`);
    const fechaInicioMs = new Date(fechaInicio).getTime();
    const fechaFinMs = new Date(fechaFin).getTime();
    const diferenciaMs = fechaFinMs - fechaInicioMs;
    const diferenciaDias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
    //console.log(`la diferecia de dis es ${diferenciaDias}`);
    const diferenciaDiasCorregido = diferenciaDias + 1;
    //console.log(`la diferecia de dis es ${diferenciaDiasCorregido}`);
    const horasNoTrabajadas = diferenciaDiasCorregido * 8;
    //console.log(`las horas no trabajadas ${horasNoTrabajadas}`);
    const horasContratadasDiurnas = 240;
    const totalHorasTrabajadas = horasContratadasDiurnas * cantidadActivos;
    //console.log(`totalHorasTrabajadas ${totalHorasTrabajadas}`);
    const indicador = (horasNoTrabajadas / totalHorasTrabajadas) * 100;
    //console.log(`indicador es ${indicador}`)
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

  export { IndicadorDiurnoPorFecha, IndicadorDiurnoPorHora };
