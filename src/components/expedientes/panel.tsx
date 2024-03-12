import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import List from "./list/list";
import Preview from "./info/preview";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpedienteInfo from "./expediente";
import AutoCompleteExpediente from "./autocomplete";
import ColaboradorService, { Colaborador } from "../../services/colaborador.service";

const Panel = () => {

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedExpediente, setSelectedExpediente] = useState<Colaborador | null>(null);
    const [expedientes, setExpedientes] = useState<Colaborador[]>([]);
    //@ts-ignore
    const [isLoading, setLoading] = useState(false);
    const service = new ColaboradorService();

    const handleSelected = (nuevoValor: number | null) => {
        setSelectedId(nuevoValor);
    };

    const handleExpediente = (nuevo: Colaborador| null) => {
        console.log('Nuevo expediente:', nuevo);
        setSelectedExpediente(nuevo);
        localStorage.setItem('selectedExp', JSON.stringify(nuevo));
    };

    const handleBack = () => {
        setSelectedExpediente(null);
        localStorage.removeItem('selectedExp');
    };

    const fetchExpedientes =  async () => {
        try {
            setLoading(true);
            const data = await service.obtenerColaboradores();
            setExpedientes(data);
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    //@ts-ignore
    const getExpediente = async (id: number) => {
        try {
            if(selectedExpediente){
            const response = await service.obtenerColaboradorPorId(id);
            setSelectedExpediente(response);
            console.log(response);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=> {
        fetchExpedientes();
    }, []);

    
    useEffect(()=> {
        console.log("Expediente seleccionado cambiado:", selectedExpediente);
    }, [selectedExpediente]);

    if(selectedExpediente){
        return (
            <Box>
                <Box display='flex'>
                    <Box width={500}>
                        <Button onClick={() => handleBack()}><ArrowBackIcon sx={{marginRight: 1}}/>Volver</Button>
                    </Box>      
                    <Box width={500}>
                        <AutoCompleteExpediente expedientes={expedientes} setSelected={handleExpediente}/>
                    </Box>              
                </Box>
                <Box>
                    <ExpedienteInfo data={selectedExpediente}/>
                </Box>
            </Box>
        );
    }

    return (
        <Box display='flex'>
            <Box>
                <List selected={handleSelected} selectedExpediente={handleExpediente}/>
            </Box>
            <Box>
                <Preview selected={selectedId}/>
            </Box>
        </Box>
    );
}

export default Panel;