import PropTypes from "prop-types";
import Link from "@mui/material/Link";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Typography } from "antd";
import { Box } from "@mui/material";

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
        &copy; {new Date().getFullYear()}, made with
        <Box fontSize={10} color="text" mb={-0.5} mx={0.25}>
          <FavoriteIcon color="inherit" fontSize="inherit">
            
          </FavoriteIcon>
        </Box>
        by
        <Link href={href} target="_blank">
          <Typography variant="button" fontWeight="small" >
            &nbsp;{name}&nbsp;
          </Typography>
        </Link>
        for a better web.
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
  company: { href: "https://www.creative-tim.com/", name: "Creative Tim" },
  links: [
    { href: "https://www.creative-tim.com/", name: "Creative Tim" },
    { href: "https://www.creative-tim.com/presentation", name: "About Us" },
    { href: "https://www.creative-tim.com/blog", name: "Blog" },
    { href: "https://www.creative-tim.com/license", name: "License" },
  ],
};

export default Footer;