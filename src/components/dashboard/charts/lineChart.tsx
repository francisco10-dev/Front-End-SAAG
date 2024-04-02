import { useMemo } from "react";
import PropTypes from "prop-types";
import { LineChart } from '@mui/x-charts/LineChart';
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface LineCardProps {
    color: string;
    title: string;
    description?: string | React.ReactNode;
    chart: {
        labels: string[];
        data: number[];
    };
}

function LineCard({ color, title, description, chart }: LineCardProps) {
    return (
        <Card sx={{ height: "100%", overflow: "visible", overflowWrap: "break-word", position: "relative" }}>
            <Box padding="1rem">
                {useMemo(
                    () => (
                        <Box
                            bgcolor={color}
                            py={2}
                            pr={0.5}
                            mt={-4.6}
                            height={200}
                            borderRadius="0.75rem"
                        >
                            <LineChart
                                xAxis={[{scaleType:"band", data: chart.labels }]}
                                series={[
                                {
                                    data: chart.data,
                                },
                            ]}height={180} width={330}
                            />
                        </Box>
                    ),
                    [chart, color]
                )}
                <Box pt={3} pb={1} px={1}>
                    <Typography variant="h6" textTransform="capitalize">
                        {title}
                    </Typography>
                    <Typography component="div" variant="button" color="text" fontWeight="light" fontSize="small" mb={2}>
                        {description}
                    </Typography>
                    <Divider />
                    <Box display="flex" alignItems="center" mt={1}>
                        <Icon sx={{ marginTop: "10px", width: "30px", height: "30px", fontSize: "small" }}>
                            <ErrorOutlineIcon/>
                        </Icon>
                        <Typography fontSize="small" variant="button" color="gray" lineHeight={1} sx={{ mt: 1.15, mr: 0.5 }}>
                            Última solicitud hace 7 segundos
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