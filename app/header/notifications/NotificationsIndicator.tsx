import { Backdrop, Badge, Box, Button, Card, IconButton, Menu, MenuItem, Pagination, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import useSWR, { mutate } from "swr"
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { Notifications } from "@prisma/client";
import { FormatDateToRu } from "../../../components/formatters/formatTimeToRu";
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { ShowAlertYesNoMessage } from "../../../components/alerts/alertYesNo";
import { useIntl } from "react-intl";
import FiberNewOutlinedIcon from '@mui/icons-material/FiberNewOutlined';
import CloseIcon from '@mui/icons-material/Close';

function NotifComponent(props: Notifications) {

    const date = new Date(Number(props.createdAt.toString()));
    return <Card
        key={props.id}
        sx={{
            borderRadius: 3,
            display: "block",
            my: 1,
            mx: 0.5,
        }}>
        <Stack
            sx={{
                p: 1
            }}>
            <Badge
                color="secondary"
                invisible={!props.new}
                badgeContent={<FiberNewOutlinedIcon sx={{ pl: 10 }} />}
                anchorOrigin={
                    { vertical: 'top', horizontal: 'left', }
                }>
                <Typography
                    sx={{
                        pt: props.new ? 1 : 0
                    }}>{props.title}</Typography>
            </Badge>
            <Typography variant="subtitle2">{props.text}</Typography>
            <Typography variant="overline">{FormatDateToRu(date)}</Typography>
        </Stack>
    </Card>
}

export function NotificationsIndicator() {

    const intl = useIntl()

    const [notifsAnchor, setNotifsAnchor] = useState<any>(null)

    const [notifsCount, setNotifsCount] = useState(0)

    const [newNotifsCount, setNewNotifsCount] = useState(0);

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
                    setNewNotifsCount(result.reduce((total, x) => (x.new != false ? total + 1 : total), 0))
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
        <Menu
            disableScrollLock={true}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            id="notifsListMenu"
            aria-labelledby="openNotifsBtn"
            open={menuDropdownMenuopened}
            onClose={() => { setNotifsAnchor(null) }}
            sx={{
                position: "absolute",
                div:{
                    right:"2px"
                }
            }}>
            <Stack
                sx={{
                    px: 2,
                    py: 0.5,
                    minWidth: "250px",
                    width: "50vw",
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
                        onClick={() => {
                            hideNotifsAlert.setShown(true);
                        }}><VisibilityOffOutlinedIcon /></IconButton>
                    <IconButton
                        onClick={() => { setNotifsAnchor(null) }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <div
                    style={{
                        overflowY: "scroll",
                    }}>
                    {
                        !!notifications && Array.isArray(notifications) ? notifications.map(notif => {
                            return NotifComponent(notif)
                        }) : <></>
                    }
                </div>
                {pagination}
            </Stack>
        </Menu>
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
                badgeContent={newNotifsCount}
                color="info">
                <NotificationsOutlinedIcon />
            </Badge>
        </ Button>

        {hideNotifsAlert.element}
    </>
}