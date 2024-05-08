import React, { useState, useEffect } from 'react';
import { Select, Form, Spin } from 'antd';
import ColaboradorService, { Colaborador } from '../../services/colaborador.service';

const ColaboradorNameSelect: React.FC<{ onSelect: (name: string) => void }> = ({ onSelect }) => {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const cargarNombresColaboradores = async () => {
      try {
        const colaboradorService = new ColaboradorService();
        const colaboradoresData = await colaboradorService.obtenerColaboradores();
        setColaboradores(colaboradoresData);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar nombres de colaboradores:', error);
        setLoading(false);
      }
    };

    cargarNombresColaboradores();
  }, []);

  return (
    <Form.Item
      name="selectSub"
      label="Nombre del sustituto"
      rules={[{ required: true, message: 'Seleccione el sustituto' }]}
    >
        <Select
          showSearch
          placeholder={loading ? <><Spin size="small" /> Cargando...</> : "Selecciona un colaborador"}
          optionFilterProp="children"
          filterOption={(input: string, option?: { children: React.ReactNode }) =>
            (option?.children as string).toLowerCase().includes(input.toLowerCase())
          }
          onSelect={(option) => onSelect(option?.toString())} 
          style={{ width: 200 }}
          disabled={loading}
        >
          {colaboradores.map((colaborador, index) => (
            <Select.Option key={index} value={colaborador.nombre}>
              {colaborador.nombre}
            </Select.Option>
          ))}
        </Select>
    </Form.Item>
  );
};

export default ColaboradorNameSelect;
