import { Box } from "@mui/material";

const estadoAbreviado: {[key: string]: string} = {
  "AprobadoPorJefatura": "APJ",
  "RechazadoPorJefatura": "RPJ"
};

export default function Badge(props: Readonly<{estado: string}>){
    const {estado} = props;

    const getStatusColor = (status: string) => {
        switch (status) {
          case 'Pendiente':
            return { backgroundColor: '#FFC107', color: 'black' };
          case 'Aprobado':
            return { backgroundColor: '#4CAF50', color: 'white' };
          case 'AprobadoPorJefatura':
            return { backgroundColor: '#4CAF50', color: 'white' };
          case 'Procesada':
            return { backgroundColor: '#2196F3', color: 'white' };
          case 'Rechazado':
            return { backgroundColor: '#BF3131', color: 'white' };
          case 'RechazadoPorJefatura':
            return { backgroundColor: '#BF3131', color: 'white' };
          default:
            return { backgroundColor: '#E7F0FF', color: 'black' };
        }
    };
    const {backgroundColor, color } = getStatusColor(estado);
    const estadoMostrado = estadoAbreviado[estado] || estado; // Si existe una abreviatura, úsala; de lo contrario, usa el estado completo

    return (
        <Box  sx={{backgroundColor: backgroundColor, color: color, padding: 1, borderRadius: 10, textAlign: 'center'}}>
            {estadoMostrado}
        </Box>
    );
}