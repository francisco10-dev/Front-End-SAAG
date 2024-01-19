import axios from 'axios';
import axiosApi from '../services/api.service'

export interface AuditoriaLogin {
    idAuditoria: number;
    nombreUsuario: string;
    exito : boolean;
    fechaLogin: Date;
    fechaLogout: Date;
    token: string;
    direccionIp: string;
    agenteUsuario: string;
}

class AuditoriaLoginService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axiosApi;
  }


  async getAuditoriasLogin(): Promise<AuditoriaLogin[]> {
    try {
      const response = await this.axiosInstance.get('/auditoriaslogin/');
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

  async getAuditoriaLoginPorId(id: number): Promise<AuditoriaLogin | null> {
    try {
      const response = await this.axiosInstance.get(`/auditorialogin/${id}`);
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

  async eliminarAuditoriaLogin(id: number): Promise<number> {
    try {
       const response = await this.axiosInstance.delete(`/eliminar-auditorialogin/${id}`);
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

  async eliminarAuditoriasLogin(ids: number[]): Promise<number[]> {
    const statuses: number[] = [];
  
    for (const id of ids) {
      try {
        const status = await this.eliminarAuditoriaLogin(id);
        statuses.push(status);
      } catch (error) {
        statuses.push(0); 
      }
    }
    return statuses;
  }
  
}

export default AuditoriaLoginService;
