import type { NextApiRequest, NextApiResponse } from 'next'
import Error from "../../../components/interfaces/error";
import { PrismaClient, Users } from '@prisma/client'
import { getSession } from '../../../app/sessions';
import cuid from 'cuid';


export default async function CheckCredentailsApi(req: NextApiRequest, res: NextApiResponse<any | Error>) {
    const { email, passwordHash, login }: { email: string, passwordHash: string, login: string } = req.body;
    const session = await getSession(req, res)
    session.touch();
    const prisma = new PrismaClient();
    async function main() {
        await prisma.users.create({
            data: {
                token: `${cuid()}${cuid()}:FF${cuid()}`,
                login: login,
                email: email,
                passwordHash: passwordHash,
                statusText: "",
                avatar: "",
                rating: 0,
                rank: 0,
                balance: 0,
                memberSince: Date.now(),
                notifications: {
                    create: [{ title: "Добро пожаловать!", text: "В этом разделе будут собраны уведомления.", createdAt: Date.now() }]
                },
                accounts: {
                    create: {}
                },
                BookmarkStore: {
                    create: {}
                },
                threads: {
                    create: {
                        title: "wall",
                        likes: 0,
                        description: "wall",
                        comments: {},
                        createdAt: Date.now(),
                        ThreadsCollection: undefined,
                        threadsCollectionId: null,
                    }
                }
            },
            include: {
                notifications: true,
            }
        }).then(async user => {
            session.token = user.token;
            session.cookie.expires = new Date(Date.now() + 12 * 60 * 60 * 1000);
            await session.commit();
            res.redirect("/userprofile/me")
        }).catch(err => {
            res.json({
                "error": "AUTH.REGISTER.ERROR.uniqueContraintFailed",
                "message": JSON.stringify(err)
            })
        })
    }
    if (await verifCreds()) {
        await main()
            .then(async () => {
                await prisma.$disconnect()
            })
            .catch(async (e) => {
                console.error(e)
                await prisma.$disconnect()
                process.exit(1)
            })
    }




    async function verifCreds() {

        const mail = email.toLowerCase();

        if (
            mail.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            &&
            login.length > 6
        ) {
            return true
        } else {
            return false
        }
    }
}