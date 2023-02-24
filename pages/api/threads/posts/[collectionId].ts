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
                    where: collectionId != "latest" ? {
                        threadsCollectionId: `${collectionId}`
                    } : { threadsCollectionId: { not: null } },
                    orderBy: {
                        createdAt: "desc"
                    },
                    include: {
                        userOwner: {
                            select: {
                                login: true,
                                avatar: true,
                            }
                        },
                        _count: {
                            select: {
                                comments: true,
                            }
                        }
                    },
                    skip: (Number(page) || 0) * 10,
                    take: 10
                }).then(
                    async threads => {
                        const threadsTotal: number = await prisma.thread.count({
                            where: collectionId != "latest" ? {
                                threadsCollectionId: `${collectionId}`
                            } : { threadsCollectionId: { not: null } },
                        })
                        res.json(
                            { threads: threads.map(t => { return { ...t, createdAt: t.createdAt.toString() } }), threadsTotal }
                        )
                    }
                )
            }
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