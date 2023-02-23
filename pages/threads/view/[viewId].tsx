import { Avatar, Button, Grid, Paper, Typography } from "@mui/material";
import { PrismaClient } from "@prisma/client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Header } from "../../../app/header";
import { getSession } from "../../../app/sessions";
import DisplayMdWrapper from "../../../components/editors/EditorsComponents/displayMdWrapper";

export default function PostView(props: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const postInfo = props.post

    return <>
        <Header user={props.user} />

        <Typography variant="h5" component={"div"}
        sx={{
            m:2,
            p:2,
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
                            color="secondary">
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
                        },
                        comments: false,

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