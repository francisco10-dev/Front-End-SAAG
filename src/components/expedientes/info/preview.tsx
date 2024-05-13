import { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import '../expedientes.css'
import PersonalInfo from "./personalInfo";
import ColaboradorService, { Colaborador } from "../../../services/colaborador.service";
import { message } from "antd";

interface Props {
    colaborador: Colaborador;
    loading: boolean;
}

const Preview = ({ colaborador, loading }: Props) => {

    const [isLoadingImage, setIsLoadingImage] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const service = new ColaboradorService();


    const loadImage = async () => {
        if(colaborador){
            try {
                setIsLoadingImage(true);
                const response = await service.getPhoto(colaborador.idColaborador);
                const imgUrl = response.data.imageUrl;
                setImageUrl(imgUrl);
            } catch (error) {
                message.info('Ocurrió un error al cargar la foto');
            } finally {
                setIsLoadingImage(false);
            }
        } else {
            setImageUrl(null);
        }
    }

    useEffect(() => {
        if (colaborador && colaborador.fotoCarnet !== null) {
            loadImage();
        }else{
            setImageUrl(null);
        }
    }, [colaborador]);

    return (
        <Box className= 'preview-box'>
            {colaborador ? 
                <Box>
                    <PersonalInfo isLoadingImage= {isLoadingImage} imageUrl={imageUrl} colaborador={colaborador} size={6} />
                </Box>
                : <Box>            
                    <Box className='no-info'>
                        <img src="/exp.svg" alt="imagen de folder" style={{ width: 150 }} />
                        <Typography variant="body2" color="textSecondary">
                           {loading ? 'Cargando... ': 'Selecciona un registro para obtener una vista previa'} 
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
