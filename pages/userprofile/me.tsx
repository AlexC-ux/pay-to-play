import { Avatar, Box, Container, Grid, Stack } from "@mui/material";
import { useRouter } from "next/router"
import { useContext } from "react";
import { useIntl } from "react-intl";
import NeedAuth from "../../components/contextes/Checkers/NeedAuth";
import { GlobalContext } from "../../components/contextes/globalcontext";

export default function MyProfilePage() {

    const router = useRouter();
    const intl = useIntl();
    const globalContext = useContext(GlobalContext)

    return <>
        <NeedAuth
            redirectOnUnauth={true}>
            <Grid container
                spacing={2}
                sx={{
                    p: 2
                }}>
                <Grid item xs={12} md={4}>
                    <Stack
                    alignContent={"center"}>
                    <Box component={Container}>
                        <Avatar>0</Avatar>
                    </Box>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={8}>
                    2
                </Grid>
            </Grid>
        </NeedAuth>
    </>
}