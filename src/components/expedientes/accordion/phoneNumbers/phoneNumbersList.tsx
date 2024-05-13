import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, IconButton, Typography } from '@mui/material';
import ExpedienteService from '../../../../services/expediente.service';
import { useEffect, useState } from 'react';
import { MinusCircleOutlined, EditOutlined, CloseCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { Input, Popconfirm, message } from 'antd';
import AddNumbers from './addNumbers';
import ColaboradorService from '../../../../services/colaborador.service';

interface Prop{
    idColaborador: number;
}

interface Data{
    numeroTelefono: string;
    idTelefono: number;
}

export default function PhoneNumbers({idColaborador}: Readonly<Prop>) {

    const service = new ExpedienteService();
    const [phoneNumbers, setPhoneNumbers] = useState<Data[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeCell, setActiveCell] = useState<number | null>(null);
    const [newNumber, setNewNumber] = useState('');
    const [initialValue, setInitialValue] = useState('');
    const [id, setId] = useState(idColaborador);

    useEffect(() => {
      setId(idColaborador);
    },[ idColaborador]);

    const loadPhones = async () => {
        try {
            const response = await service.getEmployeeNumbers(id);
            setPhoneNumbers(response.data);
        } catch (error) {
           console.log(error);
        }
    }

    function getPhoneNumbers (){
      return phoneNumbers.map((item) => item.numeroTelefono);
    }

    const handleDelete = async (id: number) => {
        try {
           setLoading(true);
            const response = await service.deletePhoneNumber(id);
           if(response === 200){
             message.success('Número de teléfono eliminado con éxito!');
             loadPhones();
           }else{
             message.error('Hubo un problema al eliminar el número de teléfono. Por favor, inténtelo de nuevo.');
           }
        } catch (error) {
            message.error('Hubo un problema al comunicarse con el servidor. Por favor, inténtelo de nuevo más tarde.');
        }finally{
          setLoading(false);
        }
    }

    useEffect(()=> {
        loadPhones();
    }, [id]);


    const handleLoadPhones = (value: boolean ) => {
      if(value){
        loadPhones();
      }
    }

    const handleChange = (number : string) => {
        setNewNumber(number);
    }

    function validateNumber() {
      if(phoneNumbers.filter(number => newNumber === number.numeroTelefono).length > 0){
        message.error('El número '+ newNumber + ' ya se encuentra registrado.');
        return true;
      }
      return false;  
    }

    const update = async () => {
      if(!validateNumber()){
        try {
            if(activeCell){
              const service = new ColaboradorService();
              const response = await service.actualizarTelefono(activeCell, newNumber);
              if(response === 200){
                message.success('Actualizado exitosamente!');
                loadPhones();
              }  
            }
        } catch (error) {
          message.error('Ocurrió un error al intentar actualizar el registro');
        }finally{
          setActiveCell(null);
        }
      }
    }

    const setActive = (row: Data) => {
      setActiveCell(row.idTelefono);
      setNewNumber(row.numeroTelefono);
      setInitialValue(row.numeroTelefono);
    }

    function enabled(){
      return initialValue === newNumber;
    }


  return (
    <Box>
      {phoneNumbers.length > 0 ? 
        <Box sx={{display: 'flex'}}>
          <TableContainer component={Box} sx={{maxWidth: 400}}>
            <Table sx={{ width: 400, border: 'solid 1px #ddd' }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '33%' }}>Número de teléfono</TableCell>
                  <TableCell align='center' sx={{ width: '33%' }}>Eliminar</TableCell>
                  <TableCell align='center' sx={{ width: '33%' }}>Editar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {phoneNumbers.map((row) => (
                  <TableRow
                    key={row.idTelefono}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="td" scope="row" sx={{ width: '33%' }}>
                      {activeCell === row.idTelefono ? (
                        <Input 
                          value={newNumber} 
                          onChange={(e) => handleChange(e.target.value)}
                          size='small'
                          type='number'
                        />
                      ) : (
                        row.numeroTelefono
                      )}
                    </TableCell>
                    <TableCell align='center' sx={{ width: '33%' }}>
                      <Popconfirm
                        title="Eliminar"
                        description="Eliminar número de teléfono?"
                        onConfirm={() => handleDelete(row.idTelefono)}
                        okText="Sí"
                        okButtonProps={{loading: loading}}
                        cancelText="Cancelar"
                      >
                        <MinusCircleOutlined style={{color: 'red', fontSize: 18}}/>
                      </Popconfirm>
                    </TableCell>
                    <TableCell component="td" scope="row" align='center' >
                      {activeCell === row.idTelefono ? (
                        <Box display='flex' alignItems="center" justifyContent="center" width="100%">
                        <IconButton color='error' size='small' onClick={() => setActiveCell(null)} style={{ marginRight: '8px' }}>
                          <CloseCircleFilled />
                        </IconButton>
                        {!enabled() && (
                          <Popconfirm
                            title="Actualizar"
                            description="Actualizar número de teléfono?"
                            onConfirm={() => update()}
                            okText="Actualizar"
                            okButtonProps={{ loading: loading }}
                            cancelText="Cancelar"
                            style={{width: '100%'}}
                          >
                            <CheckCircleFilled style={{ color: 'blue', fontSize: 18 }} />
                          </Popconfirm>
                        )}
                      </Box>
                      ) : (
                        <IconButton color='primary' size='small' onClick={() => setActive(row)}>
                          <EditOutlined/>
                        </IconButton>   
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer> 
          <Box sx={{marginLeft: 2}}>
            <AddNumbers idColaborador={id} loadPhones={handleLoadPhones} phoneNumbers={getPhoneNumbers()}/>
          </Box>
        </Box>
        : <Box>
            <Box>
              <Box>
                <Typography variant='body2' sx={{textAlign: 'center', padding: 3}}>No hay números de teléfono para mostrar</Typography>
              </Box>
            </Box>
            <Box>
              <AddNumbers idColaborador={id} loadPhones={handleLoadPhones} phoneNumbers={getPhoneNumbers()}/>
            </Box>
          </Box> 
        }
    </Box>
  );
}
