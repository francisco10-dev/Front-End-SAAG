import { Box } from "@mui/material";

export default function Badge(props: {estado: string}){
    const {estado} = props;

    const getStatusColor = (status: string) => {
        switch (status) {
          case 'pendiente':
            return { backgroundColor: '#FFC107', color: 'black' };
          case 'aprobado':
            return { backgroundColor: '#4CAF50', color: 'white' };
          case 'procesada':
            return { backgroundColor: '#2196F3', color: 'white' };
          case 'rechazado':
            return { backgroundColor: '#BF3131', color: 'white' };
          default:
            return { backgroundColor: '#E7F0FF', color: 'black' };
        }
    };
    const {backgroundColor, color } = getStatusColor(estado);

    return (
        <Box  sx={{backgroundColor: backgroundColor, color: color, padding: 1, borderRadius: 10, textAlign: 'center'}}>
            {estado}
        </Box>
    );
}