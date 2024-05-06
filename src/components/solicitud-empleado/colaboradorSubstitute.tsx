import React, { useState, useEffect } from 'react';
import { Select, Form } from 'antd';
import ColaboradorService, { Colaborador } from '../../services/colaborador.service';

const ColaboradorNameSelect: React.FC<{ onSelect: (name: string) => void }> = ({ onSelect }) => {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);

  useEffect(() => {
    const cargarNombresColaboradores = async () => {
      try {
        const colaboradorService = new ColaboradorService();
        const colaboradoresData = await colaboradorService.obtenerColaboradores();
        setColaboradores(colaboradoresData);
      } catch (error) {
        console.error('Error al cargar nombres de colaboradores:', error);
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
        placeholder="Selecciona un colaborador"
        optionFilterProp="children"
        filterOption={(input: string, option?: { children: React.ReactNode }) =>
          (option?.children as string).toLowerCase().includes(input.toLowerCase())
        }
        onSelect={(option) => onSelect(option?.toString())} // Convertir option a string
        style={{ width: 200 }}
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
