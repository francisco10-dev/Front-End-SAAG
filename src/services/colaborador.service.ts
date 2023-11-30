    import axios from 'axios';
    import axiosApi from '../services/api.service';

    export interface Colaborador {
        idColaborador: number;
        nombre: string;
        correoElectronico: string;
        edad: number;
        domicilio: string;
        fechaNacimiento: Date;
        unidad?: string | null;
        idPuesto?: number | null;
    }

    class ColaboradorService {
    private axiosInstance;

    constructor() {
        this.axiosInstance = axiosApi;
    }

    async agregarColaborador(data: any): Promise<Colaborador> {
        try {
        const response = await this.axiosInstance.post('/agregar-colaborador/', data);
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

    async actualizarColaborador(id: string, data: any): Promise<Colaborador> {
        try {
        const response = await this.axiosInstance.put(`/actualizar-colaborador/${id}`, data);
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
    // Agrega métodos adicionales según las necesidades específicas de los colaboradores
    }

    export default ColaboradorService;
