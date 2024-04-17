import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { UserOutlined } from '@ant-design/icons';
import { Colaborador } from '../../services/colaborador.service';


interface AutoCompleteExpedienteProps {
  expedientes: Colaborador[];
  setSelected: (nuevo : Colaborador | null) => void;
}

const AutoCompleteExpediente: React.FC<AutoCompleteExpedienteProps> = ({ expedientes, setSelected }) => {
    const [selectedExpediente, setSelectedExpediente] = useState<Colaborador | null>(null);
   
    //@ts-ignore
    const handleSelect = (event: React.ChangeEvent<{}>, value: Colaborador | null) => {
      setSelectedExpediente(value);
      setSelected(value);
    };
  
    return (
      <Autocomplete
        options={expedientes}
        getOptionLabel={(option) => option.nombre}
        isOptionEqualToValue={(option, value) => option.idColaborador === value.idColaborador} // Actualizado
        value={selectedExpediente}
        onChange={handleSelect}
        renderOption={(props, option) => (
          <li {...props}>
            <Avatar sx={{ marginRight: 1 }}>
              <UserOutlined />
            </Avatar>
            <Typography>{option.nombre}</Typography>
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} label="Buscar por nombre de colaborador" variant="outlined" />
        )}
      />
    );
};

export default AutoCompleteExpediente;
  
