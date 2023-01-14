import { Backdrop, Paper, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react"
import { useIntl } from "react-intl";
import styles from "../../../styles/header/header.module.css";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

export default function MainMenu(props: { state: boolean, dispatch: Dispatch<SetStateAction<boolean>> }) {

    const intl = useIntl();
    const router = useRouter();

    return <Backdrop
        open={props.state}
        onClick={() => { props.dispatch(false) }}
        invisible={true}>
        <Paper
            className={styles.navPaper}
            style={{ display: props.state ? "block" : "none" }}
            onPointerEnter={() => { props.dispatch(true) }}
            onPointerLeave={() => { props.dispatch(false) }}
            sx={{
                ml: 3,
                position: "absolute",
                left: 0,
                top: "74px",
                borderRadius: 3,
            }}>
            <List
                sx={{
                    p: 2,
                }}>
                <ListItem disablePadding
                    sx={{
                        p: 0,
                    }}>
                    <ListItemButton
                        onClick={() => {
                            router.push(`/${intl.locale}/shop/steam`)
                        }}
                        sx={{
                            borderRadius: 1,
                            px: 1,
                            py: 0
                        }
                        }>
                        <ListItemIcon><ShoppingCartOutlinedIcon /></ListItemIcon>
                        <ListItemText primary={intl.formatMessage({ id: "HEADER.MAINMENU.shop" })} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Paper>
    </Backdrop>
}