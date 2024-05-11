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

  async login(data: any): Promise<any> {
    try { 
      const response = await this.axiosInstance.post('/login/', data);
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

  async logout(token: string): Promise<any> {
    try { 
      const response = await this.axiosInstance.post(`/logout/${token}`);
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

  async agregarUsuario(data: any): Promise<Usuario> {
    try {
      const response = await this.axiosInstance.post('/agregar-usuario/', data);
      if (response.status >= 200 && response.status < 300) {
        this.incrementarContadorLocalStorage();
      }
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

  async obtenerUsuarios(): Promise<Usuario[]> {
    try {
      const response = await this.axiosInstance.get('/usuarios');
      const usuarios = response.data; 
      return usuarios;
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
  
  async obtenerUsuarioPorId(id: string): Promise<Usuario> {
    try {
      const response = await this.axiosInstance.get(`/usuario/${id}`);
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

  async actualizarUsuario(id: number, data: any): Promise<Usuario> {
    try {
      console.log(data);
      const response = await this.axiosInstance.put(`/actualizar-usuario/${id}`, data);
      console.log(response.data);
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
   // esto debe de ser observado porque no se deberian eliminar
  async eliminarUsuario(id: number): Promise<void> {
    try {
      console.log(id);
      await this.axiosInstance.delete(`/eliminar-usuario/${id}`);
      console.log(id);
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

  async obtenerSupervisores(): Promise<Usuario[]>{
    try {
      const response = await this.axiosInstance.get('/supervisores');
      return response.data.data;
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

  incrementarContadorLocalStorage() {
    const count = localStorage.getItem('usersCount');
    const newCount = count ? parseInt(count) + 1 : 1;
    localStorage.setItem('usersCount', newCount.toString());
    const event = new Event('contadorActualizado');
    document.dispatchEvent(event);
  }
}

export default UsuarioService;

