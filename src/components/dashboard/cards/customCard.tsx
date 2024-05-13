import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link } from 'react-router-dom';
import '../styles/styles.css'

function CustomCard({ color, title, count, icon, route }: { color: string, title: string, count: string | number, icon: React.ReactNode, route: string }) {
  return (
    <Card className="custom-card" sx={{ overflow: "visible", height:"160px"}}>
      <Box display="flex" justifyContent="space-between" pt={1} px={2}>
        <Box
          sx={{
            bgcolor: color,
            opacity: 20,
            color: color === "light" ? "dark" : "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "4.5rem",
            height: "4.5rem",
            mt: -4,
            lineHeight: 1.625,
            borderRadius: "0.75rem",
            boxShadow: "rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(64, 64, 64, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem",
          }}
        >
            {icon}

        </Box>
        <Box textAlign="right" lineHeight={1.25} mb={2}>
          <Typography variant="button"  fontWeight="bolder" color="grey" fontSize="11px" fontFamily= 'Gotham' >
            {title}
          </Typography>
          <Typography variant="h4" sx={{marginTop:"10px"}} >{count}</Typography>
        </Box>
      </Box>
      <Divider />
      <Box pb={2} px={2} pt={2}
       sx={{     
        display: "flex",
        justifyContent: "center",
        alignItems: "center",     
      }}>
        <Typography component="p" variant="button" color="grey" display="flex">
          <Typography
            component="span"
            variant="button"
            fontWeight="bold" 
          >
             <Link to={route} style={{textDecoration: 'none', color: 'primary', fontFamily: 'Gotham'  }}>
              Ver más
             </Link>
          </Typography>
          &nbsp;
        </Typography>
      </Box>
    </Card>
  );
}

CustomCard.defaultProps = {
  color: "info",
  percentage: {
    color: "success",
    amount: "",
    label: "",
  },
};

CustomCard.propTypes = {
  color: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentage: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "white",
    ]).isRequired,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  icon: PropTypes.node.isRequired,
};

export default CustomCard;
