import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/lib/upload/interface';
import { Upload } from 'antd';
import { useMediaQuery } from 'react-responsive';

const { Dragger } = Upload;

const UploadFiles: React.FC<{ onFilesChange: (files: UploadFile[]) => void }> = ({ onFilesChange }) => {
  const isLargeScreen = useMediaQuery({ query: '(min-width: 992px)' }); 

  const beforeUpload = (file: UploadFile) => {
    onFilesChange([file]);
    return false; 
  };

  const props = {
    name: 'file',
    multiple: true,
    beforeUpload,
    showUploadList: false,
  };

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      {isLargeScreen? <p className="ant-upload-text">Haz clic o arrastra para subir archivos</p> 
        : <p>Subir archivos</p>}
      
    </Dragger>
  );
};

export default UploadFiles;
