import PropTypes from "prop-types";
import Link from "@mui/material/Link";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, Typography } from "@mui/material";

interface Company {
  href: string;
  name: string;
}

interface LinkItem {
  href: string;
  name: string;
}

interface FooterProps {
  company: Company;
  links: LinkItem[];
}

function Footer({ company, links }: FooterProps) {
  const { href, name } = company;
 

  const renderLinks = () =>
    links.map((link) => (
      <Box key={link.name} component="li" px={2} lineHeight={1}>
        <Link href={link.href} target="_blank">
          <Typography variant="button" fontWeight="regular" color="text">
            {link.name}
          </Typography>
        </Link>
      </Box>
    ));

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection={{ xs: "column", lg: "row" }}
      justifyContent="space-between"
      alignItems="center"
      px={1.5}
      mt={5}
      
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        color="text"
        fontSize={12}
        px={1.5}
      >
        &copy; {new Date().getFullYear()}, hecho con
        <Box fontSize={10} color="text" mb={-0.5} mx={0.25}>
          <FavoriteIcon color="inherit" fontSize="inherit" sx={{marginBottom:"3px"}}>
            
          </FavoriteIcon>
        </Box>
        por
        <Link href={href} target="_blank">
          <Typography variant="caption" fontWeight="small" >
            &nbsp;{name}&nbsp;
          </Typography>
        </Link>
        para una mejor experiencia de trabajo
      </Box>
      <Box
        component="ul"
        sx={({ breakpoints }) => ({
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          listStyle: "none",
          mt: 3,
          mb: 0,
          p: 0,

          [breakpoints.up("lg")]: {
            mt: 0,
          },
        })}
      >
        {renderLinks()}
      </Box>
    </Box>
  );
}

Footer.propTypes = {
  company: PropTypes.shape({
    href: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};

Footer.defaultProps = {
  company: { href: "https://www.acibfunin.com/", name: "estudiantes UNA" },
  links: [
    { href: "https://www.acibfunin.com/", name: "ACIB-FUNIN" },
    { href: "https://www.acibfunin.com/quienes-somos/", name: "Sobre nosotros" },
    { href: "https://www.acibfunin.com/contacto/", name: "Contactos" },
    { href: "https://www.acibfunin.com/biblioteca", name: "Biblioteca" },
  ],
};

export default Footer;
