import axios from 'axios';
import axiosApi from '../services/api.service'

export interface Usuario {
  idUsuario: number,
  nombreUsuario: string;
  password: string;
  rol: string,
  idColaborador: number,
}

class UsuarioService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axiosApi;
  }

  private async handleError(error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Error ${error.response.status}: ${error.response.statusText}`);
      } else {
        throw new Error('Error en la solicitud de red');
      }
    }
    throw error;
  }

  async login(data: any): Promise<any> {
    try { 
      const response = await this.axiosInstance.post('/login/', data);
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async logout(token: string): Promise<any> {
    try { 
      const response = await this.axiosInstance.post(`/logout/${token}`);
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async agregarUsuario(data: any): Promise<Usuario> {
    try {
      const response = await this.axiosInstance.post('/agregar-usuario/', data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error; // Agrega esta línea
    }
  }

  async obtenerUsuarios(): Promise<Usuario[]> {
    try {
      const response = await this.axiosInstance.get('/usuarios');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error; // Agrega esta línea
    }
  }
  
  async obtenerUsuarioPorId(id: string): Promise<Usuario> {
    try {
      const response = await this.axiosInstance.get(`/usuario/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error; // Agrega esta línea
    }
  }

  async actualizarUsuario(id: number, data: any): Promise<Usuario> {
    try {
      const response = await this.axiosInstance.put(`/actualizar-usuario/${id}`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error; // Agrega esta línea
    }
  }
  
  async eliminarUsuario(id: number): Promise<void> {
    try {
      await this.axiosInstance.delete(`/eliminar-usuario/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default UsuarioService;
