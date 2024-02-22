    import React, { useState, FormEvent, useEffect } from 'react';
    import Dialog from '@mui/material/Dialog';
    import DialogContent from '@mui/material/DialogContent';
    import DialogTitle from '@mui/material/DialogTitle';
    import Button from '@mui/material/Button';
    import TextField from '@mui/material/TextField';
    import Select from 'react-select';
    import { toast } from 'react-toastify';
    import UsarioService, { Usuario } from '../../services/usuario.service';

    interface ColaboradorOption {
    value: number;
    label: string;
    }

    interface EditUsuarioModalProps {
    open: boolean;
    usuario: Usuario | null;
    onClose: () => void;
    onUsuarioUpdate: (usuarioId: number) => void;
    }

    const EditUsuarioModal: React.FC<EditUsuarioModalProps> = ({ open, usuario, onClose, onUsuarioUpdate }) => {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [rol, setRol] = useState('empleado');
    const [idColaborador, setIdColaborador] = useState<number | null>(null);
    const service = new UsarioService();
    const [colaboradores] = useState<ColaboradorOption[]>([]);

    const [usuarioState, setUsuarioState] = useState<Usuario | null>(null);

    useEffect(() => {
        setUsuarioState(usuario);
        if (usuario) {
        setNombreUsuario(usuario.nombreUsuario || '');
        setContrasena(usuario.password || '');
        setRol(usuario.rol || 'empleado');
        setIdColaborador(usuario.idColaborador || null);
        }
    }, [usuario]);

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        if (!nombreUsuario || !contrasena || !rol || idColaborador === null) {
        toast.error('Todos los campos son obligatorios');
        return;
        }

        const updatedUsuario = { ...usuarioState };
        updatedUsuario.nombreUsuario = nombreUsuario;
        updatedUsuario.password = contrasena;
        updatedUsuario.rol = rol;
        updatedUsuario.idColaborador = idColaborador;

        if (usuario) {
        try {
            const response = await service.actualizarUsuario(usuario.idUsuario, updatedUsuario);
            toast.success('Usuario actualizado exitosamente' + response);
            setNombreUsuario('');
            setContrasena('');
            setRol('empleado');
            setIdColaborador(null);
            onUsuarioUpdate(usuario.idUsuario);
            onClose();
        } catch (error) {
            toast.error('Error al actualizar usuario' + error);
        }
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Editar Usuario {usuarioState?.idUsuario}</DialogTitle>
        <DialogContent>
            <form onSubmit={handleSave}>
            <TextField
                label="Nombre de Usuario"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Contraseña"
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Tipo de Empleado"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <Select
                value={colaboradores.find((colaborador) => colaborador.value === (idColaborador || null)) || null}
                onChange={(selectedOption: ColaboradorOption | null) => {
                if (selectedOption) {
                    const { value } = selectedOption;
                    setIdColaborador(value || null);
                } else {
                    setIdColaborador(null);
                }
                }}
                options={colaboradores.map(({ value, label }) => ({ value, label }))}
            />
            <Button className='button' type="submit">Guardar</Button>
            <Button className='button' onClick={onClose}>Cancelar</Button>
            </form>
        </DialogContent>
        </Dialog>
    );
    };

    export default EditUsuarioModal;
