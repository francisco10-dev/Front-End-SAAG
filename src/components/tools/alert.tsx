import { useState, useEffect} from 'react';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { useAuth } from '../../authProvider';
import { useNavigate } from 'react-router-dom';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import EngineeringIcon from '@mui/icons-material/Engineering';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Badge from '@mui/material/Badge'; 
import 'react-toastify/dist/ReactToastify.css';

export default function AlertPopover() {
  const [open, setOpen] = useState(null);
  
  const [employeesCount, setEmployeesCount] = useState(0);
  const [requestsCount, setRequestsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);


  const navigate = useNavigate();
  const { userRole } = useAuth();



  useEffect(() => {
    const handleContadorActualizado = () => {
      const countString = localStorage.getItem('requestsCount');
      const count = countString ? parseInt(countString) : 0;
      setRequestsCount(count);
    };

   
    document.addEventListener('contadorActualizado', handleContadorActualizado);

    return () => {
     
      document.removeEventListener('contadorActualizado', handleContadorActualizado);
    };
  }, []);

  function resetRequestsCountLocalStorage() {
    localStorage.setItem('requestsCount', '0');
  }

  useEffect(() => {
    const handleContadorActualizado = () => {
      const countString = localStorage.getItem('employeesCount');
      const count = countString ? parseInt(countString) : 0;
      setEmployeesCount(count);
    };


    document.addEventListener('contadorActualizado', handleContadorActualizado);

    return () => {
  
      document.removeEventListener('contadorActualizado', handleContadorActualizado);
    };
  }, []);

  function resetEmployeesCountLocalStorage() {
    localStorage.setItem('employeesCount', '0');
  }

  useEffect(() => {
    const handleContadorActualizado = () => {
      const countString = localStorage.getItem('usersCount');
      const count = countString ? parseInt(countString) : 0;
      setUsersCount(count);
    };

 
    document.addEventListener('contadorActualizado', handleContadorActualizado);

    return () => {
      document.removeEventListener('contadorActualizado', handleContadorActualizado);
    };
  }, []);

  function resetUsersCountLocalStorage() {
    localStorage.setItem('usersCount', '0');
  }


  const handleRequestItemClick = () => {
    try {
      navigate('/solicitudes');
      resetRequestsCountLocalStorage(); 
      setRequestsCount(0);
    } catch (error) {
      console.error('Error al procesar la acción:', error);
    }
  };

  const handleEmployeeItemClick = () => {
    try {
      navigate('/panel-expedientes');
      resetEmployeesCountLocalStorage(); 
      setEmployeesCount(0);
    } catch (error) {
      console.error('Error al procesar la acción:', error);
    }
  };

  const handleUserItemClick = () => {
    try {
      navigate('/administrador');
      resetUsersCountLocalStorage(); 
      setUsersCount(0);
    } catch (error) {
      console.error('Error al procesar la acción:', error);
    }
  };

  const settings = [
    { icon: <EngineeringIcon sx={{ marginRight: 1 }} />, text: 'Ver nuevos empleados', onClick: handleEmployeeItemClick, role: 'admin', count: employeesCount },
    { icon: <RequestPageIcon sx={{ marginRight: 1 }} />, text: 'Ver nuevas solicitudes', onClick: handleRequestItemClick, role: 'admin', count: requestsCount },
    { icon: <AccountCircleIcon sx={{ marginRight: 1 }} />, text: 'Ver nuevos usuarios', onClick: handleUserItemClick, role: 'admin', count: usersCount },
  ];

  const filteredSettings = settings.filter(setting => !setting.role || setting.role === userRole);

  const handleClose = () => setOpen(null);

  const handleOpen = (event: any) => setOpen(event.currentTarget);


 
  const totalNotifications = settings.reduce((acc, setting) => acc + setting.count, 0);

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ color: 'white' }}>
        <Badge badgeContent={totalNotifications} color="error">
          <Avatar sx={{ width: 30, height: 30 }}>
            <NotificationsNoneIcon />
          </Avatar>
        </Badge>
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
            width: 250,
          },
        }}
      >
        {filteredSettings.map(({ icon, text, onClick, count }) => (
          <MenuItem key={text} onClick={onClick} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>{icon} {text}</div>
            <Badge badgeContent={count} color="error" overlap="circular" sx={{ marginRight: 0 }}
            />
          </MenuItem>
        ))}
        
        <Divider sx={{ backgroundColor: 'rgb(27, 61, 81)' }} />
      </Popover>
    </>
  );
}
