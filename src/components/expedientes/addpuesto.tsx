import { useState } from 'react';
import { Select, Modal, message, } from 'antd';
import PuestoService from '../../services/puesto.service';
import { CircularProgress } from '@mui/material';
import { Puesto } from './create/createExpediente';

const { Option } = Select;

const posiblesOpciones= [
  'CEO',
  'Director de Recursos Humanos',
  'Gerente de Proyectos',
  'Analista de Datos',
  'Desarrollador de Software',
  'Especialista en Marketing',
  'Asistente Administrativo',
  'Jefe de Ventas',
  'Diseñador Gráfico',
  'Técnico de Soporte',
  'Especialista en Finanzas',
  'Ingeniero de Sistemas',
  'Asistente de RRHH',
  'Administrador de sistemas'
];

interface Props{
    open: boolean;
    setOpen: (value: boolean) => void;
    reload: () => void;
    existentes: Puesto[];
}

const AddPuesto = ({open, setOpen, reload, existentes}: Props) => {
  const [nombresPuestos, setNombresPuestos] = useState<string[]>([]);
  const service = new PuestoService();
  const [loading, setLoading] = useState(false);
  const puestos: string[] = posiblesOpciones.filter(puesto => !existentes.some(p => p.label === puesto));

  const handleOk = async () => {
    const statuses: number[] = [];

    try {
        setLoading(true);

        await Promise.all(nombresPuestos.map(async (nombre) => {
            const data = {
                nombrePuesto: nombre
            }
            const response = await service.agregarPuesto(data);
            statuses.push(response.status);
        }));
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
        reload();
        if (statuses.every(value => value === 200)) {
            setOpen(false);
            setNombresPuestos([]);
            message.success('Operación exitosa!')
        }
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleChange = (value: string[]) => {
    setNombresPuestos(value);
  };

  return (
    <div>
      <Modal 
        title="Agregar puesto" 
        open={open} 
        onOk={handleOk} 
        okText = 'Guardar'
        cancelText = 'Cancelar'
        onCancel={handleCancel} 
        width={400}
        centered
      > 
       {loading ? (
         <CircularProgress sx={{marginLeft: 20}}/>
         ) : 
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Ingrese nombre del puesto"
              onChange={handleChange}
              value={nombresPuestos}
            >
              {puestos.map((puesto) => (
                <Option key={puesto} value={puesto}>
                  {puesto}
                </Option>
              ))}
            </Select>         
        }
      </Modal>
    </div>
  );
};

export default AddPuesto;
