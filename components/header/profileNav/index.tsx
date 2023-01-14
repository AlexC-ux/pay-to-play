import { Backdrop, Paper, List, ListItem, ListItemButton, ListItemText, Divider, ListItemIcon } from "@mui/material"
import { useRouter } from "next/router";
import React from "react";
import { Dispatch, SetStateAction } from "react"
import { useIntl } from "react-intl";
import { GlobalContext } from "../../../contextes/globalcontext";
import styles from "../../../styles/header/header.module.css";
import OutlinedEyeIcon from '@mui/icons-material/VisibilityOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CurrencyRubleOutlinedIcon from '@mui/icons-material/CurrencyRubleOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import DoorBackOutlinedIcon from '@mui/icons-material/DoorBackOutlined';

export default function ProfileNavigation(props: { state: boolean, dispatch: Dispatch<SetStateAction<boolean>> }) {

    const intl = useIntl();
    const router = useRouter();
    const globalContext = React.useContext(GlobalContext)!;

    return (
        <Backdrop
            open={props.state}
            onClick={() => { props.dispatch(false) }}
            invisible={true}>
            <Paper
                className={styles.navPaper}
                style={{ display: props.state ? "block" : "none" }}
                onPointerEnter={() => { props.dispatch(true) }}
                onPointerLeave={() => { props.dispatch(false) }}
                sx={{
                    mr: 3,
                    position: "absolute",
                    right: 0,
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
                            sx={{
                                borderRadius: 1,
                                px: 1,
                                py: 0,
                                backgroundColor: "primary.main",
                            }
                            }>
                            <ListItemText primary={intl.formatMessage({ id: "HEADER.PROFILENAV.editprofile" })} />
                        </ListItemButton>
                    </ListItem>
                    <Divider orientation="horizontal" sx={{
                        my: 1,
                    }} />
                    <ListItem disablePadding
                        sx={{
                            p: 0,
                            display: "flex",
                            a: {
                                display: "flex",
                                px: 1,
                            }
                        }}>
                        <ListItemButton
                            href="/wd"
                            sx={{
                                borderRadius: 1,
                                display: "contents",
                                px: 1,
                                py: 0
                            }}>
                            <ListItemText primary={`${globalContext.user.value?.balance}`}
                                sx={{
                                    flex: "none",
                                    span: {
                                        display: "inline-block",
                                        width: "fit-content",
                                        p: 0,
                                        m: 0,
                                    }
                                }} />
                            <ListItemIcon
                                sx={{
                                    display: "inline-block",
                                    flex: 2,
                                }}>
                                <CurrencyRubleOutlinedIcon
                                    sx={{
                                        fontSize: "1.1rem",
                                        display: "flex",
                                        path: {
                                            color: "text.primary"
                                        }
                                    }} />
                            </ListItemIcon>
                            <ListItemIcon
                                sx={{
                                    display: "flex",
                                    flexDirection: "row-reverse",
                                    alignContent: "center"
                                }}>
                                <OutlinedEyeIcon />
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding
                        sx={{
                            p: 0,
                        }}>
                        <ListItemButton
                            sx={{
                                borderRadius: 1,
                                px: 1,
                                py: 0
                            }
                            }>
                            <ListItemIcon><StorefrontOutlinedIcon /></ListItemIcon>
                            <ListItemText primary={intl.formatMessage({ id: "HEADER.PROFILENAV.showsells" })} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding
                        sx={{
                            p: 0,
                        }}>
                        <ListItemButton
                            sx={{
                                borderRadius: 1,
                                px: 1,
                                py: 0
                            }
                            }>
                            <ListItemIcon><ShoppingCartOutlinedIcon /></ListItemIcon>
                            <ListItemText primary={intl.formatMessage({ id: "HEADER.PROFILENAV.showbuys" })} />
                        </ListItemButton>
                    </ListItem>
                    <Divider orientation="horizontal" sx={{
                        my: 1,
                    }} />
                    <ListItem disablePadding
                        sx={{
                            p: 0,
                        }}>
                        <ListItemButton
                        onClick={()=>{router.push("/auth/exit")}}
                            sx={{
                                borderRadius: 1,
                                px: 1,
                                py: 0
                            }
                            }>
                            <ListItemIcon><DoorBackOutlinedIcon /></ListItemIcon>
                            <ListItemText primary={intl.formatMessage({ id: "HEADER.PROFILENAV.exit" })} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Paper>
        </Backdrop>
    )
}