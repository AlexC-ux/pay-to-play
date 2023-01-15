import { sha512, sha256 } from 'crypto-hash';
import { PrismaClient, SteamGame } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next';
import Error from "../../../../components/interfaces/error";
import { IUser } from '../../../../components/interfaces/user';
import axios from 'axios';
import { SteamAccount } from '../../../../components/scrappers/SteamScrapper';


export default function handler(req: NextApiRequest, res: NextApiResponse<IUser | Error>) {
    let { title, emailLogin, emailPassword, login, password, token } = req.body;

    const prisma = new PrismaClient();

    async function main(props: { games: SteamGame[] }) {

        await prisma.users.update({
            include: {
                accounts: true,
            },
            where: {
                token: token,
            },
            data: {
                accounts: {
                    update: {
                        SteamAccounts: {
                            create: {
                                login: login,
                                password: password,
                                emailLogin: emailLogin,
                                emailPassword: emailPassword,
                                lastActivity: new Date(),
                                link: "",
                                games: {
                                    createMany: {
                                        data: props.games
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
    }

    verifCreds().then((params: { isValid: boolean, games?: SteamGame[] }) => {
        if (params.isValid) {
            if (!params.games) {
                params.games = []
            }
            main({ games: params.games })
                .then(async () => {
                    await prisma.$disconnect()
                })
                .catch(async (e) => {
                    console.error(e)
                    await prisma.$disconnect()
                    process.exit(1)
                })
        } else {
            res.json({ "error": "AUTH.ERROR.wrongToken" })
        }
    })




    async function verifCreds() {

       const steamAccount: SteamAccount = new SteamAccount({ login: login, password: password, email: emailLogin, emailPassword: emailPassword });

        if (
            true
        ) {
            return { isValid: true }
        } else {
            return { isValid: false }
        }

    }

}