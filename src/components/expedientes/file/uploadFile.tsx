import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/lib/upload/interface';
import { Upload } from 'antd';
import { useMediaQuery } from 'react-responsive';

const { Dragger } = Upload;

interface UploadFilesProps {
  onFilesChange: (files: UploadFile[]) => void;
  isMultiple: boolean;
  message: string
}

const UploadFiles: React.FC<UploadFilesProps> = ({ onFilesChange, isMultiple, message }) => {
  const isLargeScreen = useMediaQuery({ query: '(min-width: 992px)' }); 

  const beforeUpload = (file: UploadFile) => {
    onFilesChange([file]);
    return false; 
  };

  const props = {
    name: 'file',
    multiple: isMultiple,
    beforeUpload,
    showUploadList: false,
    accept: '.pdf,image/*'
  };

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      {isLargeScreen? <p className="ant-upload-text">{message}</p> 
        : <p>Subir</p>}
      
    </Dragger>
  );
};

export default UploadFiles;
