import { useMemo } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

interface LineCardProps {
    color: string;
    title: string;
    description?: string | React.ReactNode;
    chart: {
        labels: string[];
        data: number[];
    };
}

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );

function LineCard({ color, title, description, chart }: LineCardProps) {

    const chartData = {
        labels: chart.labels,
        datasets: [{
          label: "Ausentismo",
          data: chart.data,
          pointBorderColor: "transparent",
          pointBackgroundColor: "white",
          tension: 0,
          pointRadius: 4,
          borderWidth: 4,
          borderColor: "rgb(73, 163, 241)",
          fill: false,
          maxBarThickness: 6,
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
            mode: "index" as const, 
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
                    drawOnChartArea: false,
                    drawTicks: false,
                    borderDash: [5, 5],
                    color: "white",
                },
                    ticks: {
                        display: true,
                        color: "white",
                        padding: 20,
                    },
                },
             },
        };      



    return (
        <Card sx={{ height: "100%", overflow: "visible", overflowWrap: "break-word", position: "relative" }}>
            <Box padding="1rem">
                {useMemo(
                    () => (
                        <Box display = "flex"
                            bgcolor={color}
                            py={2}
                            pr={0.5}
                            mt={-5}
                            height={210}
                            borderRadius= "0.5rem"
                            boxShadow= "rgba(0, 0, 0, 0.14) 0rem 0.25rem 1.25rem 0rem, rgba(0, 187, 212, 0.4) 0rem 0.4375rem 0.625rem -0.3125rem"
                        >
                            <Line
                                data={chartData} options={chartOptions} redraw
                            />
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
                            <ErrorOutlineIcon/>
                        </Icon>
                        <Typography fontSize="12px" fontWeight="light"  variant="button" color="gray" fontFamily= 'Gotham' lineHeight={1} sx={{ mt: 1.15, mr: 0.5 }}>
                        Última actualización: {new Date().toLocaleTimeString()}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Card>
    );
}

LineCard.propTypes = {
    color: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    chart: PropTypes.shape({
        labels: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        data: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    }).isRequired,
};

export default LineCard;

