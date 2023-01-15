import { Box, Button, Grid, Input, List, ListItem, Paper, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import React from "react";
import { GlobalContext } from "../../../components/contextes/globalcontext";
import NeedAuth from "../../../components/contextes/Checkers/NeedAuth";
import MdEditor from "../../../components/editors/mdEditor";

function SteamShop() {

    const globalContext = React.useContext(GlobalContext);
    const intl = useIntl();

    


    return <NeedAuth redirectOnUnauth={true}>
        <>
            <Grid container
                sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    p: 1,
                }}>
                <Grid item xs={12} md={8}>
                    <Paper
                        sx={{
                            borderRadius: 3,
                        }}>
                        <Typography
                            variant="h4"
                            component={"div"}
                            align="center">{intl.formatMessage({ id: "SHOP.ADD.STEAM.title" })}</Typography>

                        <Grid container
                            spacing={2}
                            sx={{
                                p: 2,
                            }}>
                            <Grid item xs={12}>
                                <Typography
                                    variant="body1"
                                    component={"div"}
                                    align="left">{intl.formatMessage({ id: "SHOP.ADD.STEAM.accounttitle" })}</Typography>
                                <Input
                                    fullWidth={true}></Input>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography
                                    variant="body1"
                                    component={"div"}
                                    align="left">{intl.formatMessage({ id: "SHOP.ADD.STEAM.accounttext" })}</Typography>
                                <MdEditor/>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <Typography
                                    variant="body1"
                                    component={"div"}
                                    align="left">{intl.formatMessage({ id: "SHOP.ADD.STEAM.login" })}</Typography>
                                <Input
                                    fullWidth={true}></Input>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <Typography
                                    variant="body1"
                                    component={"div"}
                                    align="left">{intl.formatMessage({ id: "SHOP.ADD.STEAM.password" })}</Typography>
                                <Input
                                    fullWidth={true}></Input>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </>
    </NeedAuth>
}
export default SteamShop;