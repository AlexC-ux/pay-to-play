import { Button, ButtonGroup, Grid, Pagination, Paper, Stack, Typography } from "@mui/material";
import { PrismaClient, Thread } from "@prisma/client";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Header } from "../../app/header";
import { getSession } from "../../app/sessions";
import useSWR, { preload } from "swr";
import ThreadComponent from "../../components/threads";



export default function Threads(props: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const intl = useIntl();
    const router = useRouter();

    const [selectedPage, setSelectedPage] = useState(1)

    const [pagination, setPagination] = useState(<div key="pag_01292"></div>);

    const [threads, setThreads] = useState<any[]>([]);

    const [collectionId, setCollectionId] = useState("latest")


    const fetcher: any = (url: string) => fetch(url).then(async (res) => {
        const data: any = await res.json()
        if (!!data && Array.isArray(data)) {
            if (data.length > 0) {
                setThreads(data.map((thread: Thread & {
                    _count: {
                        comments: number;
                    };
                    userOwner: {
                        avatar: string;
                        login: string;
                    } | null;
                }) => <div key={thread.id + "_wrp"}>{ThreadComponent(thread)}</div>
                ))
            } else {
            }
        }
        return data;
    });

    const { data, error, mutate } = useSWR(`/api/threads/posts/${collectionId}?page=${selectedPage - 1}`, fetcher);

    function onPageChange(event: React.ChangeEvent<unknown>, page: number) {
        setSelectedPage(page);
        mutate();
    }

    return <>
        <Header user={props.user} />
        <Grid container
            key="grid.main"
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
                                            key={collection.id}
                                            color="secondary"
                                            variant="outlined"
                                            onClick={() => { setCollectionId(`${collection.id}`); }}>{collection.title}</Button>
                                    })
                                }
                            </ButtonGroup>
                        </Stack>
                    </Paper>
                </Stack>
            </Grid>
            <Grid item xs={12} md={8}>
                {threads}
                {pagination}
            </Grid>
        </Grid>
    </>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context.req, context.res);
    const prisma = new PrismaClient();

    let userObj: any = null;
    let availableThreadsCollections: any = null;


    async function main() {
        await prisma.users.findUnique({
            where: {
                token: session.token
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

                await prisma.threadsCollection.findMany({
                    where: {
                        canRead: {
                            in: user.role
                        },
                    },
                    include: {
                        _count: {
                            select: {
                                threads: true
                            }
                        }
                    }
                }).then(threadsCollections => {
                    availableThreadsCollections = threadsCollections;
                })
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
            user: userObj,
            threadsCollections: availableThreadsCollections
        }
    }
}