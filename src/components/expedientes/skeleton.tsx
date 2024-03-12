import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/material';

export default function Loader() {
  return (
    <Box sx={{marginLeft: 1}}>
        <Stack spacing={1}>
         <Skeleton variant="rectangular" width={100} height={100} animation="wave" sx={{borderRadius: 50}} />
        </Stack>
    </Box>
  );
}


