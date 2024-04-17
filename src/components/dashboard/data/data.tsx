import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
//import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";

// Images
import logoXD from "../../../assets/images/small-logos/logo-xd.svg";
//import logoAtlassian from "assets/images/small-logos/logo-atlassian.svg";
//import logoSlack from "assets/images/small-logos/logo-slack.svg";
//import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
//import logoJira from "assets/images/small-logos/logo-jira.svg";
//import logoInvesion from "assets/images/small-logos/logo-invision.svg";
import team1 from "../../../assets/images/team-1.jpg";
import team2 from "../../../assets/images/team-2.jpg";
import team3 from "../../../assets/images/team-3.jpg";
import team4 from "../../../assets/images/team-4.jpg";

interface CompanyProps {
  image: string;
  name: string;
}

interface RowData {
  companies: React.ReactNode;
  members: React.ReactNode;
  budget: React.ReactNode;
  completion: React.ReactNode;
}

export default function data() {
  const avatars = (members: [string, string][]) =>
    members.map(([image, name]) => (
      <Tooltip key={name} title={name} placement="bottom">
        <Avatar
          src={image}
          alt={name}
          sx={{
            border: "1px solid black",
            cursor: "pointer",
            position: "relative",

            "&:not(:first-of-type)": {
              ml: -1.25,
            },

            "&:hover, &:focus": {
              zIndex: "10",
            },
          }}
        />
      </Tooltip>
    ));

  const Company = ({ image, name }: CompanyProps) => (
    <Box display="flex" alignItems="center" lineHeight={1}>
      <Avatar src={image} alt={name} />
      <Typography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </Typography>
    </Box>
  );

  const rows: RowData[] = [
    {
      companies: <Company image={logoXD} name="Material UI XD Version" />,
      members: (
        <Box display="flex" py={1}>
          {avatars([
            [team1, "Ryan Tompson"],
            [team2, "Romina Hadid"],
            [team3, "Alexander Smith"],
            [team4, "Jessica Doe"],
          ])}
        </Box>
      ),
      budget: <Typography variant="caption" color="text" fontWeight="medium">$14,000</Typography>,
      completion: (
        <Box width="8rem" textAlign="left">
          <LinearProgress variant="determinate" value={60} color="info" />
        </Box>
      ),
    },
    // Aquí se incluirían las demás filas de datos...
  ];

  return { columns: [], rows };
}
