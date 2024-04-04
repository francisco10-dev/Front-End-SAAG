import { UserOutlined } from "@ant-design/icons"
import { Box } from "@mui/material"
import { Avatar } from "antd"
import { useAuth } from "../../authProvider"

interface Props{
    setOpenInfo: () => void;
}

const UserInfo = ({setOpenInfo}: Props) => {

    const {colaborador, userRole, photo} = useAuth();
    const nombre = colaborador?.nombre.split(" ")[0];

    return (

        <Box style={{ display: 'flex', alignItems: 'center', padding: '15px', marginTop: 20 }}>
            <Box sx={{cursor: 'pointer'}} onClick={()=> setOpenInfo()} >
                {photo ? 
                 <Avatar size={60} src={photo} style={{ marginBottom: '8px', marginRight: 15 }}/> :
                 <Avatar size={50} icon={<UserOutlined />} style={{ marginBottom: '8px', marginRight: 15 }}/>                
                }
                
            </Box>
            <Box>
                <h4 style={{ margin: 0, color: '#fff' }}>{nombre}</h4>
                <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>{userRole}</p>
            </Box>
        </Box>
    )
}

export default UserInfo;