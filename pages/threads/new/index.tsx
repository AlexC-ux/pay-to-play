import { Stack } from "@mui/material";
import { PrismaClient } from "@prisma/client";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { Header } from "../../../app/header";
import { getSession } from "../../../app/sessions";
import MdEditor from "../../../components/editors/EditorsComponents/mdEditor";




export default function Threads(props: InferGetServerSidePropsType<typeof getServerSideProps>) {

    function sendForm() {

    }

    
    return <>
        <Header user={props.user} />
        <Stack
            spacing={1}>
            <MdEditor rowsCount={8} placeholder={""} onSend={sendForm} />
        </Stack>
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