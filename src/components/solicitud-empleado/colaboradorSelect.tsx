import React, { useState, useEffect } from 'react';
import { Select, Form, Spin } from 'antd';
import ColaboradorService, { Colaborador } from '../../services/colaborador.service';

export interface ColaboradorOption {
  value: string;
  label: string;
  colaborador: Colaborador;
  supervisor: { nombre: string } | null;
}

const ColaboradorSelect: React.FC<{ onSelect: (option: ColaboradorOption) => void }> = ({ onSelect }) => {
  const [colaboradores, setColaboradores] = useState<ColaboradorOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const colaboradorService = new ColaboradorService();

  useEffect(() => {
    const cargarColaboradores = async () => {
      try {
        const colaboradoresData = await colaboradorService.obtenerColaboradores();
        const colaboradoresOptions = colaboradoresData.map((colaborador) => ({
          value: colaborador.idColaborador.toString() ?? null,
          label: colaborador.nombre,
          colaborador: colaborador,
          supervisor: colaborador.supervisor || null
          
        }));
        setColaboradores(colaboradoresOptions);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar colaboradores:', error);
        setLoading(false);
      }
    };

    cargarColaboradores();
  }, []);

  return (
    <Form.Item
      name="selectColab"
      label="Seleccione el colaborador"
      rules={[{ required: true, message: 'Debe seleccionar un colaborador' }]}
    >
      <Select
        showSearch
        placeholder={loading ? <><Spin size="small" /> Cargando...</> : "Selecciona un colaborador"}
        optionFilterProp="children"
        filterOption={(input: string, option?: { label: string; value: string }) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        options={colaboradores}
        onSelect={(_value, option) => onSelect(option as ColaboradorOption)}
        style={{ width: 200,zIndex:0 }}
        disabled={loading}
      />
    </Form.Item>
  );
};

export default ColaboradorSelect;
