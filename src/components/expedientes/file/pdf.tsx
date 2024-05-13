import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css'; // Importa los estilos necesarios


interface FileViewerProps {
  fileUrl: string;
  fileType: 'pdf' | 'image';
}

const FileViewer: React.FC<FileViewerProps> = ({ fileUrl, fileType }) => {


  return (
    <div>
      {fileType === 'pdf' ? (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer fileUrl={fileUrl} />
        </Worker>
      ) : (
        <img src={fileUrl} alt="Preview" />
      )}
    </div>
  );
};

export default FileViewer;
