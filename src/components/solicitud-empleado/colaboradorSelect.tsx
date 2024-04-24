import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import ColaboradorService, { Colaborador } from '../../services/colaborador.service';
import { Usuario } from '../../services/usuario.service';

export interface ColaboradorOption {
  value: string;
  label: string;
  colaborador: Colaborador;
  usuario:Usuario;
  supervisor: { nombre: string } | null;
}

const ColaboradorSelect: React.FC<{ onSelect: (option: ColaboradorOption) => void }> = ({ onSelect }) => {
  const [colaboradores, setColaboradores] = useState<ColaboradorOption[]>([]);

  useEffect(() => {
    const cargarColaboradores = async () => {
      try {
        const colaboradorService = new ColaboradorService();
        const colaboradoresData = await colaboradorService.obtenerColaboradoresConSuUsuario();
        const colaboradoresOptions = colaboradoresData.map(({ colaborador, usuario }) => ({
          value: colaborador.idColaborador.toString() ?? null,
          label: colaborador.nombre,
          colaborador: colaborador,
          usuario: usuario,
          supervisor: colaborador.supervisor || null
        }));
        
        setColaboradores(colaboradoresOptions);
      } catch (error) {
        console.error('Error al cargar colaboradores:', error);
      }
    };

    cargarColaboradores();
  }, []);

  return (
    <Select
      showSearch
      placeholder="Selecciona un colaborador"
      optionFilterProp="children"
      filterOption={(input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={colaboradores}
      onSelect={(value, option) => onSelect(option as ColaboradorOption)}
      style={{ width: 200 }}
    />
  );
};

export default ColaboradorSelect;
