import {Box, Typography} from '@mui/material'
import Info from './Info';
import Loader from '../skeleton';
import { Colaborador } from '../../../services/colaborador.service';

interface Props{
    isLoadingImage: boolean;
    imageUrl: string | null;
    colaborador: Colaborador | null;
    size: number;
}

const PersonalInfo = ({isLoadingImage, imageUrl, colaborador, size}: Props) => {


    const renderImage = () => {
        let content;
      
        if (isLoadingImage) {
          content = <Loader/>;
        } else if (imageUrl) {
          content = (
            <Box className='image-'>
              <img src={imageUrl} alt="" className="image-"/>
            </Box>
          );
        } else {
          content = (
            <Box className='image-'>
              <Typography variant="body2" color='textSecondary'> 
                Sin foto
              </Typography>
            </Box>
          );
        }
        return <Box mr={2}>{content}</Box>;
    }
      

    return (
        <Box>
            <Box className='foto-info-seccion' >
                {renderImage()}
                <Box>
                <Typography variant='h5'>{colaborador?.nombre}</Typography> 
                <Typography variant='body2'><span style={{ fontWeight: 'bold', fontSize: 13 }}>Unidad de gestión: </span>  {colaborador?.unidad ?? 'No indica'}</Typography>
                <Typography variant='body2'><span style={{ fontWeight: 'bold', fontSize: 13 }}>Puesto: </span> {colaborador?.puesto ? colaborador.puesto.nombrePuesto : 'No indica'}</Typography>
                </Box>
            </Box> 
            <Box m={2} mt={5}>
                <Info colaborador={colaborador} size={size} marginBottom={1}/>
            </Box>
        </Box>
    );

}

export default PersonalInfo;