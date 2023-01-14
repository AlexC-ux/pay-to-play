import { Box, Button, Grid, List, ListItem, Paper } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import { display } from "@mui/system";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useIntl } from "react-intl";
import { ISteamAccountCard } from "../../../components/interfaces/shop/steam";
import NeedAuth from "../../../contextes/Checkers/NeedAuth";
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import CurrencyRubleOutlinedIcon from '@mui/icons-material/CurrencyRubleOutlined';
import Image from "next/image";
import { GlobalContext } from "../../../contextes/globalcontext";
import React from "react";


interface pageProps {
    items: ISteamAccountCard[]
}

function SteamShop(props: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const globalContext = React.useContext(GlobalContext);
    const intl = useIntl();

    function getCardsListItems() {
        const resultCards = []
        for (let index = 0; index < props.items.length; index++) {
            const card = props.items[index];
            resultCards[index] = <ListItem
                key={card.id}
                sx={{
                    borderRadius: 0,
                }}>
                <Grid container direction="row"
                    sx={{
                        border: "1px solid grey",
                        p: 2,
                        borderRadius: 3,
                    }}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={9}>
                                    <Typography variant="h6" component={"div"}>{card.title}</Typography>
                                </Grid>
                                <Grid item xs={3}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "end",
                                    }}>
                                    <Typography
                                        variant="h6"
                                        component={"div"}
                                        color="secondary">{card.cost}
                                        <CurrencyRubleOutlinedIcon
                                            sx={{
                                                fontSize: "1rem"
                                            }} />
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" component={"div"}>123</Typography>
                        </Grid>
                        <Grid item xs={12}
                            sx={{
                                py: 1,
                            }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    p: 0.5,
                                    mx: 0.3,
                                    borderRadius: 1,
                                    width: "fit-content",
                                    display: card.games.length > 0 ? "inline-box" : "none",
                                    background: globalContext?.theme[0].palette.getContrastText("")
                                }}>
                                {card.games.length > 0 ? card.games[0].name : "Игры отсутствуют"}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    p: 0.5,
                                    mx: 0.3,
                                    borderRadius: 1,
                                    width: "fit-content",
                                    display: card.games.length > 1 ? "inline-box" : "none",
                                    background: globalContext?.theme[0].palette.getContrastText("")
                                }}>
                                {card.games.length > 1 ? card.games[1].name : ""}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    p: 0.5,
                                    mx: 0.3,
                                    borderRadius: 1,
                                    width: "fit-content",
                                    display: card.games.length > 2 ? "inline-box" : "none",
                                    background: globalContext?.theme[0].palette.getContrastText("")
                                }}>
                                {card.games.length > 2 ? card.games[2].name : ""}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    p: 0.5,
                                    mx: 0.3,
                                    borderRadius: 1,
                                    width: "fit-content",
                                    display: card.games.length > 3 ? "inline-box" : "none",
                                    background: globalContext?.theme[0].palette.getContrastText("")
                                }}>
                                {card.games.length > 3 ? `${card.games.length - 3} ${intl.formatMessage({ id: "SHOP.more" })}` : ""}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={3}>
                                    <Grid container>
                                        <Grid item xs={5} md={3}
                                            sx={{
                                                minWidth: "30px",
                                                maxWidth: "40px!important",
                                            }}>
                                            <Image src="/icons/games/steam_icon_logo.png" width={30} height={30} alt="steam_logo"></Image>
                                        </Grid>
                                        <Grid item xs={7} md={9}
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                            }}>
                                            <Typography
                                                variant="body2"
                                                component={"div"}
                                                onClick={() => { }}>{card.sellerName}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>

                                </Grid>
                                <Grid item xs={3}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "end"
                                    }}>
                                    <Button
                                        onClick={() => { alert(1) }}
                                        variant="contained"
                                        color="primary">{intl.formatMessage({ id: "SHOP.buy" })}</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </ListItem >
        }

        return resultCards
    }


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
                        <List>
                            {getCardsListItems()}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </>
    </NeedAuth>
}
export const getServerSideProps: GetServerSideProps<pageProps> = async () => {
    //const res = await fetch('/')
    //const data: pageProps = await res.json()

    //const resultToSend: pageProps = {};
    return {
        props: {
            items:
                [{
                    lastOnline:Date.now(),
                    sellerName: "Seller nickName",
                    title: "TestTitle for design",
                    cost: 230,
                    boosted: false,
                    time: Date.now(),
                    id: "id",
                    games: [{
                        name: "game1",
                        link: "link1",
                        id: "id1"
                    },
                    {
                        name: "game2",
                        link: "link2",
                        id: "id2"
                    },
                    {
                        name: "game3",
                        link: "link3",
                        id: "id3"
                    },
                    {
                        name: "game4",
                        link: "link4",
                        id: "id4"
                    },
                    {
                        name: "game5",
                        link: "link5",
                        id: "id5"
                    }]
                }]

        }
    }
}

export default SteamShop;