import { useState } from 'react';
import { Button } from '@mui/material';
import ExpedienteService from '../../services/expediente.service';
import { saveAs } from 'file-saver';

const FileDownloader = ({ fileId }: { fileId: number }) => {
  const [error, setError] = useState<string | null>(null);

  const downloadFile = async () => {
    try {
      const service = new ExpedienteService();
      const fileBlob = await service.getDocument(fileId);

      // Utiliza file-saver para guardar el archivo
      saveAs(fileBlob, `archivo.${fileBlob.type.split('/')[1]}`);
    } catch (error) {
      //@ts-ignore
      setError(error.message);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={downloadFile}>
        Descargar Archivo
      </Button>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default FileDownloader;
