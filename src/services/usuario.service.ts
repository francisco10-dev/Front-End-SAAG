import axios from 'axios';

export interface Usuario {
  idUsuario: number,
  nomUsuario: string;
  password: string;
  rol: string,
  idColaborador: number,
}

class UsuarioService {
  private axiosInstance;
  private token = localStorage.getItem('token');

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:3000/saag',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${this.token}`
      },
    });
  }

  async login(data: any): Promise<string> {
    try {
      const response = await this.axiosInstance.post('/login/', data);
      return response.data.token;
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
      const usuarios = response.data; // Obtén los usuarios directamente desde la API
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

  async actualizarUsuario(id: string, data: any): Promise<Usuario> {
    try {
      const response = await this.axiosInstance.put(`/actualizar-usuario/${id}`, data);
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

  async eliminarUsuario(id: Number): Promise<void> {
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
}

export default UsuarioService;

