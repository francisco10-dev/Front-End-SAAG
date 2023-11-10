import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import UsuarioService, { Usuario } from '../../services/usuario.service';
import { GridColDef } from '@mui/x-data-grid';
import CustomTabPanel from './CustomTabPanel';

const columns: GridColDef[] = [
  { field: 'idUsuario', headerName: 'ID', width: 110 },
  { field: 'nombreUsuario', headerName: 'Nombre de Usuario', width: 250 },
  { field: 'rol', headerName: 'Rol', width: 150 },
  { field: 'idColaborador', headerName: 'ID de Colaborador', width: 250 },
];

export default function TabsUsuarioAdmin() {
  const service = new UsuarioService();
  const [value] = useState(0);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);


  const onDeleteRow = async (idsToDelete: number[]) => {
    try {
      for (const idToDelete of idsToDelete) {
        await service.eliminarUsuario(idToDelete);
      }
      obtenerYActualizarUsuarios();
    } catch (error) {
      console.error('Error al eliminar usuarios: ', error);
    }
  };

  const obtenerYActualizarUsuarios = async () => {
    try {
      const usuariosActualizados = await service.obtenerUsuarios();
      setUsuarios(usuariosActualizados);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  useEffect(() => {
    obtenerYActualizarUsuarios();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      {[0, 1, 2, 3].map((index) => (
        <CustomTabPanel
          key={index}
          value={value}
          index={index}
          usuarios={usuarios}
          columns={columns}
          onDeleteRow={onDeleteRow}
        />
      ))}
    </Box>
  );
}
