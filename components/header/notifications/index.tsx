import { Backdrop, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import styles from "../../../styles/header/header.module.css";
import { INotification } from "../../interfaces/notification";
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import axios from "axios";
import { IUser } from "../../interfaces/user";
import { GlobalContext } from "../../contextes/globalcontext";

export default function NotificationsWindow(params: { state: boolean, dispatch: Dispatch<SetStateAction<boolean>> }) {

    const intl = useIntl();
    const router = useRouter();
    const globalContext = useContext(GlobalContext)!;
    console.log({ globalContext })

    useEffect(() => {
        setNotifications(notif((globalContext.user.value?.notifications)!))
    }, [globalContext.user.value?.notifications])

    function notif(props: INotification[]): React.ReactElement[] {
        const listItems: React.ReactElement[] = [];

        let newNotifsCount = 0;
        if (props.length == 0) {
            console.log({ props })
            return notif([{ id: "-1", title: "уведомлений нет", time: Date.now(), text: "" }])
        }
        else {
            for (let index = 0; index < props.length; index++) {
                const notification = props[index];
                if (!!notification.new) {
                    newNotifsCount += 1;
                }
                const notifDate = new Date(notification.time);
                const notifDateString = (`${notifDate.getFullYear()}.${notifDate.getMonth() < 10 ? `0${notifDate.getMonth() + 1}` : notifDate.getMonth() + 1}.${notifDate.getDate()} ${notifDate.getHours()}:${notifDate.getMinutes()}`);
                listItems[index] = <ListItem key={notification.id}
                >
                    <ListItemButton
                        sx={{
                            borderRadius: 1,
                            px: 1,
                            py: 1
                        }
                        }>
                        <ListItemIcon><NotificationsNoneOutlinedIcon /></ListItemIcon>
                        <Grid container spacing={0}>
                            <Grid
                                item
                                xs={12}>
                                <Typography variant="h6" component={"div"}>{notification.title.substring(0, 40)}{notification.title.length > 40 ? "..." : ""}</Typography>
                            </Grid>
                            <Grid
                                item
                                xs={12}>
                                <Typography variant="body1" component={"div"}>{notification.text.substring(0, 300)}{notification.text.length > 300 ? "..." : ""}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" component={"div"}>{notifDateString}</Typography>
                            </Grid>
                        </Grid>
                    </ListItemButton>
                </ListItem>
            }
        }
        return listItems;
    }

    const [notifications, setNotifications] = useState(notif([{ id: "-1", title: intl.formatMessage({ id: "HEADER.NOTIFICATIONS.preload" }), time: Date.now(), text: "" }]))

    return <Backdrop
        open={params.state}
        onClick={() => { params.dispatch(false) }}
        invisible={true}>
        <Paper
            className={styles.navPaperNotifs}
            style={{ display: params.state ? "block" : "none" }}
            onPointerEnter={() => { params.dispatch(true) }}
            onPointerLeave={() => { params.dispatch(false) }}
            sx={{
                mr: 6,
                position: "absolute",
                right: 0,
                top: "74px",
                borderRadius: 3,
            }}>
            <List
                sx={{
                    p: 2,
                }}>
                {notifications}
            </List>

        </Paper>
    </Backdrop>
}