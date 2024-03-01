import { Button, Paper, Typography } from '@mui/material';
import ExpedienteService, {Expediente } from '../../services/expediente.service';
import { useState, useEffect } from 'react';
import Loader from './skeleton';
import Info from './info/Info';
import EditIcon from '@mui/icons-material/Edit';
import './expedientes.css';
import Box from '@mui/material/Box';
import Accordions from './accordion/acordion';
import EditInfo from './info/editInfo';

interface Props{
    data: Expediente | null,
}

const ExpedienteInfo = ({data}: Props) => {

    if(!data){
        return <div>No se encontró el expediente</div>
    }

    const [isLoading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const service = new ExpedienteService();
    const [expediente, setExpediente] = useState<Expediente>(data);
    const [isEdit, setIsEdit] = useState(false);

    const loadImage = async () => {
        if(expediente){
            try {
                setLoading(true);
                const response = await service.getPhoto(expediente?.idColaborador);
                setImageUrl(response.data.imageUrl);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        } else {
            console.log(imageUrl)
        }
    }

    const loadExpediente = async () => {
        try {
            if(expediente){
                const idColaborador = expediente.idColaborador;
                const response = await service.getExpediente(idColaborador);
                if(response){
                 setExpediente(response);
                 loadImage();
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (expediente && expediente.colaborador.fotoCarnet !== null) {
            loadImage();
        }else{
            setImageUrl(null);
        }
    }, [expediente]);

    useEffect(() => {
        setExpediente(data);
    }, [data]);


    const image  = () => {
       return <Box className='imageSeccion' >
                {isLoading ? (
                    <Loader />
                ) : imageUrl ? (
                    <Box className='image-'>
                        <img src={imageUrl} alt="" className="image-"/>
                    </Box>
                ) : (
                    <Box className='image-'>
                        <Typography variant="body2" color='textSecondary'> 
                            Sin foto
                        </Typography>
                    </Box>
                )}
        </Box>
    };

    return (
        <Box className='container-expediente' component={Paper}>
            <Typography className='idExpe' variant="body2">
                N#{expediente?.idExpediente}
            </Typography>
            {isEdit ? (
                    <Box sx={{width: '100%'}}>
                        <EditInfo expediente={expediente} setIsEdit={setIsEdit} imageUrl={imageUrl} loadData={loadExpediente}/>
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
                                    <Typography variant='h5'>{expediente?.colaborador.nombre}</Typography> 
                                    <Typography variant='body2'>{expediente?.colaborador.identificacion}</Typography> 
                                    <Typography variant='body2'>Unidad de gestión: {expediente?.colaborador.unidad?? 'No indica'}</Typography>
                                    <Typography variant='body2'>Puesto: {expediente?.colaborador.puesto?.nombrePuesto?? 'No indica'}</Typography>
                                </Box>
                                <Box ml={3}>
                                    <Button startIcon ={<EditIcon/>} onClick={()=> setIsEdit(true)}>Editar</Button>
                                </Box>
                            </Box>
                        </Box>  
                    </Box>
                    <Box mb={10}>
                        <Info expediente={expediente} size={3} marginBottom={2.5}/>
                    </Box>       
                </Box>         
            )}
           <Box>
            <Accordions data={expediente.colaborador}/>
           </Box>
        </Box>
    );
};

export default ExpedienteInfo;
