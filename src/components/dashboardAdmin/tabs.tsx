import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import UsuarioService, { Usuario } from '../../services/usuario.service';
import ColaboradorService from '../../services/colaborador.service';
import { GridColDef } from '@mui/x-data-grid';
import CustomTabPanel from './CustomTabPanel';
import { message } from 'antd';
import UpdateUserModal from './EditUser';
import UpdatePasswordModal from './editPassword';
import Swal from 'sweetalert2';

export interface ColabUsuario {
  idUsuario: number;
  nombreUsuario: string;
  rol: string;
  password?: string;
  nombreColaborador: string;
  correo: string;
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
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [filterText, setFilterText] = useState('');
  const [filteredUsuarios, setFilteredUsuarios] = useState<ColabUsuario[]>([]);
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
  const [isUpdatePasswordModalOpen, setIsUpdatePasswordModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onUpdateRow = async (idUsuario: number) => {
    const usuarioToUpdate = ColabUsuario.find((usuario) => usuario.idUsuario === idUsuario);
    if (usuarioToUpdate) {
      setSelectedUsuario(usuarioToUpdate as unknown as Usuario);
      setIsUpdateUserModalOpen(true); 
    }
  };

  const onUpdatePasswordRow = async (idUsuario: number) => {
    const usuarioToUpdate = ColabUsuario.find((usuario) => usuario.idUsuario === idUsuario);
    if (usuarioToUpdate) {
      setSelectedUsuario(usuarioToUpdate as unknown as Usuario);
      setIsUpdatePasswordModalOpen(true);
    }
  };
  
  const onUpdateUser = async () => {
    try {
      if (!selectedUsuario) {
        return;
      }
      message.success('Usuario actualizado correctamente');
      obtenerYRecargarUsuarios();
      setIsUpdateUserModalOpen(false); 
    } catch (error) {
      message.error('Error al actualizar usuario: ' + error);
    }
  };

  const onUpdatePassWord = async () => {
    try {
      if (!selectedUsuario) {
        return;
      }
      message.success('Usuario actualizado correctamente');
      obtenerYRecargarUsuarios();
      setIsUpdatePasswordModalOpen(false); 
    } catch (error) {
      message.error('Error al actualizar usuario: ' + error);
    }
  };

  const onDeleteRow = async (idsToDelete: number[]) => {
    
    const confirmation = await Swal.fire({
      title: `Esta acción no se puede deshacer.`,
      text: `¿Esta seguro?.`,
      showDenyButton: true,
      confirmButtonText: 'Confirmar',
      denyButtonText: 'Cancelar',
      icon: 'error', 
    });

    if (!confirmation.isConfirmed) {
      message.error('Eliminación cancelada por el usuario');
      return;
    }

    const hideLoadingMessage = message.loading('Cargando...', 0);

    try {
      for (const idToDelete of idsToDelete) {
        await service.eliminarUsuario(idToDelete);
      }
      message.success(`Se han eliminado ${idsToDelete.length} usuarios`);
      obtenerYRecargarUsuarios();
    } catch (error) {
      message.error('Error al eliminar usuarios: ' + error);
    }finally {
      hideLoadingMessage();
    }
  };

  const obtenerYRecargarUsuarios = async () => {
    try {
      setLoading(true);
      const [usuariosActualizados, colaboradores] = await Promise.all([
        service.obtenerUsuarios(),
        colaborador.obtenerColaboradores()
      ]);
  
      const consultasColaboradores = usuariosActualizados.map(usuario => {
        const datosColaborador = colaboradores.find(colaborador => colaborador.idColaborador === usuario.idColaborador);
        if (datosColaborador) {
          return {
            idUsuario: usuario.idUsuario,
            idColaborador: datosColaborador.idColaborador,
            nombreUsuario: usuario.nombreUsuario,
            rol: usuario.rol,
            nombreColaborador:datosColaborador.nombre,
            correo: datosColaborador.correoElectronico,
          };
        } else {
          throw new Error(`No se encontró el colaborador para el usuario con ID: ${usuario.idUsuario}`);
        }
      });
  
      setUsuarios(consultasColaboradores);
      setFilteredUsuarios(consultasColaboradores); 
    } catch (err) {
      message.error('Error al obtener usuarios: ' + err);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerYRecargarUsuarios();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        label="Buscar..."
        variant="standard"
        value={filterText}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setFilterText(e.target.value);
          const filtered = ColabUsuario.filter(usuario =>
            usuario.nombreUsuario.toLowerCase().includes(e.target.value.toLowerCase())
          );
          setFilteredUsuarios(filtered);
        }}
        style={{ marginBottom: '20px' }}
      />
      {[0, 1, 2, 3].map((index) => (
        <CustomTabPanel
          key={index}
          value={value}
          index={index}
          colabUsuario={filteredUsuarios} 
          columns={columns}
          onDeleteRow={onDeleteRow}
          onUpdateRow={onUpdateRow}
          onUpdatePasswordRow={onUpdatePasswordRow}
          onRefresh={obtenerYRecargarUsuarios}
          loading={loading}
        />
      ))}
      <UpdateUserModal
        open={isUpdateUserModalOpen}
        onClose={() => setIsUpdateUserModalOpen(false)}
        onUpdate={onUpdateUser}
        usuario={selectedUsuario ? { ...selectedUsuario} : null}
      />
      <UpdatePasswordModal
        open={isUpdatePasswordModalOpen}
        onClose={() => setIsUpdatePasswordModalOpen(false)}
        onUpdate={onUpdatePassWord}
        usuario={selectedUsuario ? { ...selectedUsuario} : null}
      />
    </Box>
  );
}
