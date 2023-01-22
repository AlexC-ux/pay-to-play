import { Notifications, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "../../../app/sessions";
import Error from "../../../components/interfaces/error";


export default async function handler(req: NextApiRequest, res: NextApiResponse<Error | any[]>) {
    const { page } = req.query;
    const session = await getSession(req, res);
    const prisma = new PrismaClient();
    async function main() {
        await prisma.notifications.findMany({
            where: {
                user: {
                    token: session.token
                }
            },
            orderBy: {
                createdAt: "asc",
            },
            skip: (Number(page) || 0) * 15,
            take: 15,
        }).then(notifs => {
            res.json(notifs.map(notification => { return { ...notification, createdAt: notification.createdAt.toString() } }))
        })
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