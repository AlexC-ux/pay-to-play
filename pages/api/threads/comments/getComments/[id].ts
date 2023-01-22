import { BookmarkStore, PrismaClient, ThreadComment, Users } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "../../../../../app/sessions";
import Error from "../../../../../components/interfaces/error";


export default async function getWallCommentsHandler(req: NextApiRequest, res: NextApiResponse<Error | (ThreadComment & { user: { avatar: string, login: string, BookmarkStore: BookmarkStore } })[]>) {
    const { id, page } = req.query;

    const session = await getSession(req, res);
    const prisma = new PrismaClient();
    async function main() {
        if (!!session.token && !!id) {
            await prisma.users.findUnique({
                where: {
                    token: session.token,
                },
                select: {
                    token: true,
                    BookmarkStore: {
                        select: {
                            likedComments: {
                                where: {
                                    threadId: `${id}`
                                },
                                orderBy: {
                                    createdAt: "asc"
                                },
                                select: {
                                    id: true
                                }
                            }
                        }
                    },
                    id: true,
                    login: true,
                }
            }).then(async user => {
                if (!!user) {
                    const userLikedCommentsIds = user.BookmarkStore.likedComments.map(e => e.id);

                    await prisma.threadComment.findMany({
                        where: {
                            threadId: `${id}`,
                        },
                        orderBy: {
                            createdAt: "asc",
                        },
                        include: {
                            Thread: {
                                select: {
                                    _count: {
                                        select: {
                                            comments: true
                                        }
                                    }
                                }
                            },
                            user: {
                                select: {
                                    avatar: true,
                                    id: true,
                                    login: true,
                                }
                            }
                        },
                        take: 15,
                        skip: (Number(page) || 0) * 15
                    }).then(threadComments => {
                        const resultComments: any[] = threadComments
                        for (let index = 0; index < threadComments.length; index++) {
                            const comment = threadComments[index];
                            resultComments[index].createdAt = comment.createdAt.toString()
                            if (userLikedCommentsIds.includes(comment.id)) {
                                resultComments[index].liked = true
                            } else {
                                resultComments[index].liked = false
                            }
                        }
                        res.json(resultComments)
                    })
                }
            })
        }
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