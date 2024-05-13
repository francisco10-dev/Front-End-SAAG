import {useState, ChangeEvent} from 'react';
import { Box, Typography, Button } from "@mui/material";

interface Props{
    Image: (file: File | null) => void;
    imageUrl: string | null;
}

const UploadImage = ({imageUrl, Image}: Props) => {

    const [selectedImage, setSelectedImage] = useState<string | null>(imageUrl);
    
    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target?.files?.[0];
    
        if (file?.type.startsWith('image/')) {
          const reader = new FileReader();
    
          reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === 'string') {
              setSelectedImage(result);
              Image(file);
            }
          };
    
          reader.readAsDataURL(file);
        } else {
          console.error('error');
        }
    };

    const restartImages = () => {
      setSelectedImage(imageUrl);
      Image(null);
    }

    return (

        <Box sx={{display: ''}}>
          <label htmlFor="file-input">
            <Box
              component="div"
              className='container-input-foto'
              sx={{
                border: selectedImage? 'solid 1px' :  'dashed 1px',
                opacity: selectedImage? 1 : 0.7,
                width: selectedImage ? 'auto' : 100, // Establecer el ancho automático si hay una imagen
                height: selectedImage ? 'auto' : 100, // Establecer la altura automática si hay una imagen
              }}
            >
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className='input-Foto'
              />
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="image selected"
                    className='image-'
                  />
                ) : (
                  <Typography variant="body1" color="text.primary">
                    Foto carné
                  </Typography>
                )}
              </Box>
            </label>
          <Box>
            {selectedImage !== imageUrl? 
              <Button onClick={()=> restartImages()} sx={{color: 'red'}}>
                <Typography variant='caption'>Restablecer</Typography>
              </Button> : ''
            }
          </Box>
        </Box>
    );

}

export default UploadImage;