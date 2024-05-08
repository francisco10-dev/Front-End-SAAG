import { IconButton } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import List from '@mui/material/List';
import { UploadFile } from 'antd/lib/upload/interface';

interface Props{
    handleDeleteFile: (name?: string) => void;
    selectedFiles: UploadFile[];
}

const SelectedFiles = ({ handleDeleteFile, selectedFiles }: Props) => {
    return (
    <Grid item xs={12} md={6}>
        <List dense={true}>
          {selectedFiles.map((file) => 
            <ListItem key={file.uid}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={()=> handleDeleteFile(file.name)} color='error'>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <FolderIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={file.name}
              />
            </ListItem>,
          )}
        </List>
    </Grid>
    );
}

export default SelectedFiles;