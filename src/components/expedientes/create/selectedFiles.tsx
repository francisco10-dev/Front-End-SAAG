import { Box } from "@mui/material";
import type { UploadFile } from 'antd/lib/upload/interface';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Popconfirm } from 'antd';
import { MinusCircleOutlined  } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';

interface Props{
    selectedFiles: UploadFile[];
    handleRemoveFile: (index: any) => void;
    setSelectedFiles: (files: UploadFile[]) => void;
}

const SelectedFiles = ({selectedFiles, handleRemoveFile, setSelectedFiles}: Props) => {

    const isLargeScreen = useMediaQuery({ query: '(min-width:750px)' }); 

    return (
        <Box>
            {selectedFiles.length > 0? 
                <Box sx={{width: 725}}>
                  <TableContainer component={Paper} sx={{width: isLargeScreen? 700 : 350}}>
                    <Table sx={{ minWidth: 250 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Archivo</TableCell>
                          <TableCell align='center'>
                            <Popconfirm
                                title="Quitar archivos"
                                description="Limpiar?"
                                onConfirm={() => setSelectedFiles([])}
                                okText="Sí"
                                cancelText="No"
                              >
                                <MinusCircleOutlined style={{color: 'red', fontSize: 18}}/>
                            </Popconfirm>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedFiles.map((row, index) => (
                          <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align='center'>
                              <Popconfirm
                                title="Quitar archivo"
                                description="Quitar archivo de la lista?"
                                onConfirm={() => handleRemoveFile(index)}
                                okText="Sí"
                                cancelText="No"
                              >
                                <MinusCircleOutlined style={{color: 'red', fontSize: 18}}/>
                              </Popconfirm>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box> : <Box></Box> 
              }
        </Box>
    );
}

export default SelectedFiles;