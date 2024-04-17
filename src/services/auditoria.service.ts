import axios from 'axios';
import axiosApi from '../services/api.service'

export interface Auditoria {
    idAuditoria: number;
    idUsuario:  number;
    nombreUsuario: string;
    rol: string;
    accion: string;
    nombre : string;
    datosAntiguos : Text;
    datosNuevos : Text;
    fecha: Date;
    direccionIp: string;
    agenteUsuario: string;
}

class AuditoriaService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axiosApi;
  }


  async getAuditorias(): Promise<Auditoria[]> {
    try {
      const response = await this.axiosInstance.get('/auditorias/');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 403) {
          throw new Error(error.response.data.message);
        } else {
          throw new Error('Error en la red');
        }
      }
      throw error;
    }
  }

  async getAuditoriaPorId(id: number): Promise<Auditoria | null> {
    try {
      const response = await this.axiosInstance.get(`/auditoria/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          return null; 
        }
        throw new Error(`Error ${error.response.status}: ${error.response.statusText}`);
      }
      throw error;
    }
  }

  async eliminarAuditoria(id: number): Promise<number> {
    try {
       const response = await this.axiosInstance.delete(`/eliminar-auditoria/${id}`);
       return response.status;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(`Error ${error.response.status}: ${error.response.statusText}`);
        } else {
          throw new Error('Error en la red');
        }
      }
      throw error;
    }
  }

  async eliminarAuditorias(ids: number[]): Promise<number[]> {
    const statuses: number[] = [];
  
    for (const id of ids) {
      try {
        const status = await this.eliminarAuditoria(id);
        statuses.push(status);
      } catch (error) {
        statuses.push(0); 
      }
    }
    return statuses;
  }
  
}

export default AuditoriaService;
