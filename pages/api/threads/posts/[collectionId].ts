import { PrismaClient, ThreadComment, Users } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from "../../../../app/sessions";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Error | any>) {
    const { collectionId, page } = req.query

    const session = await getSession(req, res);
    const prisma = new PrismaClient();
    async function main() {

        await prisma.users.findUnique({
            where: {
                token: session.token
            }
        }).then(async user => {
            if (!!user) {
                await prisma.thread.findMany({
                    where: {
                        threadsCollectionId: `${collectionId}`
                    },
                    orderBy: {
                        createdAt: "asc"
                    },
                    include: {
                        _count: {
                            select: {
                                comments: true
                            }
                        }
                    },
                    skip: (Number(page) || 0) * 50,
                    take: 50
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