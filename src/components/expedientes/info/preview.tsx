import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import '../expedientes.css'
import PersonalInfo from "./personalInfo";
import ExpedienteService, { Expediente } from "../../../services/expediente.service";
import {CircularProgress} from "@mui/material";

interface Props {
    selected: number | null;
}

//const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Preview = ({ selected }: Props) => {

    const [isLoading, setLoading] = useState(false);
    const [isLoadingImage, setLoadingImage] = useState(false);
    const [expediente, setExpediente] = useState<Expediente | null>();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const service = new ExpedienteService();

    const fetchExpediente = async (id: number) => {
        try {
            setLoading(true);
            const data = await service.getExpediente(id);
            setExpediente(data);
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
                const response = await service.getPhoto(expediente?.idColaborador);
                setImageUrl(response.data.imageUrl);
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
        if (expediente && expediente.colaborador.fotoCarnet !== null) {
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
                    <PersonalInfo isLoadingImage= {isLoadingImage} imageUrl={imageUrl} expediente={expediente}/>
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
