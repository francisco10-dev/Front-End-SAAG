import { useState } from 'react';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { showConfirmation } from '../solicitudes/utils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authProvider';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LockClockIcon from '@mui/icons-material/LockClock';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Avatar } from '@mui/material';

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();
  const { userRole,logout } = useAuth();

  const settings = [
    { icon: <LockClockIcon sx={{ marginRight: 1 }} />, text: 'Administración', onClick: () => navigate('/administrador'), role: 'admin' },
    { icon: <AccountBoxIcon sx={{ marginRight: 1 }} />, text: 'Cuenta', onClick: () => navigate('/') },
  ];

  const filteredSettings = settings.filter(setting => !setting.role || setting.role === userRole);

  const handleClose = () => setOpen(null);

  const handleLogout = async () => {
    handleClose();
    const confirmed = await showConfirmation();
    if (confirmed) {
      try {
        toast.loading('Cerrando sesión...', { autoClose: false, position: 'bottom-center' });
        logout();
      } finally {
        toast.dismiss();
      }
    }
  };

  const handleOpen = (event:any) => setOpen(event.currentTarget);

  return (
    <>
      <IconButton 
        onClick={handleOpen}
        sx={{
          color: 'white',
        }}
      >
        <Avatar  sx={{ width: 30, height: 30 }}/>
      </IconButton>
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >

        {filteredSettings.map((option) => (
          <MenuItem key={option.text} onClick={() => option.onClick()}>
            {option.icon}
            {option.text}
          </MenuItem>
        ))}

        <Divider sx={{ backgroundColor: 'rgb(27, 61, 81)' }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleLogout}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          <LogoutIcon sx={{ marginRight: 1 }} />Salir
        </MenuItem>
      </Popover>
      <ToastContainer />
    </>
  );
}
