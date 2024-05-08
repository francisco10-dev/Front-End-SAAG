import axios from 'axios';
import axiosApi from '../services/api.service'
import { Colaborador } from './colaborador.service';

export interface Solicitud {
    idSolicitud: number;
    conGoceSalarial: boolean;
    tipoSolicitud: string;
    asunto?: any;
    nombreColaborador: string;
    nombreEncargado?: any;
    fechaSolicitud: string;
    fechaInicio?: string;
    fechaFin?: string;
    fechaRecibido: string;
    horaInicio?: string;
    horaFin?: string;
    sustitucion: string;
    nombreSustituto: string;
    estado: string;
    comentarioTalentoHumano: string;
    idColaborador: any;
    comprobante:Blob;
    colaborador: Colaborador;
}

class SolicitudService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axiosApi;
  }

  async agregarSolicitud(data: FormData): Promise<Solicitud> {
    try {
      const response = await this.axiosInstance.post('/agregar-solicitud/', data);
      return response.data;
    } catch (error) {
      console.log(error)
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
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 403) {
          throw new Error(error.response.data.message);
        } else {
          throw new Error('Error en la solicitud de red');
        }
      }
      throw error;
    }
  }

  async getSolicitudesPorSupervisor(idSupervisor: number): Promise<Solicitud[]> {
    try {
      const response = await this.axiosInstance.get(`/solicitudes-por-supervisor/${idSupervisor}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 403) {
          throw new Error(error.response.data.message);
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

  async actualizarSolicitud(id: number, data: FormData): Promise<Solicitud> {
    try {
      const response = await this.axiosInstance.put(`/actualizar-solicitud/${id}`, data);
      return response.data.solicitud;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log(error.response);
          throw new Error(`Error ${error.response.status}: ${error.response.statusText}`);
        } else {
          throw new Error('Error en la solicitud de red');
        }
      }
      throw error;
    }
  }

  async eliminarSolicitud(id: number): Promise<number> {
    try {
       const response = await this.axiosInstance.delete(`/eliminar-solicitud/${id}`);
       return response.status;
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

  async eliminarSolicitudes(ids: number[]): Promise<number[]> {
    const statuses: number[] = [];
  
    for (const id of ids) {
      try {
        await this.eliminarSolicitud(id);
      } catch (error) {
        statuses.push(id); 
      }
    }
    return statuses;
  }

  async getSolicitudesPorColaborador(id: number): Promise<Solicitud[]> {
    try {
      const response = await this.axiosInstance.get('/solicitudes-por-colaborador/'+id);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 403) {
          throw new Error(error.response.data.message);
        } else {
          throw new Error('Error en la solicitud de red');
        }
      }
      throw error;
    }
  }

  async getComprobante(id: number): Promise<Blob> {
    try {
      const response = await this.axiosInstance.get(`/obtener-comprobante/${id}`, {
        responseType: 'blob', // Configura el tipo de respuesta como blob para manejar datos binarios
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  
}

export default SolicitudService;
