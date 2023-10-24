import axios from 'axios';

export interface Solicitud {
    idSolicitud: number;
    conGoceSalarial: boolean;
    tipoSolicitud: string;
    asunto?: any;
    nombreColaborador: string;
    nombreEncargado?: any;
    fechaSolicitud: string;
    fechaInicio?: any;
    fechaFin?: any;
    horaInicio?: any;
    horaFin?: any;
    sustitucion: string;
    nombreSustituto: string;
    estado: string;
    comentarioTalentoHumano: string;
    idColaborador: number;
}

class SolicitudService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:3000/saag',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async agregarSolicitud(data: any): Promise<Solicitud> {
    try {
      const response = await this.axiosInstance.post('/agregar-solicitud/', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(`Error ${error.response.status}: ${error.response.statusText}`);
        } else {
          throw new Error('Error en la solicitud de red');
        }
      }
      throw error;
    }
  }

  async getSolicitudes(): Promise<Solicitud[]> {
    try {
      const response = await this.axiosInstance.get('/solicitudes/');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(`Error ${error.response.status}: ${error.response.statusText}`);
        } else {
          throw new Error('Error en la solicitud de red');
        }
      }
      throw error;
    }
  }

  async getSolicitudPorId(id: number): Promise<Solicitud | null> {
    try {
      const response = await this.axiosInstance.get(`/solicitud/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          return null; // La solicitud no se encontró
        }
        throw new Error(`Error ${error.response.status}: ${error.response.statusText}`);
      }
      throw error;
    }
  }

  async actualizarSolicitud(id: number, data: any): Promise<Solicitud> {
    try {
      const response = await this.axiosInstance.put(`/actualizar-solicitud/${id}`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(`Error ${error.response.status}: ${error.response.statusText}`);
        } else {
          throw new Error('Error en la solicitud de red');
        }
      }
      throw error;
    }
  }

  async eliminarSolicitud(id: number): Promise<void> {
    try {
      await this.axiosInstance.delete(`/eliminar-solicitud/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(`Error ${error.response.status}: ${error.response.statusText}`);
        } else {
          throw new Error('Error en la solicitud de red');
        }
      }
      throw error;
    }
  }
}

export default SolicitudService;
