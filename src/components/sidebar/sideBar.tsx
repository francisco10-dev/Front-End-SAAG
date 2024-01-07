import { useState, useEffect } from 'react';
import './sideBar.css';
import Divider from '@mui/material/Divider';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { useNavigate } from 'react-router-dom';
import { sideBarOptions, sideBarOption } from './sideBarOptions';
import { Tooltip, useTheme, useMediaQuery} from '@mui/material';

interface SideBarProps {
  isOpen: boolean;
  isOpenState: Record<string, boolean>;
  setIsOpenState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  handleSidebar: () => void;
}

export default function SideBar({ isOpen, isOpenState, setIsOpenState, handleSidebar }: SideBarProps) {
  const navigate = useNavigate();
  const [navigationLinks, setNavigationLinks] = useState<sideBarOption[]>(sideBarOptions);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const storedActive = localStorage.getItem('active');
    if (storedActive) {
      setActiveLinkByText(storedActive);
    }
    return () => {
      resetAllLinks();
    };
  }, []);

  const resetAllLinks = (): void => {
    setNavigationLinks((prevLinks) =>
      prevLinks.map((link) => {
        if (link.sublinks) {
          link.sublinks = link.sublinks.map((sublink) => ({
            ...sublink,
            isActive: false,
          }));
        }
        return { ...link, isActive: false };
      })
    );
    localStorage.removeItem('active');
  };
  
  const handleNavigation = (ruta: any, text: any) => {
    navigate(ruta);
    setActiveLinkByText(text);
    if (isSmallScreen) {
      handleSidebar();
    }
  };

  const toggleDropdown = (text: string) => {
    setIsOpenState((prev) => ({ ...prev, [text]: !prev[text] }));
  };

  const setActiveLinkByText = (text: string): void => {
    setNavigationLinks((prevLinks) =>
      prevLinks.map((link) => {
        const isActive = link.text === text;

        if (link.sublinks) {
          link.sublinks = link.sublinks.map((sublink) => ({
            ...sublink,
            isActive: sublink.text === text,
          }));
        }
        return { ...link, isActive };
      })
    );
    localStorage.setItem('active', text);
  };

  const renderLink = (link: sideBarOption) => {
    const linkElement = (
      <a
        onClick={() => handleNavigation(link.href ? link.href : '', link.text)}
        className={link.isActive ? 'active' : ''}
      >
        <span className="icon">{link.icon}</span>
        <span className="item">{link.text}</span>
      </a>
    );
    return isOpen ? <Tooltip title={link.text} placement='right' arrow>{linkElement}</Tooltip> : linkElement;
  };

  const renderSubLink = (link: sideBarOption) => {
    const optionElement = (
      <a
        href="#"
        className={`has-sublinks ${isOpenState[link.text] ? 'open' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          toggleDropdown(link.text);
        }}
        id='a'
      >
        <span className="icon">{link.icon}</span>
        <span className="item">{link.text}</span>
        <span className="icon">{isOpenState[link.text] ? <ArrowDropDownIcon /> : <ArrowLeftIcon />}</span>
      </a>
    );
    return isOpen ? <Tooltip title={link.text} placement='right' arrow>{optionElement}</Tooltip>: optionElement;
  };

  return (
    <>
      <section className={isOpen ? 'active' : ''}>
        <div className="sidebar">
          <Divider sx={{ marginTop: 5 }} />
          <ul className='ul'>
            {navigationLinks.map((link, index) => (
              <li key={index}>
                {link.sublinks ? (
                  <>
                    {renderSubLink(link)}
                    <ul className={`sublinks ${isOpenState[link.text] ? 'show' : ''}`}>
                      {link.sublinks.map((sublink, subindex) => (
                        <li
                          key={subindex}
                          className={`sublink-item ${isOpenState[link.text] ? 'show' : ''}`}
                        >
                          {renderLink(sublink)}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  renderLink(link)
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
