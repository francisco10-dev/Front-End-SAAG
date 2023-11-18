import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import UsuarioService, { Usuario } from '../../services/usuario.service';
import { GridColDef } from '@mui/x-data-grid';
import CustomTabPanel from './CustomTabPanel';
import { toast } from 'react-toastify';  

const columns: GridColDef[] = [
  { field: 'idUsuario', headerName: 'ID', width: 110 },
  { field: 'nombreUsuario', headerName: 'Nombre de Usuario', width: 250 },
  { field: 'rol', headerName: 'Rol', width: 150 },
  { field: 'idColaborador', headerName: 'ID del Colaborador', width: 250 },
];

export default function TabsUsuarioAdmin() {
  const service = new UsuarioService();
  const [value] = useState(0);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filterText, setFilterText] = useState('');


  const onDeleteRow = async (idsToDelete: number[]) => {
    const cantidadRegistros = idsToDelete.length;
    const confirmMessage = `¿Estás seguro de que quieres eliminar ${cantidadRegistros} usuario(s)?`;
    const userConfirmed = window.confirm(confirmMessage);
    if (userConfirmed) {
      try {
        for (const idToDelete of idsToDelete) {
          await service.eliminarUsuario(idToDelete);
        }
        toast.success('Se han eliminado: '+ cantidadRegistros + 'usuarios');
        obtenerYActualizarUsuarios();
      } catch (error) {
        toast.error('Error al eliminar usuarios: ' + error);
      }
    } else {
      toast.error('Eliminación cancelada por el usuario');
    }
  };
  
  const obtenerYActualizarUsuarios = async () => {
    try {
      const usuariosActualizados = await service.obtenerUsuarios();
      setUsuarios(usuariosActualizados);
    } catch (error) {
      toast.error('Error al obtener usuarios:' + error);
    }
  };

  useEffect(() => {
    obtenerYActualizarUsuarios();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        label="Buscar..."
        variant="standard"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{ marginBottom: '20px' }}
      />
      {[0, 1, 2, 3].map((index) => (
        <CustomTabPanel
          key={index}
          value={value}
          index={index}
          usuarios={usuarios.filter((usuario) => {
            const formattedId = usuario.idUsuario.toString();
            const nombreUsuario = usuario.nombreUsuario ? usuario.nombreUsuario.toLowerCase().trim() : '';
            const searchText = filterText.toLowerCase().trim();
            return (
              nombreUsuario.includes(searchText) ||
              formattedId.includes(searchText)
            );
          })}
          columns={columns}
          onDeleteRow={onDeleteRow}
        />
      ))}
    </Box>
  );
}

