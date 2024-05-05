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
import { isBefore, isAfter, addDays, parseISO } from 'date-fns';
import '../styles/styles.css';

interface Documento {
  idColaborador: number;
  idDocumento: number;
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
  const [daysToExpire, setDaysToExpire] = useState<number>(5);
  const [filteredDocuments, setFilteredDocuments] = useState<Documento[]>([]);
  const [employeeType, setEmployeeType] = useState<'entrada' | 'salida'>('entrada');
  const [filteredEmployees, setFilteredEmployees] = useState<Colaborador[]>([]);
  const [dataSourceEmployees, setDataSourceEmployees] = useState<Colaborador[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<string>("Documentos");



  
  const { Option } = Select;

  const loadDocuments = async () => {
    try {
      const documentsData = await Service.getDocumentos();
      console.log(documentsData)
      const filteredData = documentsData.filter(
        documento => (documento.licencia !== null || documento.curso !== null) &&
                     isAfter(parseISO(documento.fechaVencimiento), new Date())
      );
  
      const dataFilter = filteredData.map(documento => ({
        idDocumento: documento.idDocumento,
        idColaborador: documento.idColaborador,
        nombreArchivo: documento.nombreArchivo,
        fechaVencimiento: documento.fechaVencimiento,
        licencia: documento.licencia,
        curso: documento.curso,
        tipo: documento.licencia ? documento.licencia : documento.curso,
      }));
  
      // Ordenar los documentos por fecha de vencimiento
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

  const handleChangeDaysToExpire = (value: number) => {
    setDaysToExpire(value);
    filterDocumentsByDays(value);
  };


  const filterDocumentsByDays = (days: number) => {
    const currentDate = new Date();
    const expirationDate = addDays(currentDate, days);
    const filtered = dataSourceDocuments.filter((document) => {
      const dateToCheck = parseISO(document.fechaVencimiento);
      return isBefore(dateToCheck, expirationDate);
    });

    setFilteredDocuments(filtered);
  };


  const loadEmployees = async () => {
    try {
      const employeesData = await Service2.obtenerColaboradores();
  
      // Ordenar los colaboradores por fecha de ingreso
      employeesData.sort((a, b) => {
        const dateA = parseISO(a.fechaIngreso);
        const dateB = parseISO(b.fechaIngreso);
        return dateA.getTime() - dateB.getTime();
      });
  
      setDataSourceEmployees(employeesData);
      filterEmployeesByTypeAndDays(employeeType, daysToExpire); // Filtra los colaboradores al cargar
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  const handleChangeEmployeeType = (value: 'entrada' | 'salida') => {
    setEmployeeType(value);
    filterEmployeesByTypeAndDays(value, daysToExpire);
  };

  // ...

  const filterEmployeesByTypeAndDays = (type: 'entrada' | 'salida', days: number) => {
    const currentDate = new Date();
    const targetDate = addDays(currentDate, days);
    
    const filtered = dataSourceEmployees.filter((employee) => {
      const dateToCheckRaw = type === 'entrada' 
        ? employee.fechaIngreso 
        : employee.fechaSalida;
  
      // Si no hay fecha de ingreso o es anterior a la fecha actual, descartar el colaborador
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
    };
  
    fetchData();
  }, []);
  
  useEffect(() => {
    if (dataSourceDocuments.length > 0) {
      filterDocumentsByDays(5); // Filtrar documentos con 5 días de proximidad al cargar
    }
  }, [dataSourceDocuments]);
  
  
  

useEffect(() => {
  if (selectedMenu === "Colaboradores") {
    loadEmployees();
  } else {
    filterDocumentsByDays(daysToExpire);
  }
}, [selectedMenu]);

// Agregar este useEffect para filtrar empleados cuando cambia dataSourceEmployees
useEffect(() => {
  if (dataSourceEmployees.length > 0) {
    filterEmployeesByTypeAndDays(employeeType, daysToExpire); // Filtra empleados con 5 días de proximidad al cargar
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
      title: 'Id',
      dataIndex: 'idDocumento',
      key: 'Id',
    },
    {
      title: 'IdColaborador',
      dataIndex: 'idColaborador',
      key: 'IdColaborador',
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
        <Box>
          <Typography variant="h6" gutterBottom>
            Próximos Vencimientos y Movilidad Laboral
          </Typography>
              <Box mt={3} width={450}>
                <Select
                  defaultValue={5}
                  style={{ width: '40%', marginBottom: 10 }}
                  onChange={handleChangeDaysToExpire}
                  value={daysToExpire}
                >
                  <Option value={20}>20 días de proximidad</Option>
                  <Option value={15}>15 días de proximidad</Option>
                  <Option value={7}>7 días de proximidad</Option>
                  <Option value={5}>5 días de proximidad</Option>
                </Select>
                
                {selectedMenu === "Colaboradores" && (
                <Select 
                  defaultValue="entrada"
                  style={{ width: '40%', marginBottom: 10, marginLeft: 10}}
                  onChange={handleChangeEmployeeType}
                  value={employeeType}
                >
                  <Option value="entrada">Próximos Ingresos</Option>
                  <Option value="salida">Próximas Salidas</Option>
                </Select>
                )}
          </Box>
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
          pagination={{ pageSize: 6 }}
        />
      ) : (
        <Table
          dataSource={filteredDocuments}
          columns={documentColumns}
          pagination={{ pageSize: 6 }}
        />
      )}
      </Box>
    </Card>
  );
}

export default Teams;
