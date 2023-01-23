import { MenuOutlined } from "@mui/icons-material";
import { IconButton, Menu } from "@mui/material";

export default function BurgerNav(props: { authorized: boolean }) {
    return <>
        <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
        >
            <MenuOutlined />
        </IconButton>

        
    </>
}