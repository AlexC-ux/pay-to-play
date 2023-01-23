import { MenuOutlined } from "@mui/icons-material";
import { Box, Button, IconButton, Menu } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';

export default function BurgerNav(props: { authorized: boolean }) {

    const [menuAnchor, setMenuAnchor] = useState<any>(null)

    const menuOpened = Boolean(menuAnchor)

    function getLinks(){

        if (props.authorized) {
            
        }else{
            return<>
            <Button color="secondary" variant="outlined"></Button>
            </>
        }
    }

    return <>
        <IconButton
            id="openNotifsBtn"
            aria-controls={menuOpened ? 'burgernav-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpened ? 'true' : undefined}
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
            onClick={(btn) => {
                setMenuAnchor(btn.currentTarget)
            }}
        >
            <MenuOutlined />
        </IconButton>

        <Menu
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            id="burgernav-menu"
            aria-labelledby="openNotifsBtn"
            open={menuOpened}
            onClose={() => { setMenuAnchor(null) }}
            sx={{
                position: "absolute",
            }}>
            <Stack
                sx={{
                    px: 2,
                    py: 0.5,
                    minWidth: "300px",
                    width: "60vw",
                    maxWidth: "750px",
                    maxHeight: "500px",
                }}
                spacing={1}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "end"
                    }}>
                    <IconButton
                        onClick={() => { setMenuAnchor(null) }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                {}
            </Stack>
        </Menu>
    </>
}