import axios from 'axios';
import axiosApi from '../services/api.service'

export interface Ausencia {
    idAusencia: number;
    fechaAusencia: any;
    fechaFin?: any;
    razon: any;
    nombreColaborador: string;
    idColaborador: number;
}

class AusenciaService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axiosApi;
  }

  async agregarAusencia(data: any): Promise<Ausencia> {
    try {
      const response = await this.axiosInstance.post('/agregar-ausencia/', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(`Error ${error.response.status}: ${error.response.statusText}`);
        } else {
          throw new Error('Error en la ausencia de red');
        }
      }
      throw error;
    }
  }

  async getAusencias(): Promise<Ausencia[]> {
    try {
      const response = await this.axiosInstance.get('/ausencias/');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 403) {
          throw new Error(error.response.data.message);
        } else {
          throw new Error('Error en la ausencia de red');
        }
      }
      throw error;
    }
  }

  async getAusenciaPorId(id: number): Promise<Ausencia | null> {
    try {
      const response = await this.axiosInstance.get(`/ausencia/${id}`);
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

  async actualizarAusencia(id: number, data: any): Promise<Ausencia> {
    try {
      const response = await this.axiosInstance.put(`/actualizar-ausencia/${id}`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(`Error ${error.response.status}: ${error.response.statusText}`);
        } else {
          throw new Error('Error en la ausencia de red');
        }
      }
      throw error;
    }
  }

  async eliminarAusencia(id: number): Promise<number> {
    try {
       const response = await this.axiosInstance.delete(`/eliminar-ausencia/${id}`);
       return response.status;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(`Error ${error.response.status}: ${error.response.statusText}`);
        } else {
          throw new Error('Error en la ausencia de red');
        }
      }
      throw error;
    }
  }

  async eliminarAusencias(ids: number[]): Promise<number[]> {
    const statuses: number[] = [];
  
    for (const id of ids) {
      try {
        const status = await this.eliminarAusencia(id);
        statuses.push(status);
      } catch (error) {
        statuses.push(0); 
      }
    }
    return statuses;
  }

  async AusenciasPorColaborador(id: number): Promise<Ausencia[]> {
    try {
      const response = await this.axiosInstance.get('/ausencias-por-colaborador/'+id);
      return response.data;
    } catch (error) {
      console.log(error)
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 403) {
          throw new Error(error.response.data.message);
        } else {
          throw new Error('Error en la ausencia de red');
        }
      }
      throw error;
    }
  }
  
}

export default AusenciaService;
