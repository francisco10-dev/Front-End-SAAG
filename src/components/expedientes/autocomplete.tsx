import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { UserOutlined } from '@ant-design/icons';
import { Expediente } from '../../services/expediente.service';


interface AutoCompleteExpedienteProps {
  expedientes: Expediente[];
  setSelected: (nuevo : Expediente | null) => void;
}

const AutoCompleteExpediente: React.FC<AutoCompleteExpedienteProps> = ({ expedientes, setSelected }) => {
    const [selectedExpediente, setSelectedExpediente] = useState<Expediente | null>(null);
  
    const handleSelect = (event: React.ChangeEvent<{}>, value: Expediente | null) => {
      setSelectedExpediente(value);
      setSelected(value);
      console.log(value);
    };
  
    return (
      <Autocomplete
        options={expedientes}
        getOptionLabel={(option) => option.colaborador.nombre}
        isOptionEqualToValue={(option, value) => option.idExpediente === value.idExpediente} // Actualizado
        value={selectedExpediente}
        onChange={handleSelect}
        renderOption={(props, option) => (
          <li {...props}>
            <Avatar sx={{ marginRight: 1 }}>
              <UserOutlined />
            </Avatar>
            <Typography>{option.colaborador.nombre}</Typography>
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} label="Buscar por nombre de colaborador" variant="outlined" />
        )}
      />
    );
};

export default AutoCompleteExpediente;
  
