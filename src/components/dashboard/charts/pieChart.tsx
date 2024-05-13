import { useMemo } from "react";
import PropTypes from "prop-types";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";  
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';


interface PieCardProps {
    color: string;
    title: string;
    description?: string | React.ReactNode;
    chart: {
        labels: string[];
        data: number[];
    };
    info: string;
}

ChartJS.register(ArcElement, Tooltip, Legend);

function PieCard({ color, title, description, chart, info }: PieCardProps) {

  const chartData = {
    labels: chart.labels,
    datasets: [{
      data: chart.data,
      weight: 9,
      cutout: 0,
      tension: 0.9,
      pointRadius: 2,
      borderWidth: 2,
      fill: false,
      backgroundColor: [
        '#007bff', 
        '#2e59d9', 
        '#00bcd4',
        '#4caf50',
        '#ffeb3b',
        '#884EA0',
        'rgb(236, 64, 122)'

      ],
    }]
  };
  
  

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
    },
    interaction: {
        intersect: false,
        mode: "nearest" as const, 
    },
 };   

    return (
      <Card sx={{ height: "100%", overflow: "visible", overflowWrap: "break-word", position: "relative" }}>
        <Box padding="1rem">
          {useMemo(
            () => (
              <Box
                display="flex"
                bgcolor={color}
                py={2}
                mt={-5}
                height={210}
                borderRadius= "0.5rem"
                boxShadow= "rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(0, 187, 212, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem"
                sx={{ overflow: "visible", overflowWrap: "break-word",  justifyContent:"center", alignItems:"center" }} 
              >
                <Pie data={chartData} options={chartOptions} redraw />
              </Box>
            ),
            [chart, color]
          )}
          <Box pt={3} pb={1} px={1}>
            <Typography variant="h6" fontSize="19px" fontWeight="400" textTransform="capitalize" fontFamily= 'Gotham'>
              {title}
            </Typography>
            <Typography component="div" variant="button" color="text" fontWeight="400" fontSize="small" mb={2} fontFamily= 'Gotham'>
              {description}
            </Typography>
            <Divider />
            <Box display="flex" alignItems="center" mt={1}>
              <Icon sx={{ marginTop: "10px", width: "30px", height: "30px", fontSize: "small" }}>
                <ErrorOutlineIcon />
              </Icon>
              <Typography fontSize="12px" fontWeight="light"  variant="button" color="gray" fontFamily= 'Gotham'lineHeight={1} sx={{ mt: 1.15, mr: 0.5 }}>
                {info}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>
    );
  }
  
PieCard.propTypes = {
    color: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    chart: PropTypes.shape({
        labels: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        data: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    }).isRequired,
    info: PropTypes.string.isRequired,
};

export default PieCard;
