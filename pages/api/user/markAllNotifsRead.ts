import { Notifications, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "../../../app/sessions";
import Error from "../../../components/interfaces/error";


export default async function handler(req: NextApiRequest, res: NextApiResponse<Error | { notifications: any[] }>) {
    const session = await getSession(req, res);
    const prisma = new PrismaClient();
    async function main() {
        await prisma.users.update({
            where: {
                token: session.token
            },
            include: {
                notifications: true
            },
            data: {
                notifications: {
                    updateMany: {
                        where: {
                            new: true,
                        },
                        data: {
                            new: false,
                        }
                    }
                }
            }
        }).then(e=>{res.json({notifications:e.notifications.map(e=>{return {...e,createdAt:e.createdAt.toString()}})})})
    }

    if (!!session.token) {
        await main()
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

}