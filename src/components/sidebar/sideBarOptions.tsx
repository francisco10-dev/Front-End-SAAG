import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';

export interface Sublink {
  href: string;
  text: string;
  icon: JSX.Element;
  isActive: boolean;
}

export interface sideBarOption {
  href?: string;
  icon: JSX.Element;
  text: string;
  isActive?: boolean;
  sublinks?: Sublink[];
}

export const sideBarOptions: sideBarOption[] = [
  {
    href: '/',
    icon: <HomeIcon />,
    text: 'Dashboard',
    isActive: true,
  },
  {
    icon: <PeopleIcon />,
    text: 'Colaboradores',
    sublinks: [
      {
        href: '/solicitudes',
        text: 'Solicitudes',
        icon: <TextSnippetIcon />,
        isActive: false,
      },
      {
        href: '/solicitud-form',
        text: 'Solicitud',
        icon: <TextSnippetIcon />,
        isActive: false,
      },
      {
        href: '/ausencias',
        text: 'Ausencias',
        icon: <AccessTimeIcon />,
        isActive: false,
      },
      {
        href: '/expediente',
        text: 'Expedientes',
        icon: <FolderCopyIcon />,
        isActive: false,
      },
      {
        href: '/auditorias',
        text: 'Auditorías Tablas',
        icon: <FolderCopyIcon />,
        isActive: false,
      },
      {
        href: '/auditorias-login',
        text: 'Auditorías Login',
        icon: <FolderCopyIcon />,
        isActive: false,
      },
    ],
  },
];
