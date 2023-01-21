import type { NextApiRequest, NextApiResponse } from 'next'
import Error from "../../../components/interfaces/error";
import { PrismaClient, UserRoles, Users } from '@prisma/client'
import { getSession } from '../../../app/sessions';

export default async function CheckCredentailsApi(req: NextApiRequest, res: NextApiResponse<Users | Error>) {
    const { username, passwordHash } = req.body;
    const session = await getSession(req, res)
    session.touch();
    const prisma = new PrismaClient();
    async function main() {
        await prisma.users.findFirst({
            where: {
                login: username,
                passwordHash,
                NOT: {
                    role: {
                        has: UserRoles.low
                    }
                }
            },
            include: {
                notifications: true,
            }
        }).then(user => {
            if (user != null) {
                session.token = user.token;
                session.cookie.expires = new Date(Date.now() + 12 * 60 * 60 * 1000);
            } else {
                res.json({ "error": "AUTH.ERROR.wrongPasswd" })
            }
        })

    }

    main()
        .then(async () => {
            await session.commit();
            if (!!session.token) {
                res.redirect("/userprofile/me")
            }
            await prisma.$disconnect()
        })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })
}