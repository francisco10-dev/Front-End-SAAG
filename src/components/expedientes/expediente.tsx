import { Button, Paper, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import Loader from './skeleton';
import Info from './info/Info';
import EditIcon from '@mui/icons-material/Edit';
import './expedientes.css';
import Box from '@mui/material/Box';
import Accordions from './accordion/acordion';
import EditInfo from './info/editInfo';
import ColaboradorService, { Colaborador } from '../../services/colaborador.service';

interface Props{
    data: Colaborador | null,
    reload: ()=> void;
}

const ExpedienteInfo = ({data, reload}: Props) => {

    const [isLoading, setIsLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const service = new ColaboradorService();
    const [expediente, setExpediente] = useState<Colaborador | null>(null);
    const [isEdit, setIsEdit] = useState(false);
   
    useEffect(()=> {
        setExpediente(data);
    },[]);

    useEffect(() => {
        const loadImages = async () => {
            if (expediente && expediente.fotoCarnet !== null) {
                await loadImage();
            } else {
                setImageUrl(null);
            }
        };
        loadImages();
    }, [expediente]);

    useEffect(() => {
        setExpediente(data);
    }, [data]);

    if(!data){
        return <div>No se encontró el expediente</div>
    }

    const loadImage = async () => {
        if(expediente){
            try {
                setIsLoading(true);
                const imgUrl = localStorage.getItem(`imgUrl${expediente.idColaborador}`);
                if(imgUrl){
                    setImageUrl(imgUrl);
                }else{
                    const response = await service.getPhoto(expediente?.idColaborador);
                    setImageUrl(response.data.imageUrl);                    
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        } else {
            console.log(imageUrl)
        }
    }

    const loadExpediente = async () => {
        try {
            if(expediente){
                const idColaborador = expediente.idColaborador;
                const response = await service.obtenerColaboradorPorId(idColaborador);
                if(response){
                 setExpediente(response);
                 loadImage();
                }
            }
        } catch (error) {
            console.log(error);
        }
    }


    const image = () => {
        
        let content;
      
        if (isLoading) {
          content = <Loader />;
        } else {
          content = imageUrl ? (
            <Box className='image-'>
              <img src={imageUrl} alt="" className="image-" />
            </Box>
          ) : (
            <Box className='image-'>
              <Typography variant="body2" color='textSecondary'> 
                Sin foto
              </Typography>
            </Box>
          );
        }
        return <Box className='imageSeccion'>{content}</Box>;
    };
      

    return (
        <Box className='container-expediente' component={Paper}>
            {isEdit ? (
                    <Box sx={{width: '100%'}}>
                        <EditInfo colaborador={expediente} setIsEdit={setIsEdit} imageUrl={imageUrl} loadData={loadExpediente} reload={reload}/>
                    </Box>
            ): (
                <Box>
                    <Box display='flex'>
                        <Box>
                            {image()}
                        </Box>
                        <Box>
                            <Box display='flex'>
                                <Box mr={0}>
                                    <Typography variant='h5'>{expediente?.nombre}</Typography> 
                                    <Typography variant='body2'>{expediente?.identificacion}</Typography> 
                                    <Typography variant='body2'>Unidad de gestión: {expediente?.unidad?? 'No indica'}</Typography>
                                    <Typography variant='body2'>Puesto: {expediente?.puesto?.nombrePuesto?? 'No indica'}</Typography>
                                </Box>
                                <Box ml={3}>
                                    <Button startIcon ={<EditIcon/>} onClick={()=> setIsEdit(true)}>Editar</Button>
                                </Box>
                            </Box>
                        </Box>  
                    </Box>
                    <Box mb={10}>
                        <Info colaborador={expediente} size={3} marginBottom={2.5}/>
                    </Box>       
                </Box>         
            )}
           <Box>
            <Accordions data={expediente}/>
           </Box>
        </Box>
    );
};

export default ExpedienteInfo;
