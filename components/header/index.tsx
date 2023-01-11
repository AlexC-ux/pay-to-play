import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useIntl } from "react-intl";


export default function Header(){

  const intl = useIntl();
  
    return <>
    <AppBar sx={{
        bgColor:'#edf',
        display:"block",
        position:"relative",
    }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pay2Play
          </Typography>
          <Button color="inherit">{intl.formatMessage({ id: "HEADER.authbtn" })}</Button>
        </Toolbar>
    </AppBar>
    </>
}