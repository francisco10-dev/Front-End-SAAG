import {Box, Typography} from '@mui/material'
import Info from './Info';
import Loader from '../skeleton';
import { Colaborador } from '../../../services/colaborador.service';

interface Props{
    isLoadingImage: boolean;
    imageUrl: string | null;
    colaborador: Colaborador | null;
}

const PersonalInfo = ({isLoadingImage, imageUrl, colaborador}: Props) => {

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
                <Typography variant='h5'>{colaborador?.nombre}</Typography> 
                <Typography variant='body2'><span style={{ fontWeight: 'bold', fontSize: 13 }}>Unidad de gestión: </span>  {colaborador?.unidad ?? 'No indica'}</Typography>
                <Typography variant='body2'><span style={{ fontWeight: 'bold', fontSize: 13 }}>Puesto: </span> {colaborador?.puesto?.nombrePuesto?? 'No indica'}</Typography>
                </Box>
            </Box> 
            <Box m={2} mt={5}>
                <Info colaborador={colaborador} size={6} marginBottom={1}/>
            </Box>
        </Box>
    );

}

export default PersonalInfo;