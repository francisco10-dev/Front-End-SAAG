import { Modal, Spin } from 'antd';
import FileViewer from './pdf';
import { Box } from '@mui/material';
import ExpedienteService, { Documento } from '../../../services/expediente.service';
import { useState, useEffect } from 'react';
import {CircularProgress} from '@mui/material';

interface Props {
  setOpen: (value: boolean) => void;
  open: boolean;
  id: number;
  fileType: 'image' | 'pdf';
}

const PreviewPdf = ({ open, setOpen, id, fileType }: Props) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const service = new ExpedienteService();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fileBlob = await service.getDocument(id);
        const blobUrl = URL.createObjectURL(fileBlob);
        setFileUrl(blobUrl);
      } catch (error) {
        console.error('Error fetching file:', error);
        // Manejar el error según sea necesario
      }finally{
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCancel = () => {
    setOpen(false);
  };


  return (
    <> 
        <Modal
          open={open}
          onCancel={handleCancel}
          cancelText="Cerrar"
          okButtonProps={{ style: { display: 'none' } }}
          width={loading ? 'auto' : (fileType === 'image' ? 'auto' : '80%')} 
          centered
          style={{ zIndex: 1000 }}
        > 
        {loading ? (
          <Box>
           <h6>Cargando...</h6>
          </Box>
        ) : (
          <Box maxHeight={500} overflow="auto">
            {fileUrl && <FileViewer fileUrl={fileUrl} fileType={fileType} />}
          </Box>
        )}
        </Modal>
    </>
  );
};

export default PreviewPdf;
