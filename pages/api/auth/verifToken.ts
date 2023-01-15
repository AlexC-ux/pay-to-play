import type { NextApiRequest, NextApiResponse } from 'next'
import Error from "../../../components/interfaces/error";
import { IUser, UserRoles } from "../../../components/interfaces/user";
import { PrismaClient } from '@prisma/client'

export default function handler(req: NextApiRequest, res: NextApiResponse<IUser | Error>) {
    const { token } = req.body;
    const prisma = new PrismaClient();
    async function main() {
        prisma.users.findUnique({
            where: {
                token: token,
            },
            include:{
                notifications:true,
            }
        }).then(user => {
            if (user != null) {
                res.json(<IUser><unknown>user)
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