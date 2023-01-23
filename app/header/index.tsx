import { PrismaClient, Users } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession } from "../sessions";
import { AppBar, Avatar, Button, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { MenuOutlined } from "@mui/icons-material"
import { useIntl } from "react-intl";
import { NotificationsIndicator } from "./notifications/NotificationsIndicator";
import { useRouter } from "next/router";
import BurgerNav from "./burgernav";

type ComponentsProps = { user: Users | null }

export function Header(props: ComponentsProps) {

    const intl = useIntl();
    const router = useRouter();

    return <>
        <AppBar
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
                                        variant="outlined"
                                        color="secondary"
                                        href={`/${intl.locale}/userprofile/me`}>
                                        <Avatar src={props.user.avatar} />
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
                                    <Button>
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