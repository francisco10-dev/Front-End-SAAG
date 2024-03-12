import axios, { AxiosResponse } from 'axios';
import axiosApi from '../services/api.service'

export interface Puesto {
    idPuesto: number;
    nombrePuesto: string;
}

class PuestoService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axiosApi;
  }

  async agregarPuesto(data: any): Promise<AxiosResponse> {
    try {
      const response = await this.axiosInstance.post('/agregar-puesto/', data);
      return response;
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

  async getPuestos(): Promise<Puesto[]> {
    try {
      const response = await this.axiosInstance.get('/puestos/');
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

}

export default PuestoService;
