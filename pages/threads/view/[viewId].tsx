import { Avatar, Button, Grid, Pagination, Paper, Stack, Typography } from "@mui/material";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";
import { useIntl } from "react-intl";
import { Header } from "../../../app/header";
import { getSession } from "../../../app/sessions";
import CommentsElement from "../../../components/comments";
import DisplayMdWrapper from "../../../components/editors/EditorsComponents/displayMdWrapper";
import MdEditor from "../../../components/editors/EditorsComponents/mdEditor";
import useSWR, { preload } from "swr";

export default function PostView(props: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const postInfo = props.post
    const intl = useIntl();
    const [pagination, setPagination] = useState(<></>)
    const [commentsElements, setCommentsElements] = useState(<></>)

    function sendComment(text: string) {
        axios.post(`/api/threads/comments/new/${postInfo.id}`, { commentText: text }).then(mutate);
    }

    function onPageChange(event: React.ChangeEvent<unknown>, page: number) {
        setSelectedPage(page - 1)
        mutate(`/api/threads/comments/getComments/${postInfo.id}?page=${selectedPage}`)
    }

    const [selectedPage, setSelectedPage] = useState(0)

    const fetcher = (url: string) => fetch(url).then((res) => {
        const data = res.json()
        data.then(data => {
            if (!!data && Array.isArray(data)) {
                if (data.length > 0) {
                    setCommentsElements(<>
                        {
                            data?.map((el: any, index: number) => {
                                return CommentsElement(el, mutate, index, props.user.id, postInfo.id, postInfo.userOwner.Id)
                            })
                        }
                    </>)
                    const totalComments = data[0].Thread["_count"].comments;
                    setPagination(<><Pagination
                        page={selectedPage + 1}
                        onChange={onPageChange}
                        count={Math.ceil(totalComments / 15)}
                        color="secondary"
                        sx={{
                            display: "flex",
                            justifyContent: "space-around"
                        }}></Pagination></>)
                }
            }
        })
        return data;
    });
    const { data, error, mutate } = useSWR(`/api/threads/comments/getComments/${postInfo.id}?page=${selectedPage}`, fetcher, {})

    return <>
        <Header user={props.user} />

        <Typography variant="h5" component={"div"}
            sx={{
                m: 2,
                p: 2,
            }}>/ {postInfo.ThreadsCollection.title} /</Typography>
        <Paper
            sx={{
                m: 2,
                p: 2,
                w: "100%",
            }}>

            <Grid container>
                <Grid item xs={12}>
                    <div
                        style={{
                            justifyContent: "flex-end",
                            display: "flex"
                        }}>
                        <Typography variant="h5" component={"div"}
                            sx={{
                                width: "100%",
                                display: "flex",
                                flexWrap: "wrap",
                                alignContent: "center",
                            }}>{postInfo.title}</Typography>

                        <Button
                            variant="text"
                            color="secondary"
                            href={`/userprofile/view/${postInfo.userOwner.id}`}>
                            <Avatar src={`/avatars/${postInfo.userOwner.avatar}`} />
                            <Typography
                                sx={{
                                    display: "flex",
                                    alignContent: "center",
                                    flexWrap: "wrap",
                                    pl: 2,
                                }}>{postInfo.userOwner.login}</Typography>
                        </Button>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body2" component="div"><DisplayMdWrapper>{postInfo.description}</DisplayMdWrapper></Typography>
                </Grid>
            </Grid>
        </Paper>

        <Stack
            alignContent={"center"}
            justifyContent="center"
            spacing={2}
            component={"div"}
            sx={{
                p: 2,
                m:2,
                flexWrap: "wrap"
            }}>
            <>
                {
                    pagination
                }
            </>
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
    </>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { viewId } = context.query;
    const session = await getSession(context.req, context.res);
    const prisma = new PrismaClient();

    let userObj: any = null;
    let post: any = null;


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

                await prisma.thread.findFirst({
                    where: {
                        id: `${viewId}`,
                        ThreadsCollection: {
                            canRead: {
                                in: user.role
                            }
                        }
                    },
                    include: {
                        ThreadsCollection: {
                            select: {
                                id: true,
                                title: true,
                            }
                        },
                        userOwner: {
                            select: {
                                id: true,
                                login: true,
                                avatar: true,
                            }
                        }
                    }
                }).then(postInfo => {
                    if (!!postInfo) {
                        post = { ...postInfo, createdAt: postInfo.createdAt.toString() }
                    } else {
                        context.res.writeHead(301, { Location: '/threads/main' })
                        context.res.end()
                    }
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
            post: post,
        }
    }
}