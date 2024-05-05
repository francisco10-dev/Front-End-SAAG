import { Box } from "@mui/material";
import { useAuth } from "../../authProvider";
import PersonalInfo from "../expedientes/info/personalInfo";
import Requests from "../expedientes/accordion/requests";

const Info = () => {
    
    const { colaborador, photo } = useAuth();

    const renderRequests = () => {
        if (colaborador?.idColaborador) {
            return <Requests id={colaborador.idColaborador} />;
        }
        return null; 
    };
    
    return (
        <Box sx={{ padding: 5 }}>
            <PersonalInfo colaborador={colaborador} isLoadingImage={false} imageUrl={photo} size={3} />
            <Box pt={5}>
                <Box>
                    {renderRequests()}
                </Box>
            </Box>
        </Box>
    );
}

export default Info;
