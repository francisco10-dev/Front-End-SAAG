import axios from 'axios';

export interface Usuario {
    nomUsuario: string;
    password: string;
}

class UsuarioService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:3000/saag',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async login(data: any): Promise<Usuario> {
    try {
      const response = await this.axiosInstance.post('/login/', data);
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

}

export default UsuarioService;
