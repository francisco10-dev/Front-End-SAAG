import { useMemo } from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { } from '@mui/x-charts';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';



interface BarCardProps {
    color: string;
    title: string;
    description?: string | React.ReactNode;
    chart: {
        labels: string[];
        datasets: {
          label: string;
          data: number[];
        };
      };
    info: string;
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BarCard({color, title, description, chart, info }: BarCardProps) {
    const chartData = {
        labels: chart.labels,
        datasets: [{
          label: chart.datasets.label,
          data: chart.datasets.data,
          backgroundColor: "rgb(73, 163, 241)",
          borderWidth: 0,
          weight: 5,
          borderRadius: 4,
          fill: false,
          maxBarThickness: 35,
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
        scales: {
          y: {
            grid: {
              drawBorder: false,
              display: true,
              drawOnChartArea: true,
              drawTicks: false,
              borderDash: [5, 5],
              color: "#b2b9bf",
            },
            ticks: {
              display: true,
              padding: 10,
              color: "white",
            },
          },
          x: {
            grid: {
              drawBorder: false,
              display: false,
              drawOnChartArea: true,
              drawTicks: true,
            },
            ticks: {
              display: true,
              color: "white",
              padding: 10,
            },
          },
        },
    };

    return (
        <Card sx={{ height: "100%", overflow: "visible", overflowWrap: "break-word",position: "relative"}}>
            <Box padding="1rem" > 
                {useMemo(
                    () => (
                        <Box display = "flex"
                            bgcolor= {color}
                            py={2}
                            pr={0.5}
                            mt={-5}
                            height={210}
                            borderRadius= "0.5rem"
                            boxShadow= "rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(0, 187, 212, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem"
                        >
              
                            <Bar
                                 data={chartData} options={chartOptions} redraw
                            />
                        </Box>
                    ),
                    [chart, color]
                )}
                <Box pt={3} pb={1} px={1}>
                    <Typography variant="h6" fontSize="19px" fontWeight="400" textTransform="capitalize" fontFamily= 'Gotham' >
                        {title}
                    </Typography>
                    <Typography component="div" variant="button" color="text" fontWeight="400" fontSize="small" mb={2} fontFamily= 'Gotham' >
                        {description}
                    </Typography>
                    <Divider />
                    <Box display="flex" alignItems="center" mt={1}>
                    <Icon sx={{marginTop:"10px", width:"30px",height:"30px", fontSize:"small"}}>
                        <ErrorOutlineIcon/>       
                    </Icon>
                        <Typography fontSize="12px" fontWeight="light"  variant="button" color="gray" fontFamily= 'Gotham'  lineHeight={1} sx={{ mt: 1.15, mr: 0.5 }}>
                            
                            {info}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Card>
    );
}

BarCard.propTypes = {  
    color: PropTypes.string.isRequired,  
    title: PropTypes.string.isRequired,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    chart: PropTypes.shape({
        labels: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        datasets: PropTypes.shape({
          label: PropTypes.string.isRequired,
          data: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired ,
        }).isRequired,
      }).isRequired,
    info: PropTypes.string.isRequired,
};

export default BarCard;
