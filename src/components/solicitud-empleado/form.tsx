import React, { useState } from 'react';
import { Input, Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/lib/checkbox';

const Form = () => {
  const [conGoce, setConGoce] = useState(false);
  const [sinGoce, setSinGoce] = useState(false);

  const handleConGoceChange = (e: CheckboxChangeEvent) => {
    setConGoce(e.target.checked);
    if (e.target.checked) {
      setSinGoce(false); // Asegurarse de que solo uno puede estar marcado a la vez
    }
  };

  const handleSinGoceChange = (e: CheckboxChangeEvent) => {
    setSinGoce(e.target.checked);
    if (e.target.checked) {
      setConGoce(false); // Asegurarse de que solo uno puede estar marcado a la vez
    }
  };

  return (
    <div>
      <h1>Este es un nuevo componente de React</h1>
      <Input placeholder="Nombre colaborador" />
      <Input placeholder="Nombre encargado" />
      <Checkbox id="checkbox1" checked={conGoce} onChange={handleConGoceChange}>Con goce</Checkbox>
      <Checkbox id="checkbox2" checked={sinGoce} onChange={handleSinGoceChange}>Sin goce</Checkbox>
    </div>
  );
}

export default Form;
