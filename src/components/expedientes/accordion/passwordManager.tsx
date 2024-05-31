import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../../authProvider";
import ColaboradorService from "../../../services/colaborador.service";
import UsuarioService, { Usuario } from "../../../services/usuario.service";
import { message } from "antd";

interface PasswordManagerProps {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordManager: React.FC<PasswordManagerProps> = ({ expanded, setExpanded }) => {
  const { colaborador } = useAuth();
  const [contrasenaActual, setContrasenaActual] = useState<string>("");
  const [contrasena, setContrasena] = useState<string>("");
  const [confirmacionContrasena, setConfirmacionContrasena] = useState<string>("");
  const [contrasenaValida, setContrasenaValida] = useState<boolean>(true);
  const [confirmacionValida, setConfirmacionValida] = useState<boolean>(true);
  const [contrasenaActualValida, setContrasenaActualValida] = useState<boolean>(true);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [usuarioCargado, setUsuarioCargado] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const colaboradorService = new ColaboradorService();
  const usuarioService = new UsuarioService();

  const limpiarFormulario = () => {
    setContrasenaActual("");
    setContrasena("");
    setConfirmacionContrasena("");
    setContrasenaValida(true);
    setConfirmacionValida(true);
    setContrasenaActualValida(true);
  };

  const handleSave = async () => {
    if (!usuario || !contrasenaActual || !contrasena || !confirmacionContrasena) {
      message.error("Faltan datos para guardar la contraseña");
      return;
    }

    if (!contrasenaValida || !confirmacionValida) {
      message.error("La contraseña no cumple con los requisitos o las contraseñas no coinciden");
      return;
    }

    try {
      const esContrasenaActualValida = await usuarioService.verificarContrasena(usuario.idUsuario, contrasenaActual);
      if (!esContrasenaActualValida) {
        message.error("La contraseña actual es incorrecta");
        setContrasenaActualValida(false);
        return;
      }

      const updatedUsuario = { ...usuario, contrasena };
      await usuarioService.actualizarUsuario(usuario.idUsuario, updatedUsuario);
      message.success("Contraseña actualizada exitosamente");
      limpiarFormulario();
      setExpanded(false);
    } catch (error) {
      message.error("Error al actualizar la contraseña");
      console.error("Error al actualizar la contraseña:", error);
    }
  };

  const handleClose = () => {
    limpiarFormulario();
    setExpanded(false);
  };

  const validarContrasena = (contrasena: string): boolean => {
    return (
      contrasena.length >= 8 &&
      /[A-Z]/.test(contrasena) &&
      /[a-z]/.test(contrasena) &&
      /[0-9]/.test(contrasena) &&
      /[@#$%^&*_!.]/.test(contrasena)
    );
  };

  const handleContrasenaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaContrasena = e.target.value;
    setContrasena(nuevaContrasena);
    setContrasenaValida(validarContrasena(nuevaContrasena));
    setConfirmacionValida(nuevaContrasena === confirmacionContrasena);
  };

  const handleConfirmacionContrasenaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaConfirmacionContrasena = e.target.value;
    setConfirmacionContrasena(nuevaConfirmacionContrasena);
    setConfirmacionValida(nuevaConfirmacionContrasena === contrasena);
  };

  useEffect(() => {
    const fetchUsuario = async () => {
      if (colaborador?.idColaborador && expanded && !usuarioCargado) {
        try {
          const fetchedUsuario = await colaboradorService.findUsuarioByColaboradorId(colaborador.idColaborador);
          console.log("Usuario fetched:", fetchedUsuario);
          setUsuario(fetchedUsuario);
          setUsuarioCargado(true);
        } catch (error) {
          console.error("Error al obtener el usuario:", error);
        }
      }
    };

    fetchUsuario();
  }, [colaborador, colaboradorService, expanded, usuarioCargado]);

  return (
    <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSave(); }} noValidate>
      <Box mb={2}>
        <TextField
          label="Contraseña Actual"
          type={showPassword ? "text" : "password"}
          value={contrasenaActual}
          onChange={(e) => setContrasenaActual(e.target.value)}
          fullWidth
          variant="outlined"
          error={!contrasenaActualValida}
          helperText={!contrasenaActualValida ? "La contraseña actual es incorrecta." : ""}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>
      <Box mb={2}>
        <TextField
          label="Nueva Contraseña"
          type={showPassword ? "text" : "password"}
          value={contrasena}
          onChange={handleContrasenaChange}
          fullWidth
          variant="outlined"
          error={!contrasenaValida}
          helperText={!contrasenaValida ? "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial." : ""}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>
      <Box mb={2}>
        <TextField
          label="Confirmar Nueva Contraseña"
          type={showPassword ? "text" : "password"}
          value={confirmacionContrasena}
          onChange={handleConfirmacionContrasenaChange}
          fullWidth
          variant="outlined"
          error={!confirmacionValida}
          helperText={!confirmacionValida ? "Las contraseñas no coinciden." : ""}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>
      <Box>
        <Button type="submit" variant="contained" color="primary">
          Guardar
        </Button>
        <Button variant="contained" color="error" onClick={handleClose} sx={{ ml: 2 }}>
          Cancelar
        </Button>
      </Box>
    </Box>
  );
};

export default PasswordManager;
