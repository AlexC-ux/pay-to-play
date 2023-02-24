import { PrismaClient, ThreadComment, Users } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from "../../../../../app/sessions";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Error | any>) {
    const { title, collectionId, content } = req.body;

    if (!title||!collectionId||!content) {
        res.writeHead(301, { Location: '/userprofile/me' })
        res.end()
        return;
    }
    const session = await getSession(req, res);
    const prisma = new PrismaClient();
    async function main() {
        await prisma.users.findUnique({
            where: {
                token: session.token
            }
        }).then(async user => {
            if (!!user) {
                await prisma.thread.create({
                    data: {
                        title,
                        description: content,
                        threadsCollectionId: collectionId,
                        usersId: user.id,
                        createdAt: Date.now(),
                    }
                }).then((result) => {
                    res.json({createdPostId:result.id})
                })
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