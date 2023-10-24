import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';

interface SubOption {
  text: string;
  link: string;
  icon: JSX.Element;
}

interface Module {
  text: string;
  icon: JSX.Element;
  subOptions?: SubOption[]; // Agregar subopciones aquí
  link: string;
}

const modules: Module[] = [
  {
    text: 'Módulo 1',
    icon: <LibraryBooksIcon />,
    link: '',
    subOptions: [
      { text: 'Sub opción 1', link: '/prueba',icon: <LibraryBooksIcon /> },
      { text: 'Sub opción 2', link: '/', icon: <LibraryBooksIcon /> },
    ],
  },
  { text: 'Módulo 2', icon: <AccountCircleIcon />, link: '/' },
  { text: 'Módulo', icon: <AssignmentTurnedInIcon />, link: '/prueba' },
  { text: 'Módulo', icon: <MailIcon />, link: '/ruta' },
  { text: 'Módulo', icon: <InboxIcon />, link: '/ruta' },
  { text: 'Módulo', icon: <AccountCircleIcon />, link: '/ruta' },
  { text: 'Módulo', icon: <AccountCircleIcon />, link: '/ruta' },
  { text: 'Módulo', icon: <AccountCircleIcon />, link: '/ruta' },
];

interface SidebarListProps {
  open: boolean;
}

const SidebarList: React.FC<SidebarListProps> = ({ open }) => {
  const navigate = useNavigate();
  const [expandedSubOptions, setExpandedSubOptions] = React.useState<string | null>(null);

  return (
    <List>
      {modules.map((module, index) => (
        <div key={index}>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              onClick={() => {
                if (module.subOptions && expandedSubOptions === module.text) {
                  setExpandedSubOptions(null);
                } else if (module.subOptions) {
                  setExpandedSubOptions(module.text);
                } else {
                  navigate(module.link);
                }
              }} 
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {module.icon}
              </ListItemIcon>
              <ListItemText primary={module.text} sx={{ opacity: open ? 1 : 0 }} />
              {module.subOptions && open && (
                <ListItemIcon sx={{ minWidth: 0 }}>
                  <ExpandMoreIcon /> {/* Icono de flecha hacia abajo para indicar subopciones */}
                </ListItemIcon>
              )}
            </ListItemButton>
          </ListItem>
          {/* Renderizar subopciones si el módulo está expandido y open es true */
          expandedSubOptions === module.text && module.subOptions && open && (
            <List>
              {module.subOptions.map((subOption, subIndex) => (
                <ListItem
                  key={subIndex}
                  disablePadding
                  sx={{ display: 'block', pl: 4 }} // Ajusta la sangría para las subopciones
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: 'initial',
                      px: 2.5,
                    }}
                    onClick={() => {
                      navigate(subOption.link);
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {subOption.icon}
                    </ListItemIcon> 
                    <ListItemText primary={subOption.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </div>
      ))}
    </List>
  );
};

export default SidebarList;
