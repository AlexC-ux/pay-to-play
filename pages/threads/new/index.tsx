import { Grid, Input, MenuItem, Select, SelectChangeEvent, Stack, Typography } from "@mui/material";
import { PrismaClient, ThreadsCollection } from "@prisma/client";
import axios from "axios";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import React from "react";
import { useState } from "react";
import { useIntl } from "react-intl";
import { Header } from "../../../app/header";
import { getSession } from "../../../app/sessions";
import MdEditor from "../../../components/editors/EditorsComponents/mdEditor";




export default function Threads(props: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const intl = useIntl();

    const titleRef = React.createRef<HTMLInputElement>();

    const threadsCollections: ThreadsCollection[] = props.threadsCollections;

    const [selectedThread, setSelectedThread] = useState("")

    function sendForm(content: string) {
        const collectionId = selectedThread;
        const title = titleRef.current!.value;

        axios.post("/api/threads/posts/create", {
            title,
            collectionId,
            content: content
        }).then(response=>{
            const viewId = response.data.createdPostId;
            document.location.replace(`/threads/view/${viewId}`);
        })
    }

    return <>
        <Header user={props.user} />
        <Grid container
            spacing={2}
            sx={{
                p: 2
            }}>
            <Grid item xs={12}>
                <Stack
                    spacing={1}>
                    <Typography variant="h5" component="div">{intl.formatMessage({ id: "THREADS.NEW.setTitle" })}</Typography>
                    <Input inputRef={titleRef} placeholder={intl.formatMessage({ id: "THREADS.NEW.setTitle.placeholder" })}></Input>
                    <Typography variant="h5" component="div">{intl.formatMessage({ id: "THREADS.NEW.setThreadCollection" })}</Typography>
                    <Select
                        value={selectedThread}
                        onChange={(e: SelectChangeEvent) => { setSelectedThread(e.target.value) }}>
                        {threadsCollections.map((collection, index, array) => {
                            return <MenuItem key={`list_item_${collection.id}`} value={collection.id}>{collection.title}</MenuItem>
                        })}
                    </Select>
                    <Typography variant="h5" component="div">{intl.formatMessage({ id: "THREADS.NEW.setContent" })}</Typography>
                    <MdEditor rowsCount={8} placeholder={"Содержимое вашей темы"} onSend={sendForm} />
                </Stack>
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
                        canWrite: {
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