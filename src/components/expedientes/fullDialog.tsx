import { useState, forwardRef, Fragment, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Colaborador } from '../../services/colaborador.service';
import ExpedienteInfo from './expediente';
import { Box } from '@mui/material';
import AutoCompleteExpediente from './autocomplete';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props{
    colaborador: Colaborador | null;
    open: boolean;
    onClose: (nuevoValor: boolean) => void;
    colaboradores: Colaborador[];
    reload: ()=> void;
}

export default function FullScreenDialog({colaborador, open, onClose, colaboradores, reload}: Props) {


  const [selected, setSelected] = useState<Colaborador | null>(null);

  const handleClose = () => {
    onClose(false);
  };

  useEffect(()=> {
    setSelected(colaborador);
  },[colaborador]);

  const handleSelected = (nuevo: Colaborador| null) => {
    setSelected(nuevo);
    localStorage.setItem('selectedExp', JSON.stringify(nuevo));
  };

  return (
    <Fragment>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        sx={{zIndex: 999}}
      >
        <AppBar sx={{ position: 'fixed', backgroundColor: '#001529'}}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {selected?.nombre}
            </Typography>
          </Toolbar>
        </AppBar>
          <Box width={400} mt={10} zIndex={1000} ml={2}>
              <AutoCompleteExpediente expedientes={colaboradores} setSelected={handleSelected}/>
          </Box> 
          <Box sx={{mt: 2}}>
              <ExpedienteInfo data={selected} reload={reload}/>            
          </Box>          
      </Dialog>
    </Fragment>
  );
}
