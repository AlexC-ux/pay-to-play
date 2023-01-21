import { PrismaClient, ThreadComment, Users } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "../../../../../app/sessions";
import Error from "../../../../../components/interfaces/error";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Error | any>) {
    const { id } = req.query
    const { commentText } = req.body

    const session = await getSession(req, res);
    const prisma = new PrismaClient();
    async function main() {

        await prisma.users.findUnique({
            where: {
                token: session.token
            }
        }).then(async user => {
            if (!!user) {
                await prisma.thread.update({
                    where: {
                        id: `${id}`
                    },
                    data: {
                        comments: {
                            create: {
                                user: {
                                    connect:{
                                        id:user.id
                                    }
                                },
                                text: commentText,
                                createdAt: Date.now(),
                                likes:0,
                            }
                        }
                    }
                })
            }
        })

    }

    if (!!session.token) {
        await main()
            .then(async () => {
                await prisma.$disconnect()
                res.json({})
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