import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Dialog, DialogContent, Grid } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../authProvider';

interface Props{
    open: boolean;
    onClose: () => void;
}

export default function AccountInfo({open, onClose}: Readonly<Props>) {

    const {logout, colaborador, userRole, photo} = useAuth();
    const nombre = colaborador?.nombre.split(" ")[0];

    const handleClose = () => {
        logout();
        onClose();
    }

  return (
    <div>
      <div>
      <Dialog onClose={onClose} open={open} maxWidth = 'sm' >
            <DialogContent>
                <div style={{  padding: '5px'}}>
                    <div style={{textAlign: 'center'}}>
                        {  photo ?
                            <Avatar size={80} src={photo} style={{ marginBottom: '8px', marginRight: 15 }}  /> :
                            <Avatar size={80} icon={<UserOutlined />} style={{ marginBottom: '8px', marginRight: 15 }}  />
                        }
                    </div>
                    <div style={{textAlign: 'center'}} >
                        <h4 style={{ margin: 0, }}>{nombre}</h4>
                        <p style={{ margin: 0, fontSize: '12px' }}>{userRole}</p>
                    </div>
                </div><hr />
                <div style={{width: 200}}>
                    <Grid container spacing={2}>
                            <Grid item xs={6} sm={6} md={6} key="id" >
                                <Typography variant="body2">
                                    Unidad
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    { colaborador?.unidad ? colaborador.unidad : 'No indica'}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} key="nombre" >
                                <Typography variant="body2">
                                   Puesto
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    { colaborador?.puesto ? colaborador.puesto.nombrePuesto : 'No indica'}
                                </Typography>
                            </Grid>
                    </Grid>
                </div><hr />
                <div style={{textAlign:'center'}} >
                    <Button sx={{color: 'red'}} onClick={handleClose} >
                        <LogoutIcon sx={{ marginRight: 1 }} />Cerrar sesión
                    </Button>
                </div>
            </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
