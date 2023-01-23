import { Backdrop, Badge, Button, Card, IconButton, Menu, MenuItem, Pagination, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import useSWR, { mutate } from "swr"
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { Notifications } from "@prisma/client";
import { FormatDateToRu } from "../../../components/formatters/formatTimeToRu";
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { ShowAlertYesNoMessage } from "../../../components/alerts/alertYesNo";
import { useIntl } from "react-intl";


function NotifComponent(props: Notifications) {

    const date = new Date(Number(props.createdAt.toString()));
    return <Card>
        <Stack
            sx={{
                p: 1
            }}>
            <Typography>{props.title}</Typography>
            <Typography variant="subtitle2">{props.text}</Typography>
            <Typography variant="overline">{FormatDateToRu(date)}</Typography>
        </Stack>
    </Card>
}

export function NotificationsIndicator() {

    const intl = useIntl()

    const [notifsAnchor, setNotifsAnchor] = useState<any>(null)

    const [notifsCount, setNotifsCount] = useState(0)

    const [notifications, setNotifications] = useState<Notifications[]>([])

    const [notifsPage, setNotifsPage] = useState(1);

    let menuDropdownMenuopened = Boolean(notifsAnchor);

    const hideNotifsAlert = ShowAlertYesNoMessage({
        title: intl.formatMessage({ id: "HEADER.NOTIFS.markAllAsRead.title" }),
        content: intl.formatMessage({ id: "HEADER.NOTIFS.markAllAsRead.content" }),
        yesText: intl.formatMessage({ id: "HEADER.NOTIFS.markAllAsRead.yes" }),
        noText: intl.formatMessage({ id: "HEADER.NOTIFS.markAllAsRead.no" }),
        yesAction: function (): void {
            fetch("/api/user/markAllNotifsRead").then(() => {
                notifSWR.mutate();
                hideNotifsAlert.setShown(false);
                setNotifsAnchor(null);
            })
        },
        noAction: function (): void {
            hideNotifsAlert.setShown(false);
        }
    })


    const notifsFetcher = (url: string) => {
        fetch(url).then(res => {
            const result = res.json()
            result.then(result => {
                if (Array.isArray(result) && result.length > 0) {
                    setNotifsCount(result[0].user._count.notifications)
                    setNotifications(result)
                }

                setNotifications(result)
            })
            return result;
        })
    }

    const pagination = <>
        <Pagination
            page={notifsPage}
            onChange={(e, page) => { setNotifsPage(page); notifSWR.mutate(); }}
            count={Math.ceil(notifsCount / 15)}
            color="secondary"
            sx={{
                display: "flex",
                justifyContent: "space-around",
                py: 2,
            }}></Pagination>
    </>;

    const notifSWR = useSWR(`/api/user/getNotifications?page=${notifsPage - 1}`, notifsFetcher, { refreshInterval: 10000, revalidateOnReconnect: true, revalidateIfStale: true })

    return <>
        <Button
            variant="text"
            color="secondary"
            id="openNotifsBtn"
            aria-controls={menuDropdownMenuopened ? 'notifsListMenu' : undefined}
            aria-haspopup="true"
            aria-expanded={menuDropdownMenuopened ? 'true' : undefined}
            sx={{
                borderRadius: 10,
                p: 0,
                position: "relative",
            }}
            onClick={(btn) => {
                setNotifsAnchor(btn.currentTarget)
            }}>
            <Badge
                badgeContent={notifsCount}
                color="info">
                <NotificationsOutlinedIcon />
            </Badge>
        </ Button>




        <Menu
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            id="notifsListMenu"
            aria-labelledby="demo-positioned-button"
            open={menuDropdownMenuopened}
            onClose={() => { setNotifsAnchor(null) }}>
            <Stack
                sx={{
                    px: 2,
                    py: 0.5,
                    minWidth: "350px",
                    width: "60vw",
                    maxWidth: "750px",
                    maxHeight: "500px",
                }}>
                <Stack
                    direction={"row"}
                    justifyContent="end"
                    sx={{
                        py: 0.3
                    }}>
                    <IconButton
                        onClick={() => {
                            hideNotifsAlert.setShown(true);
                        }}><VisibilityOffOutlinedIcon /></IconButton>
                </Stack>
                {
                    notifications.map(notif => {
                        return NotifComponent(notif)
                    })
                }
                {pagination}
            </Stack>
        </Menu>

        {hideNotifsAlert.element}
    </>
}