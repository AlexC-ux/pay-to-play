import { Button, ButtonGroup, Grid, Pagination, Paper, Stack, Typography } from "@mui/material";
import { PrismaClient } from "@prisma/client";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Header } from "../../../app/header";
import { getSession } from "../../../app/sessions";


export default function ThreadPosts(props: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const intl = useIntl();
    const router = useRouter();

    return <>
        <Header user={props.user} />
        <Grid container
            spacing={2}
            sx={{
                p: 2
            }}>
            <Grid item xs={12} md={4}>
                <Stack
                    alignContent={"center"}
                    justifyContent="center"
                    spacing={5}>
                    <Paper
                        sx={{
                            p: 2
                        }}>
                        <Stack
                            spacing={2}>
                            <Typography
                                align="center"
                                variant="subtitle1"
                                component="div">
                                {intl.formatMessage({ id: "THREADS.LIST.title" })}
                            </Typography>
                            <ButtonGroup
                                orientation="vertical">
                                {
                                    props.threadsCollections?.map((collection: any) => {
                                        return <Button
                                            color="secondary"
                                            variant="outlined"
                                            onClick={() => { router.push(`/${intl.locale}/threads/posts/${collection.id}`) }}>{collection.title}</Button>
                                    })
                                }
                            </ButtonGroup>
                        </Stack>
                    </Paper>
                </Stack>
            </Grid>
            <Grid item xs={12} md={8}>

            </Grid>
        </Grid>
    </>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context.req, context.res);
    const prisma = new PrismaClient();

    let userObj: any = null;


    async function main() {
        await prisma.users.findUnique({
            where: {
                token: session.token
            },
            include: {
                threads: {
                    where: {
                        title: "wall"
                    },
                    select: {
                        id: true,
                    }
                },
            }
        }).then(async user => {
            if (user == null) {
                session.destroy();
                context.res.writeHead(301, { Location: '/auth' })
                context.res.end()
            } else {
                userObj = {
                    ...user,
                    memberSince: user.memberSince.toString()
                };
            }
        });
    }



    if (!!session.token) {
        await main().then(async () => {
            await prisma.$disconnect()
        })
            .catch(async (e) => {
                console.error(e)
                await prisma.$disconnect()
                process.exit(1)
            })
    } else {
        context.res.writeHead(301, { Location: '/auth' })
        context.res.end()
    }

    return {
        props: {
            user: userObj
        }
    }
}