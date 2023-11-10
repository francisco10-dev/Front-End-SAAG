import axios from "axios";
import {jwtDecode} from "jwt-decode";


const axiosApi = axios.create({   //Se crea la instancia de axios que será usada de forma general para todos los services
  baseURL: "https://apisaag.azurewebsites.net/saag",
});


const renewToken = async () =>{   // Función para renovar el token de acceso si este se expira
  try {
    const token = localStorage.getItem("refreshToken");

    if(token){
    const newInstance = axios.create({   //Se crea una nueva instancia de axios para hacer la petición
       baseURL: "https://apisaag.azurewebsites.net/saag",
    })
    const response = await newInstance.post(`/refresh/${token}`); // Se hace la petición para obtener el nuevo token de acceso
    return response.data.newToken;
    }
  } catch (error) {
    console.error("Error al renovar el token de acceso:", error);
    return null;
  }
  
};

axiosApi.interceptors.request.use(      //Método que intercepta las peticiones que se hacen antes de ejecutarse
  async (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {   
      const data = jwtDecode(token);       //Se decodifica el accessToken para obtener el tiempo de expiración

        if(data.exp){ 
        const tokenExp = data.exp * 1000; 
        const currentDate = new Date().getTime();

          if (tokenExp > currentDate) {  // Se valida si el token todavia no ha expirado

            // El token aún no ha expirado, se añade el token a las cabeceras
            config.headers.Authorization = `Bearer ${token}`;
          }
          else {       //Si el accessToken ya expiró se obtiene uno nuevo
            const newToken = await renewToken(); 
            
            if(newToken){
                // Almacena el nuevo token de acceso en el localStorage
                localStorage.setItem("accessToken", newToken);
                config.headers.Authorization  = `Bearer ${newToken}`;
            }
        }
      }      
    }
    return config;  //Retorna la configuración con los headers
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosApi;

