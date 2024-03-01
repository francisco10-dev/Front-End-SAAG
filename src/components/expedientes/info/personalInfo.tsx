import {Box, Typography} from '@mui/material'
import { Expediente } from '../../../services/expediente.service';
import Info from './Info';
import Loader from '../skeleton';

interface Props{
    isLoadingImage: boolean;
    imageUrl: string | null;
    expediente: Expediente | null;
}

const PersonalInfo = ({isLoadingImage, imageUrl, expediente}: Props) => {

    return (
        <Box>
            <Box className='foto-info-seccion' >
                <Box mr={2}>
                {isLoadingImage ? (
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
                <Box>
                <Typography variant='h5'>{expediente?.colaborador.nombre}</Typography> 
                <Typography variant='body2'><span style={{ fontWeight: 'bold', fontSize: 13 }}>Unidad de gestión: </span>  {expediente?.colaborador.unidad ?? 'No indica'}</Typography>
                <Typography variant='body2'><span style={{ fontWeight: 'bold', fontSize: 13 }}>Puesto: </span> {expediente?.colaborador.puesto?.nombrePuesto?? 'No indica'}</Typography>
                </Box>
            </Box> 
            <Box m={2} mt={5}>
                <Info expediente={expediente} size={6} marginBottom={1}/>
            </Box>
        </Box>
    );

}

export default PersonalInfo;