import { useState, useEffect} from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Table} from 'antd';

// Material Dashboard 2 React components
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CheckIcon from '@mui/icons-material/Check';
import SolicitudService from '../../../services/solicitud.service'
import '../styles/styles.css'


interface Solicitud {
  idSolicitud: number;
  tipoSolicitud: string;
  nombreColaborador: string;
  nombreEncargado: any;

}


function Teams() {
  const Service = new SolicitudService();
  const [menu, setMenu] = useState<null | HTMLElement>(null);
  const [dataSource, setDataSource] = useState<Solicitud[]>([]);

    const loadRequests = async () => {
    try {
      const solicitudesData = await Service.getSolicitudes();
      const dataFilter = solicitudesData.map(solicitud => ({
        idSolicitud: solicitud.idSolicitud, 
        nombreColaborador: solicitud.nombreColaborador,
        nombreEncargado: solicitud.nombreEncargado,
        tipoSolicitud: solicitud.tipoSolicitud
        
      }));
      setDataSource(dataFilter);
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);


  const openMenu = ({ currentTarget }: React.MouseEvent<HTMLElement>) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={closeMenu}>Action</MenuItem>
      <MenuItem onClick={closeMenu}>Another action</MenuItem>
      <MenuItem onClick={closeMenu}>Something else</MenuItem>
    </Menu>
  );

  const columns = [
    {
      title: 'Id',
      dataIndex: 'idSolicitud',
      key: 'Id',
    },
    {
      title: 'Colaborador',
      dataIndex: 'nombreColaborador',
      key: 'Colaborador',
    },
    {
      title: 'Encargado',
      dataIndex: 'nombreEncargado',
      key: 'Encargado',
    },
    {
      title: 'Tipo',
      dataIndex: 'tipoSolicitud',
      key: 'Tipo',
    }];

  return (
    <Card className="custom-card">
      <Box display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Equipos
          </Typography>
          <Box display="flex" alignItems="center" lineHeight={0}>
            <Icon
              sx={{
                fontWeight: "bold",
                color: ({ palette: { info } }) => info.main,
                mt: -0.5,
              }}
            >
              <CheckIcon/>
            </Icon>
            <Typography variant="button" fontWeight="regular" color="text">
              &nbsp;<strong>10 tareas realizadas</strong> este mes
            </Typography>
          </Box>
        </Box>
        <Box color="text" px={2}>
          <Icon sx={{cursor: "pointer", fontWeight: "bold", height:"2em" }} onClick={openMenu}>
            <MoreVertIcon />
          </Icon>
        </Box>
        {renderMenu}
      </Box>
      <Box>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={{pageSize:6}}    
          />
     
      </Box>
    </Card>
  );
}

export default Teams;
