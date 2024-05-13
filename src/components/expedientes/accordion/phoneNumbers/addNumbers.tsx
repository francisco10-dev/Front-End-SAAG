import { Box } from '@mui/material';
import { useState } from 'react';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { message, Button, Space, Input } from 'antd';
import ColaboradorService from '../../../../services/colaborador.service';

interface Props{
    idColaborador: number;
    loadPhones : (value: boolean) => void;
    phoneNumbers: string[];
}


const AddNumbers = ({idColaborador, loadPhones, phoneNumbers}: Readonly<Props>) => {

    const [numbers, setNumbers] = useState<string[]>([]);
    const [ loading, setLoading] = useState(false);

    const handleRemovePhoneNumber = (index : number) => {
        const newNumbers = [...numbers];
        newNumbers.splice(index, 1);
        setNumbers(newNumbers);
    };
    
    const handlePhoneNumberChange = (index: number, value: string) => {
        const newNumbers = [...numbers];
        newNumbers[index] = value;
        setNumbers(newNumbers);
    };
      
    const handleAddNumbers = () => {
        setNumbers([...numbers, '']);
    };

    function getValidNumbers (numbers: string[]) {
        const data = deleteDuplicates(numbers);

        const result = data.filter((number) => !phoneNumbers.includes(number));
        const invalidValues = data.filter((number) => phoneNumbers.includes(number));
        if(invalidValues.length > 0){
            invalidValues.map((value => {
                message.error('El número '+ value + ' ya se encuentra registrado.');
            }));
        }
        return result;
    }

    function deleteDuplicates(numbers: string[]){
        const set = new Set(numbers);
        return [...set];
    }

    const handleSubmit = async () => {
        if (numbers) {
          // Filtrar los números de teléfono que no tienen valor
          const validPhoneNumbers = numbers.filter((phoneNumber) => phoneNumber.trim() !== '');
          
          if (validPhoneNumbers.length > 0) {
             const numbers = getValidNumbers(validPhoneNumbers);
            try {
                setLoading(true);
                const service = new ColaboradorService();
                await service.agregarTelefonos(idColaborador, numbers);
                loadPhones(true);
                setNumbers([]); 
            } catch (error) {
                message.error('Ocurrió un error al comunicarse con el servidor, por favor intente más tarde.');
            }finally{
                setLoading(false);
            }
          } else {
            message.error('No hay números de teléfono válidos para enviar.');
          }
        }
    };


    return (
        <Box>
          <Box>
            <Button style={{marginBottom: 25}} type="dashed" onClick={handleAddNumbers} icon={<PlusOutlined />}>
                Agregar
            </Button>
          </Box>
          {numbers.map((number, index) => (
            <Space key={index} style={{ marginBottom: 8, display: 'flex', alignItems: 'center'}}>
              <Input
                style={{ flex: 1  }}
                placeholder="Ingrese"
                value={number}
                onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
                type="number"
              />
              {index >= 0 && (
                <MinusCircleOutlined 
                  onClick={()=> handleRemovePhoneNumber(index)} 
                  style={{color: 'red', fontSize: 18}}
                />
              )}
            </Space>
          ))}
          {numbers.length > 0 && (
            <Box>
                <Button style={{marginBottom: 25}} type='primary' onClick={handleSubmit} loading={loading}>
                   Guardar
                </Button>
            </Box>
          )}
        </Box>
    );
}

export default AddNumbers;