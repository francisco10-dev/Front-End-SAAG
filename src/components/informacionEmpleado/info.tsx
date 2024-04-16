import { Box } from "@mui/material";
import { useAuth } from "../../authProvider";
import PersonalInfo from "../expedientes/info/personalInfo";

const Info = () => {

    const {colaborador, photo} = useAuth();
    
    return (
        <Box sx={{padding:5}}>
            <PersonalInfo colaborador={colaborador} isLoadingImage={false} imageUrl={photo} size={3}/>
        </Box>
    );
}

export default Info;