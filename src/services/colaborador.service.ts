    import axios, {  AxiosResponse } from 'axios';
    import axiosApi from '../services/api.service';
    import { Solicitud } from './solicitud.service';
    import { Puesto } from './puesto.service';
    import { Usuario } from './usuario.service';
    import {invalidateCache} from '../components/dashboard/data/cacheData';

      
    export interface Colaborador {
        idColaborador: number;
        nombre: string;
        identificacion: string;
        correoElectronico: string;
        edad: number;
        domicilio: string;
        fechaNacimiento: any;
        unidad?: string | null;
        idPuesto?: number | null;
        puesto?: Puesto | null;
        fotoCarnet: Blob | null;
        equipo: string;
        estado: string;
        tipoJornada: string | null;
        fechaIngreso: string;
        fechaSalida: string | null;
        supervisor: { nombre: string } | null;
    }

    class ColaboradorService {
    private axiosInstance;

    constructor() {
        this.axiosInstance = axiosApi;
    }

    async agregarColaborador(data: any): Promise<AxiosResponse> {
        try {
        const response = await this.axiosInstance.post('/agregar-colaborador/', data);
        if (response.status >= 200 && response.status < 300) {
          this.incrementarContadorLocalStorage();
          this.limpiarCache();
        }
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

    async obtenerColaboradores(): Promise<Colaborador[]> {
        try {
        const response = await this.axiosInstance.get('/colaboradores/');
        const colaboradores = response.data; 
        return colaboradores;
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

    async obtenerColaboradoresConSuUsuario(): Promise<{ colaborador: Colaborador, usuario: Usuario }[]> {
      try {
        const response = await this.axiosInstance.get('/colaboradores-with-user/');
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
    

    async obtenerColaboradorPorId(id: number): Promise<Colaborador> {
        try {
        const response = await this.axiosInstance.get(`/colaborador/${id}`);
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

    async actualizarColaborador(id: number, data: any): Promise<AxiosResponse> {
        try {
        const response = await this.axiosInstance.put(`/actualizar-colaborador/${id}`, data);
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

    async eliminarColaborador(id: number): Promise<void> {
        try {
        await this.axiosInstance.delete(`/eliminar-colaborador/${id}`);
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

    async colaboradorSinUsuario(): Promise<Colaborador[]>{
        try{
            const response = await this.axiosInstance.get('/colaboradores-usuarios/');
            const colaboradores = response.data;
            return colaboradores;
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

    async findUsuarioByColaboradorId(idColaborador: number): Promise<Usuario> {
      try {
          const response = await this.axiosInstance.get(`/find-user-by-IdColaborador/${idColaborador}/usuario`);
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

    async agregarTelefono(id: number, phoneNumber: string): Promise<number> {
        try {
            const data = {
                numeroTelefono: phoneNumber,
                idColaborador: id
            };
            
           const response = await this.axiosInstance.post(`telefonos/agregar-telefono`, data);
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

      async agregarTelefonos(id: number, phoneNumbers: string[]): Promise<number[]> {
        const statuses: number[] = [];
      
        for (const number of phoneNumbers) {
          try {
            const data = {
              numeroTelefono: number,
              idColaborador: id
            };
            const response = await this.axiosInstance.post(`telefonos/agregar-telefono`, data);
            statuses.push(response.status);
          } catch (error) {
            statuses.push(0);
            console.error(error);
          }
        }
      
        return statuses;
      }

      async actualizarTelefono(id: number, newNumber: string): Promise<number> {
        try {
            const data = {
              numeroTelefono : newNumber
            };
            const response = await this.axiosInstance.put(`telefonos/actualizar-telefono/${id}`,data);
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

      async obtenerSolicitudesPorColaborador(id: number): Promise<Solicitud[]> {
        try {
        const response = await this.axiosInstance.get('/solicitudes-por-colaborador/'+id);
        console.log(response);
        const colaboradores = response.data; 
        return colaboradores;
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

    async getPhoto(id: number): Promise<AxiosResponse<any, any>> {
      return this.axiosInstance.get(`/documentos/obtener-foto/${id}`);
    }
    
    incrementarContadorLocalStorage() {
      const count = localStorage.getItem('employeesCount');
      const newCount = count ? parseInt(count) + 1 : 1;
      localStorage.setItem('employeesCount', newCount.toString());
      const event = new Event('contadorActualizado');
      document.dispatchEvent(event);
      invalidateCache('employeeData');
      invalidateCache('employeeByUnitData');
    }

    limpiarCache() {
      invalidateCache('employeeData');
      invalidateCache('employeeByUnitData');
    }
}

export default ColaboradorService;
