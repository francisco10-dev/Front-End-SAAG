import { DatePicker, Radio } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs'; 
import React from 'react';
import { RadioChangeEvent } from 'antd/lib/radio'; 

interface Props {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  radioValue: number;
  setRadioValue: (value: number) => void;
}

const DatePickerRadioGroup: React.FC<Props> = ({ selectedYear, setSelectedYear, radioValue, setRadioValue }) => {
  const handleDatePickerChange = (_date: Dayjs | null, dateString: string | string[]) => {
    if (typeof dateString === 'string') {
      const year = dayjs(dateString, 'YYYY').year();
      setSelectedYear(year);
    }
  };

  const handleRadioChange = (e: RadioChangeEvent) => {
    setRadioValue(Number(e.target.value));
  };

  return (
      <div>
        <DatePicker
          picker="year"
          onChange={handleDatePickerChange}
          value={dayjs(`${selectedYear}`, 'YYYY')}
          style={{ marginBottom: '1rem' }}
          suffixIcon={<CalendarOutlined />}
        />
        <Radio.Group
          name="radiogroup"
          defaultValue={1}
          value={radioValue}
          onChange={handleRadioChange}
          style={{ marginLeft: '1rem' }}
        >
          <Radio value={1}>AMBOS</Radio>
          <Radio value={2}>SGS</Radio>
          <Radio value={3}>CGS</Radio>
        </Radio.Group>
      </div>
  );
};

export default DatePickerRadioGroup;
