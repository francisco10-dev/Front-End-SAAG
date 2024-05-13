import axiosApi, { localhost } from "./api.service";
import { Colaborador } from "./colaborador.service";
import axios, { AxiosResponse } from 'axios';

export interface Expediente {
    idExpediente: number;
    fechaIngreso: any;
    fechaSalida?: any;
    idColaborador: number;
    colaborador: Colaborador;
}

export interface Documento {
  idColaborador: number;
  idDocumento: number;
  licencia: string | null;
  curso: string | null;
  nombreArchivo: string;
  tamano: string;
  fechaSubida: string;
  fechaVencimiento: string;
}


class ExpedienteService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axiosApi;
  }

  async agregarExpediente(data: any): Promise<Expediente> {
    try {
      const response = await this.axiosInstance.post('/agregar-expediente/', data);
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

  async getExpedientes(): Promise<Expediente[]> {
    try {
      const response = await this.axiosInstance.get('/expedientes/');
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

  async getExpediente(id: number): Promise<Expediente | null> {
    try {
      const response = await this.axiosInstance.get(`/colaborador-expediente/${id}`);
      console.log(id);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          return null; // El expediente no se encontró
        }
        throw new Error(`Error ${error.response.status}: ${error.response.statusText}`);
      }
      throw error;
    }
  }

  async actualizarExpediente(id: number, data: any): Promise<Expediente> {
    try {
      const response = await this.axiosInstance.put(`/actualizar-expediente/${id}`, data);
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

  async eliminarExpediente(id: number): Promise<number> {
    try {
      const response = await this.axiosInstance.delete(`/eliminar-expediente/${id}`);
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

  async eliminarExpedientes(ids: number[]): Promise<number[]> {
    const statuses: number[] = [];

    for (const id of ids) {
      try {
        const status = await this.eliminarExpediente(id);
        statuses.push(status);
      } catch (error) {
        statuses.push(0);
      }
    }
    return statuses;
  }

  async registrarDocumento(data: FormData): Promise<AxiosResponse> {
    try {
      const response = await this.axiosInstance.post('/documentos/registrar-documento', data);
      return response;
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

  async obtenerDocumentoPorId(id: number): Promise<any> {
    try {
      const response = await this.axiosInstance.get(`/obtener-documento/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(`Error ${error.response.status}: ${error.response.statusText}`);
      }
      throw error;
    }
  }

  async getColaboradorExpediente(idColaborador: number): Promise<any> {
    try {
      const response = await this.axiosInstance.get(`/colaborador-expediente/${idColaborador}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(`Error ${error.response.status}: ${error.response.statusText}`);
      }
      throw error;
    }
  }

  async getColaboradorDocumento(idColaborador: number): Promise<Documento[]> {
    try {
      const response = await this.axiosInstance.get(`/colaborador-documento/${idColaborador}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(`Error ${error.response.status}: ${error.response.statusText}`);
      }
      throw error;
    }
  }

  async agregarExpedienteColaborador(data : FormData) {
    try {
      const response = await this.axiosInstance.post('/expedientes/nuevo-colaborador-expediente', data);
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

  async getDocumentos(): Promise<Documento[]> {
    try {
      const response = await this.axiosInstance.get('/documentos/');
     console.log(response.data)
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

  async updatePhoto(id: number, file: File):  Promise<AxiosResponse<any, any>> {
    try {
      const form = new FormData();
      form.append('fotoCarnet', file);
      const response = await this.axiosInstance.put(`/colaborador/insertar-foto/${id}`, form);
      return response;
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

  async getPhoto(id: number): Promise<AxiosResponse<any, any>> {
    try {
      const response = await this.axiosInstance.get(`/documentos/obtener-foto/${id}`);
      return response;
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

  async getEmployeeNumbers(id: number): Promise<AxiosResponse<any, any>> {
    try {
      const response = await this.axiosInstance.get(`/telefonos/obtener-por-colaborador/${id}`);
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

  async deletePhoneNumber(id: number): Promise<number> {
    try {
      const response = await this.axiosInstance.delete(`/telefonos/eliminar-telefono/${id}`);
      return response.status;
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

  async deleteDocument(id: number): Promise<number> {
    try {
      const response = await this.axiosInstance.delete(`/eliminar-documento/${id}`);
      return response.status;
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

  async getDocument(id: number): Promise<Blob> {
    try {
      const response = await this.axiosInstance.get(`/obtener-documento/${id}`, {
        responseType: 'blob', // Configura el tipo de respuesta como arraybuffer para manejar datos binarios
      });
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

  async actualizarExpedienteColaborador(id: number, data: any): Promise<AxiosResponse> {
    try {
      const response = await this.axiosInstance.put(`/expedientes/actualizar-colaborador-expediente/${id}`, data);
      return response;
    } catch (error) {
      console.log(error);
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

  obtenerFotoCarnet(idColaborador: number) {
    const image = localhost + '/documentos/obtener-fotoCarnet/'+idColaborador;
    return image;
  }

}

export default ExpedienteService;
