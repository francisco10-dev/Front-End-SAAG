import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Table } from 'antd';
import { Select } from 'antd';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpedienteService from '../../../services/expediente.service';
import ColaboradorService from '../../../services/colaborador.service';
import { isBefore,isAfter, parseISO } from 'date-fns';
import '../styles/styles.css';

interface Documento {
  idColaborador: number;
  nombreColaborador: string;
  licencia: string | null;
  curso: string | null;
  nombreArchivo: string;
  fechaVencimiento: string;
  tipo: string | null;
}

interface Colaborador {
  idColaborador: number;
  nombre: string;
  identificacion: string;
  fechaIngreso: string;
  fechaSalida: string | null;
}

function Teams() {
  const Service = new ExpedienteService();
  const Service2 = new ColaboradorService();
  const [menu, setMenu] = useState<null | HTMLElement>(null);
  const [dataSourceDocuments, setDataSourceDocuments] = useState<Documento[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Documento[]>([]);
  const [daysToExpire, setDaysToExpire] = useState<number>(5);
  const [employeeType, setEmployeeType] = useState<'entrada' | 'salida'>('entrada');
  const [documentType, setDocumentType] = useState<'vencidos' | 'proximos'>('vencidos');
  const [filteredEmployees, setFilteredEmployees] = useState<Colaborador[]>([]);
  const [dataSourceEmployees, setDataSourceEmployees] = useState<Colaborador[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<string>("Documentos");

  const { Option } = Select;

  const loadDocuments = async () => {
    try {
      const documentsData = await Service.getDocumentos();
      const filteredData = documentsData.filter(
        documento => (documento.licencia !== null || documento.curso !== null) 
      );

      const dataFilter = await Promise.all(filteredData.map(async documento => ({
        idColaborador: documento.idColaborador,
        nombreColaborador: (await Service2.obtenerColaboradorPorId(documento.idColaborador)).nombre,
        nombreArchivo: documento.nombreArchivo,
        fechaVencimiento: documento.fechaVencimiento,
        licencia: documento.licencia,
        curso: documento.curso,
        tipo: documento.licencia ? documento.licencia : documento.curso,
      })));

      dataFilter.sort((a, b) => {
        const dateA = parseISO(a.fechaVencimiento);
        const dateB = parseISO(b.fechaVencimiento);
        return dateA.getTime() - dateB.getTime();
      });

      setDataSourceDocuments(dataFilter);
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  const filterDocumentsByDays = (days: number) => {
    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000); // Suma días en milisegundos
    
    const filtered = dataSourceDocuments.filter((document) => {
      const dateToCheck = parseISO(document.fechaVencimiento);
      return isBefore(dateToCheck, expirationDate) && isAfter(dateToCheck, currentDate);
    });
  
    setFilteredDocuments(filtered);
  };
  

  const filterExpiredDocuments = () => {
    const filtered = dataSourceDocuments.filter((document) => {
    const dateToCheck = parseISO(document.fechaVencimiento);
        return isBefore(dateToCheck, new Date());
    });
    setFilteredDocuments(filtered);
  };

  const loadEmployees = async () => {
    try {
      const employeesData = await Service2.obtenerColaboradores();
  
      employeesData.sort((a, b) => {
        const dateA = parseISO(a.fechaIngreso);
        const dateB = parseISO(b.fechaIngreso);
        return dateA.getTime() - dateB.getTime();
      });
  
      setDataSourceEmployees(employeesData);
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  const handleChangeEmployeeType = (value: 'entrada' | 'salida') => {
    setEmployeeType(value);
  };

  const handleChangeDocuments = (value: 'vencidos' | 'proximos') => {
    setDocumentType(value);
  };
  
  const handleChangeDaysToExpire = (value: number) => {
    setDaysToExpire(value);
  };

  const filterEmployeesByTypeAndDays = (type: 'entrada' | 'salida', days: number) => {
    const currentDate = new Date();
    const targetDate = new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000);
    
    const filtered = dataSourceEmployees.filter((employee) => {
      const dateToCheckRaw = type === 'entrada' 
        ? employee.fechaIngreso 
        : employee.fechaSalida;
  
      if (!dateToCheckRaw || isBefore(parseISO(dateToCheckRaw), new Date())) {
        return false;
      }
    
      const dateToCheck = parseISO(dateToCheckRaw);
    
      if (!dateToCheck) {
        return false;
      }
    
      return isBefore(dateToCheck, targetDate);
    });
  
    setFilteredEmployees(filtered);
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadDocuments();
      await loadEmployees();
    };
  
    fetchData();
  }, []);

  useEffect(() => {
  if (dataSourceDocuments.length > 0) {
    if(documentType === "proximos"){
      filterDocumentsByDays(daysToExpire);
    }else{
      filterExpiredDocuments();
    }
  }
}, [dataSourceDocuments, documentType, daysToExpire]);


  useEffect(() => {
    if (dataSourceEmployees.length > 0) {
      filterEmployeesByTypeAndDays(employeeType, daysToExpire);
    }
  }, [dataSourceEmployees, employeeType, daysToExpire]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    const menuText = event.currentTarget.textContent;
  
    if (menuText === "Colaboradores") {
      setSelectedMenu("Colaboradores");
    } else {
      setSelectedMenu("Documentos");
    }
    setMenu(null);
  };

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
      <MenuItem onClick={handleMenuClick}>Documentos</MenuItem>
      <MenuItem onClick={handleMenuClick}>Colaboradores</MenuItem>
    </Menu>
  );


  const documentColumns = [
    {
      title: 'IdColaborador',
      dataIndex: 'idColaborador',
      key: 'IdColaborador',
    },
    {
      title: 'NombreColaborador',
      dataIndex: 'nombreColaborador',
      key: 'NombreColaborador',
    },
    {
      title: 'NombreArchivo',
      dataIndex: 'nombreArchivo',
      key: 'NombreArchivo',
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'Tipo',
    },
    {
      title: 'FechaVencimiento',
      dataIndex: 'fechaVencimiento',
      key: 'FechaVencimiento',
    }
  ];
  
  const employeeColumns = [
    {
      title: 'Id',
      dataIndex: 'idColaborador',
      key: 'IdColaborador',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'Nombre',
    },
    {
      title: 'Identificación',
      dataIndex: 'identificacion',
      key: 'Identificacion',
    },
    {
      title: 'FechaIngreso',
      dataIndex: 'fechaIngreso',
      key: 'FechaIngreso',
    },
    {
      title: 'FechaSalida',
      dataIndex: 'fechaSalida',
      key: 'FechaSalida',
    }
  ];

  return (
    <Card className="custom-card">
      <Box display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <Box sx={{width:"800px"}}>
          <Typography variant="h6" gutterBottom fontFamily="Gotham" fontWeight="400">
            {selectedMenu === "Documentos" ? "Vencimiento de Documentos" : "Movilidad Laboral"}
          </Typography>

          {selectedMenu === "Documentos" && (
            <Select 
              defaultValue="vencidos"
              style={{ width: '40%', marginTop:2, marginBottom: 6, marginLeft: 10 }}
              onChange={handleChangeDocuments}
              value={documentType}
            >
              <Option value="vencidos">Vencidos</Option>
              <Option value="proximos">Próximos a vencer</Option>
            </Select>
          )}
          
          {selectedMenu === "Colaboradores" && (
            <Select 
              defaultValue="entrada"
              style={{ width: '40%', marginTop:2, marginBottom: 6, marginLeft: 10 }}
              onChange={handleChangeEmployeeType}
              value={employeeType}
            >
              <Option value="entrada">Próximos Ingresos</Option>
              <Option value="salida">Próximas Salidas</Option>
            </Select>
          )}

          {(documentType === "proximos" || selectedMenu === "Colaboradores") && (
            <Select
              defaultValue={5}
              style={{ width: '40%',marginTop:2, marginBottom: 6, marginLeft: 10 }}
              onChange={handleChangeDaysToExpire}
              value={daysToExpire}
            >
              <Option value={20}>20 días de proximidad</Option>
              <Option value={15}>15 días de proximidad</Option>
              <Option value={7}>7 días de proximidad</Option>
              <Option value={5}>5 días de proximidad</Option>
            </Select>
          )}
          
        </Box>
        <Box color="text" px={2}>
          <Icon sx={{ cursor: "pointer", fontWeight: "bold", height: "2em" }} onClick={openMenu}>
            <MoreVertIcon />
          </Icon>
        </Box>
        {renderMenu}
      </Box>
      <Box>
        {selectedMenu === "Colaboradores" ? (
          <Table
            dataSource={filteredEmployees}
            columns={employeeColumns}
            pagination={{ pageSize: 5 }}
          />
        ) : (
          <Table
            dataSource={filteredDocuments}
            columns={documentColumns}
            pagination={{ pageSize: 5 }}
          />
        )}
      </Box>
    </Card>
  );
}
export default Teams;
