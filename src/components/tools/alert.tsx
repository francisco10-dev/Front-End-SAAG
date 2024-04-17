import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { useAuth } from '../../authProvider';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import 'react-toastify/dist/ReactToastify.css';

export default function AlertPopover() {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();
  const { userRole } = useAuth();

 const settings = [
    { icon: <MailOutlineIcon sx={{ marginRight: 1 }} />, text: 'Ver nuevos mensajes', onClick: () => navigate('/administrador'), role: 'admin' },
    { icon: <RequestPageIcon sx={{ marginRight: 1 }} />, text: 'ver nuevas solicitudes', onClick: () => navigate('/solicitudes') },
    { icon: <ContentPasteGoIcon sx={{ marginRight: 1 }} />, text: 'ver nuevas ausencias', onClick: () => navigate('/ausencias') },
  ];

  const filteredSettings = settings.filter(setting => !setting.role || setting.role === userRole);

  const handleClose = () => setOpen(null);



  const handleOpen = (event:any) => setOpen(event.currentTarget);

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ color: 'white' }}>
        <Avatar sx={{ width: 30, height: 30 }}> 
        
            <NotificationsNoneIcon />
        </Avatar>
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
            width: 220,
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
      </Popover>
      <ToastContainer />
    </>
  );
}
