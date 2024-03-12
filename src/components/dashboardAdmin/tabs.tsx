import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import UsuarioService from '../../services/usuario.service';
import ColaboradorService from '../../services/colaborador.service';
import { GridColDef } from '@mui/x-data-grid';
import CustomTabPanel from './CustomTabPanel';
import { toast } from 'react-toastify';  

export interface ColabUsuario{  // cambiar datos aqui para que se actualice con respecto a lo que se necesita y con los que deberiamos poner en pa tabla de los usuarios 
  idUsuario: number,
  nombreUsuario: string;
  rol: string,
  correo: string,
}

const columns: GridColDef[] = [
  { field: 'idUsuario', headerName: 'ID', width: 110 },
  { field: 'nombreUsuario', headerName: 'Nombre de Usuario', width: 250 },
  { field: 'rol', headerName: 'Rol', width: 150 },
  { field: 'correo', headerName: 'correo del Colaborador', width: 250 },
];

export default function TabsUsuarioAdmin() {
  const service = new UsuarioService();
  const colaborador = new ColaboradorService();
  const [value] = useState(0);
  const [ColabUsuario, setUsuarios] = useState<ColabUsuario[]>([]);
  const [selectedUsuario] = useState<ColabUsuario | null>(null);
  const [filterText, setFilterText] = useState('');
  const [, setIsModalOpen] = useState(false);

  const onUpdateRow = async () => {
    if (selectedUsuario) {
      setIsModalOpen(true);
    }
  };
  
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
        window.location.reload();
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
      const consultasColaboradores = await Promise.all(
        usuariosActualizados.map(async (usuario) => {
          const colaboradores = await colaborador.obtenerColaboradores();
          const datosColaborador = colaboradores.find((colaborador) => colaborador.idColaborador === usuario.idColaborador);
          if (datosColaborador) {
            return {
              idUsuario: usuario.idUsuario,
              nombreUsuario: usuario.nombreUsuario,
              rol: usuario.rol,
              correo: datosColaborador.correoElectronico,
            };
          } else {
            throw new Error(`No se encontró el colaborador para el usuario con ID: ${usuario.idUsuario}`);
          }
        })
      );
      setUsuarios(consultasColaboradores);
    } catch (error) {
      toast.error('Error al obtener usuarios: ' + error);
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
          colabUsuario={ColabUsuario.filter((ColabUsuario) => {
            const formattedId = ColabUsuario.idUsuario.toString();
            const nombreUsuario = ColabUsuario.nombreUsuario ? ColabUsuario.nombreUsuario.toLowerCase().trim() : '';
            const searchText = filterText.toLowerCase().trim();
            return (
              nombreUsuario.includes(searchText) ||
              formattedId.includes(searchText)
            );
          })}
          columns={columns}
          onDeleteRow={onDeleteRow}
          onUpdateRow={onUpdateRow}
        />
      ))}
    </Box>
  );
}


