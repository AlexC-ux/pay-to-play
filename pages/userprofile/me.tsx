import { Avatar, Box, Container, Grid, Paper, Stack, Button, Divider, Typography, IconButton, FormGroup, Input, TextField, Skeleton, Pagination } from "@mui/material";
import { useRouter } from "next/router"
import { createRef, useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import React from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { ThreadComment, PrismaClient, Thread, Users, Notifications } from "@prisma/client";
import useSWR, { preload } from "swr";
import { getSession } from "../../app/sessions";
import { Header } from "../../app/header";
import CommentsElement, { ICommentComponentParams } from "../../components/comments";
import { FavoriteBorderOutlined } from "@mui/icons-material";
import axios from "axios";
import ShowAlertMessage from "../../components/alerts/alertMessage";
import SubjectOutlinedIcon from '@mui/icons-material/SubjectOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import { FormatDateToRu } from "../../components/formatters/formatTimeToRu";
import MdEditor from "../../components/editors/EditorsComponents/mdEditor";



export default function MyProfilePage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();
    const intl = useIntl();


    const [selectedPage, setSelectedPage] = useState(0)
    const [commentsElements, setCommentsElements] = useState(<></>)
    const [pagination, setPagination] = useState(<></>)

    const [avatarUri, setAvatarUri] = useState(props.user?.avatar)

    const avatarUploadRef = createRef<HTMLInputElement>();

    function onPageChange(event: React.ChangeEvent<unknown>, page: number) {
        setSelectedPage(page - 1)
        mutate(`/api/threads/comments/getComments/${props.user.threads[0].id}?page=${selectedPage}`)
    }

    function sendComment(text: string) {
        axios.post(`/api/threads/comments/new/${props.user.threads[0].id}`, { commentText: text }).then(mutate);
    }


    const [avatarErrText, setAvatarErrText] = useState("");
    function uploadAvatar() {
        let formData = new FormData();
        if (avatarUploadRef.current!.files) {
            formData.append("avatar", avatarUploadRef.current!.files[0]);
            axios({
                method: "post",
                url: "/api/user/updateProfile/setAvatar",
                data: formData,
            }).then(resp => {
                if (!!resp.data.error) {
                    setAvatarErrText(intl.formatMessage({ id: resp.data.error }))
                    uploadAvatarErrorAlert.setShown(true);
                } else {
                    setAvatarUri(resp.data.avatar)
                }
            })
        }

    }

    const uploadAvatarErrorAlert = ShowAlertMessage({
        title: intl.formatMessage({ id: "AVATAR.errortitle" }),
        content: avatarErrText
    });

    const fetcher = (url: string) => fetch(url).then((res) => {
        const data = res.json()
        data.then(data => {
            if (!!data && Array.isArray(data)) {
                if (data.length > 0) {
                    setCommentsElements(<>
                        {
                            data?.map((el: any, index: number) => {
                                return CommentsElement(el, mutate, index, props.user.id, props.user.threads[0].id, props.user.threads[0].usersId)
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
    const { data, error, mutate } = useSWR(`/api/threads/comments/getComments/${props.user.threads[0].id}?page=${selectedPage}`, fetcher, {})



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
                        elevation={0}
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
                                    src={`/avatars/${avatarUri}`}
                                    sx={{
                                        width: "min(240px, 80vw)",
                                        height: "min(240px, 80vw)"
                                    }}></Avatar>

                            </Box>

                            <Button
                                fullWidth={true}
                                variant="contained"
                                disableElevation={true}
                                startIcon={<DriveFolderUploadIcon />}
                                onClick={() => { avatarUploadRef.current?.click(); }}>
                                <Input
                                    inputRef={avatarUploadRef}
                                    type="file"
                                    onChange={uploadAvatar}
                                    sx={{
                                        display: "none",
                                    }}></Input>
                                {intl.formatMessage({ id: "PROFILE.uploadAvatar" })}
                            </Button>
                        </Stack>
                    </Paper>

                    <Stack
                        alignContent={"center"}
                        justifyContent="center"
                        spacing={2}
                        component={"div"}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                            }}>
                            <Grid container>
                                <Grid item xs={12} md={4}
                                    sx={{
                                        justifyContent: "center",
                                        display: "flex",
                                    }}>

                                    <Stack
                                        direction={"row"}
                                        spacing={"space-around"}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignContent: "center",
                                                flexWrap: "wrap",
                                            }}>

                                            <FavoriteBorderOutlined />
                                        </Box>
                                        <Typography variant="h5" component="div"
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                            }}>{props.user.likesSummary}</Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={4}
                                    sx={{
                                        justifyContent: "center",
                                        display: "flex",
                                    }}>
                                    <Stack
                                        direction={"row"}
                                        spacing={"space-around"}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignContent: "center",
                                                flexWrap: "wrap",
                                            }}>

                                            <SubjectOutlinedIcon />
                                        </Box>
                                        <Typography variant="h5" component="div"
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                            }}>{props.user._count.threads}</Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={4}
                                    sx={{
                                        justifyContent: "center",
                                        display: "flex",
                                    }}>
                                    <Stack
                                        direction={"row"}
                                        spacing={"space-around"}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignContent: "center",
                                                flexWrap: "wrap",
                                            }}>

                                            <ChatOutlinedIcon />
                                        </Box>
                                        <Typography variant="h5" component="div"
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                            }}>{props.user._count.ThreadComment}</Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                            <Stack
                                direction={"row"}
                                sx={{
                                    justifyContent: "center",
                                    alignContent: "center",
                                    flexWrap: "wrap",
                                }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignContent: "center",
                                        flexWrap: "wrap",
                                    }}>
                                    <TodayOutlinedIcon />
                                </Box>
                                <Typography variant="h5" component="div"
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignContent: "center",
                                        flexWrap: "wrap",
                                    }}>{FormatDateToRu(new Date(Number(props.user.memberSince.toString())))}</Typography>
                            </Stack>
                        </Paper>
                    </Stack>
                </Stack>
            </Grid>
            <Grid item xs={12} md={8}
                sx={{
                    maxWidth: "100%",
                }}>

                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        flexWrap: "wrap",
                    }}>
                    <Stack
                        alignContent={"center"}
                        justifyContent="center"
                        spacing={2}
                        component={"div"}
                    >
                        <Typography
                            variant="h5"
                            component={"div"}
                            sx={{
                                width: "100%",
                            }}>{intl.formatMessage({ id: "PROFILE.wallTitle" })}</Typography>
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
                </Paper>
            </Grid>
        </Grid>
        {uploadAvatarErrorAlert.element}
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
                        usersId: true,
                    },
                    orderBy: {
                        createdAt: "asc"
                    },
                    take: 1,
                },
                _count: {
                    select: {
                        threads: true,
                        ThreadComment: true
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