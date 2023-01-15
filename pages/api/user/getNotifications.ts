import { PrismaClient } from "@prisma/client";
import { setCookie } from "cookies-next";
import type { NextApiRequest, NextApiResponse } from 'next'
import Error from "../../../components/interfaces/error";
import { INotification } from "../../../components/interfaces/notification";
import { IUser } from "../../../components/interfaces/user";


export default function handler(req: NextApiRequest, res: NextApiResponse<INotification[] | Error>) {
    const { token } = req.body;
    const prisma = new PrismaClient();
    async function main() {
        prisma.users.findUnique({
            where: {
                token: token,
            },
            include: {
                notifications: true,
            }
        }).then(user => {
            if (user != null) {
                res.json((<IUser><unknown>user).notifications)
            } else {
                res.json({ "error": "AUTH.ERROR.wrongToken" })
            }
        })
    }

    main()
        .then(async () => {
            await prisma.$disconnect()
        })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })

}