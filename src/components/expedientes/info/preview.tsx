import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import '../expedientes.css'
import PersonalInfo from "./personalInfo";
import {CircularProgress} from "@mui/material";
import ColaboradorService, { Colaborador } from "../../../services/colaborador.service";

interface Props {
    selected: number | null;
}

//const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Preview = ({ selected }: Props) => {

    const [isLoading, setLoading] = useState(false);
    const [isLoadingImage, setLoadingImage] = useState(false);
    const [expediente, setExpediente] = useState<Colaborador | null>();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const service = new ColaboradorService();
    const cachedData = localStorage.getItem('expedientesData');

    const fetchExpediente = async (id: number) => {
        try {
            setLoading(true);
            if (cachedData) {
                let storedData = JSON.parse(cachedData);
                const data = storedData.find((colaborador : Colaborador) => colaborador.idColaborador === id);
                setExpediente(data);
            }else{
                const data = await service.obtenerColaboradorPorId(id);
                setExpediente(data);                
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const loadImage = async () => {
        if(expediente){
            try {
                setLoadingImage(true);
                const storedImg = localStorage.getItem(`imgUrl${expediente.idColaborador}`)
                if(storedImg){
                    setImageUrl(storedImg);
                    setLoadingImage(false);
                    return;
                }
                const response = await service.getPhoto(expediente.idColaborador);
                const imgUrl = response.data.imageUrl;
                localStorage.setItem(`imgUrl${expediente.idColaborador}`, imgUrl);
                setImageUrl(imgUrl);
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingImage(false);
            }
        } else {
            // Si la fotoCarnet es null, establecer la URL de la imagen como null
            setImageUrl(null);
            console.log(imageUrl)
        }
    }

    useEffect(() => {
        // Verificar si 'selected' tiene un valor antes de llamar a fetchExpedientes
        if (selected !== null) {
            fetchExpediente(selected);
        }
    }, [selected]);

    useEffect(() => {
        // Cargar la imagen solo si existe un expediente y el campo fotoCarnet no es null
        if (expediente && expediente.fotoCarnet !== null) {
            loadImage();
        }else{
            setImageUrl(null);
        }
    }, [expediente]);

   if(isLoading){
        return (
            <Box className= 'loader'>
                <CircularProgress/>
                <Typography variant="body2" color="textSecondary">
                    Cargando información...
                </Typography>
            </Box>   
        )
   }

    return (
        <Box className= 'preview-box'>
            {expediente ? 
                <Box>
                    <PersonalInfo isLoadingImage= {isLoadingImage} imageUrl={imageUrl} colaborador={expediente}/>
                </Box>
                : <Box>            
                    <Box className='no-info'>
                        <img src="/exp.svg" alt="" style={{ width: 150 }} />
                        <Typography variant="body2" color="textSecondary">
                            Selecciona un registro para obtener una vista previa
                        </Typography>
                        <Typography color="transparent">
                            Obtén una vista previa detallada del expediente del colaborador en esta sección, 
                            información personal, documentos registrados, etc.
                        </Typography>
                    </Box>
                </Box>
            }
        </Box>
    );
}

export default Preview;
