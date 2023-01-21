import { Avatar, Box, Container, Grid, Paper, Stack, Button, Divider, Typography, IconButton, FormGroup, Input, TextField, Skeleton, Pagination } from "@mui/material";
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import React from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { ThreadComment, PrismaClient, Thread, Users, Notifications } from "@prisma/client";
import MdEditor from "../../components/editors/mdEditor";
import useSWR, { preload } from "swr";
import { getSession } from "../../app/sessions";
import { Header } from "../../app/header";
import CommentsElement, { ICommentComponentParams } from "../../components/comments";
import { FavoriteBorderOutlined } from "@mui/icons-material";
import axios from "axios";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
let currentPage = 0;

export default function MyProfilePage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();
    const intl = useIntl();


    const { data, error, mutate } = useSWR(`/api/threads/comments/getComments/${props.user.threads[0].id}?page=${currentPage}`, fetcher)

    const [commentsElements, setCommentsElements] = useState(<></>)
    const [pagination, setPagination] = useState(<></>)

    async function updateComments() {
        setTimeout(()=>{
            mutate(`/api/threads/comments/getComments/${props.user.threads[0].id}?page=${currentPage}`)
        },100)
    }

    function onPageChange(event: React.ChangeEvent<unknown>, page: number) {
        currentPage = page - 1;
        mutate(`/api/threads/comments/getComments/${props.user.threads[0].id}?page=${currentPage}`)
    }

    useEffect(() => {
        console.log({ data })
        if (!!data && Array.isArray(data)) {
            if (data.length > 0) {
                setCommentsElements(<>
                    {
                        data?.map((el: any, index: number) => {
                            return CommentsElement(el, updateComments, index)
                        })
                    }
                </>)
                const totalComments = data[0].Thread["_count"].comments;
                setPagination(<><Pagination
                    onChange={onPageChange}
                    count={Math.ceil(totalComments / 15)}
                    color="secondary"
                    sx={{
                        display: "flex",
                        justifyContent: "space-around"
                    }}></Pagination></>)
            } else {
                setCommentsElements(<>
                    {
                        data?.map((el: any, index: number) => {
                            return CommentsElement(el, updateComments, index)
                        })
                    }
                </>)
                setPagination(<></>)
            }
        }
    }, [data])

    function sendComment(text: string) {
        axios.post(`/api/threads/comments/new/${props.user.threads[0].id}`, { commentText: text });
        mutate(`/api/threads/comments/getComments/${props.user.threads[0].id}?page=${currentPage}`)
    }

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
                            alignContent={"center"}
                            justifyContent="center"
                            spacing={2}>
                            <Box sx={{
                                display: "flex",
                                justifyContent: "center",
                            }}>
                                <Avatar
                                    src={`${props.user?.avatar}`}
                                    sx={{
                                        width: "min(240px, 80vw)",
                                        height: "min(240px, 80vw)"
                                    }}></Avatar>

                            </Box>

                            <Button
                                fullWidth={true}
                                variant="contained"
                                startIcon={<DriveFolderUploadIcon />}>
                                {intl.formatMessage({ id: "PROFILE.uploadAvatar" })}
                            </Button>
                        </Stack>
                    </Paper>

                    <Stack
                        alignContent={"center"}
                        justifyContent="center"
                        spacing={2}
                        component={Paper}
                        sx={{
                            p: 2
                        }}>
                        <Stack
                            direction={"row"}
                            spacing={"space-around"}>
                            <FavoriteBorderOutlined />
                            <Typography variant="h5" component="div">{props.user.likesSummary}</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Grid>
            <Grid item xs={12} md={8}>
                <Stack>
                    <Stack
                        alignContent={"center"}
                        justifyContent="center"
                        spacing={2}
                        component={Paper}
                        sx={{
                            p: 2,
                            flexWrap: "wrap"
                        }}>
                        <Typography
                            variant="h5"
                            component={"div"}
                            sx={{
                                width: "100%",
                            }}>{intl.formatMessage({ id: "PROFILE.wallTitle" })}</Typography>
                        <>
                            {
                                commentsElements
                            }
                        </>
                        <>
                            {
                                pagination
                            }
                        </>
                        <MdEditor
                            onSend={sendComment}
                            placeholder="Оставить комментарий..."
                            rowsCount={2}></MdEditor>
                    </Stack>
                </Stack>
            </Grid>
        </Grid>
    </>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context.req, context.res);
    const prisma = new PrismaClient();

    let userObj: any = null;


    async function getUser() {
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
                }
            }
        }).then(user => {
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
        await getUser().then(async () => {
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