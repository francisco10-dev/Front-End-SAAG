import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DataTable, { DataTableProps } from './table'; // Asegúrate de importar DataTableProps
import UsuarioService, { Usuario } from '../../services/usuario.service';
import { GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'idUsuario', headerName: 'ID', width: 110 },
  { field: 'nombreUsuario', headerName: 'Nombre de Usuario', width: 250 },
  { field: 'rol', headerName: 'Rol', width: 150 },
  { field: 'idColaborador', headerName: 'ID de Colaborador', width: 250 },
];

const applyFilters = (usuarios: Usuario[], filterText: string) => {
  return usuarios.filter((usuario) => {
    return (
      Object.values(usuario).some((value) =>
        value && value.toString().toLowerCase().includes(filterText.toLowerCase())
      )
    );
  });
};

export default function TabsUsuarioAdmin() {
  const service = new UsuarioService();
  const [value, setValue] = useState(0);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    service.obtenerUsuarios()
      .then((usuarios) => {
        setUsuarios(usuarios);
      })
      .catch((error) => {
        console.error('Error al obtener usuarios:', error);
      });
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Todos" />
          <Tab label="Empleados" />
          <Tab label="Administradores" />
          <Tab label="Otro" />
        </Tabs>
      </Box>
      {[0, 1, 2, 3].map((index) => (
        <CustomTabPanel
          key={index}
          value={value}
          index={index}
          usuarios={usuarios}
          columns={columns}
        />
      ))}
    </Box>
  );
}

interface TabPanelProps {
  index: number;
  value: number;
  usuarios: Usuario[];
  columns: GridColDef[];
}

function CustomTabPanel(props: TabPanelProps) {
  const { value, index, usuarios, columns } = props;
  const filteredUsuarios = applyFilters(usuarios, '');

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>
            <DataTable
              columns={columns}
              rows={filteredUsuarios}
              filterFunction={applyFilters}
              getRowId={(row: any) => row.idUsuario} // Especifica la propiedad única de cada fila
            />
          </Typography>
        </Box>
      )}
    </div>
  );
}



