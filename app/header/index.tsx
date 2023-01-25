import { AppBar, Avatar, Button, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { NotificationsIndicator } from "./notifications/NotificationsIndicator";
import { useRouter } from "next/router";
import BurgerNav from "./burgernav";
import { Users } from "@prisma/client";

type ComponentsProps = { user: Users | null }

export function Header(props: ComponentsProps) {

    const intl = useIntl();
    const router = useRouter();

    return <>
        <AppBar
            key={props.user?.id || "header_main"}
            sx={{
                position: "relative"
            }}>
            <Toolbar
                sx={{
                    justifyContent: "space-between",
                }}>
                <BurgerNav authorized={props.user != null} />
                <Stack
                    direction={"row"}
                    spacing={2}>
                    {
                        (() => {
                            if (!!props.user) {
                                return <>
                                    <NotificationsIndicator />
                                    <Button
                                        variant="text"
                                        color="secondary"
                                        href={`/${intl.locale}/userprofile/me`}>
                                        <Avatar src={`/avatars/${props.user.avatar}`} />
                                        <Typography
                                            sx={{
                                                display: "flex",
                                                alignContent: "center",
                                                flexWrap: "wrap",
                                                pl: 2,
                                            }}>{props.user.login}</Typography>
                                    </Button>
                                </>
                            }
                            else {
                                return <>
                                    <Button
                                        color="secondary"
                                        variant="outlined"
                                        onClick={() => { location.assign(`/${intl.locale}/auth`) }}>
                                        {intl.formatMessage({ id: "HEADER.authbtn" })}
                                    </Button>
                                </>
                            }
                        })()
                    }
                </Stack>
            </Toolbar>
        </AppBar>
    </>
}