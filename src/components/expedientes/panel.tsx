import { useState } from "react";
import { Box } from "@mui/material";
import List from "./list/list";
import Preview from "./info/preview";
import { Colaborador } from "../../services/colaborador.service";

const Panel = () => {

    const [previewInfo, setPreviewInfo] = useState<Colaborador | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSelectedPreview = (nuevoValor: Colaborador | null) => {
        setPreviewInfo(nuevoValor);
    };

    return (
        <Box display='flex'>
            <Box>
                <List  selectedPreviewInfo={handleSelectedPreview} loading={(value)=> setLoading(value)} />
            </Box>
            <Box>
                <Preview colaborador={previewInfo!} loading={loading} />
            </Box>
        </Box>
    );
}

export default Panel;