import { PrismaClient, ThreadComment, Users } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "../../../../../app/sessions";
import Error from "../../../../../components/interfaces/error";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Error | any>) {
    const { id } = req.query

    const session = await getSession(req, res);
    const prisma = new PrismaClient();
    async function main() {
        await prisma.users.findUnique({
            where: {
                token: session.token
            },
        }).then(async user => {
            if (!!user) {
                await prisma.threadComment.findUnique({
                    where: {
                        id: `${id}`
                    },
                    include: {
                        Thread: {
                            select: {
                                userOwner: {
                                    select: {
                                        id: true,
                                    }
                                }
                            }
                        }
                    }
                }).then(async comment => {
                    if (!!comment) {
                        if (comment.usersId == user.id
                            ||
                            comment.Thread?.userOwner?.id == user.id) {
                            await prisma.threadComment.delete({
                                where: {
                                    id: `${id}`
                                }
                            })
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
                res.statusCode = 200;
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