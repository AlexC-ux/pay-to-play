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
            include: {
                BookmarkStore: {
                    include: {
                        likedComments: true
                    }
                }
            }
        }).then(async user => {
            if (user != null) {
                const liked = user.BookmarkStore.likedComments.map(m => m.id).includes(`${id}`)

                await prisma.threadComment.findUnique({
                    where: {
                        id: `${id}`
                    },
                    include: {
                        user: true,
                    },
                }).then(async thComment => {

                    //если не самолайк
                    if (thComment?.user.id != user.id) {
                        //если лайка нет еще
                        if (!liked) {
                            //добавление лайка коменту и автору в суммарные
                            prisma.threadComment.update({
                                where: {
                                    id: `${id}`
                                },
                                include: {
                                    user: true,
                                },
                                data: {
                                    likes: {
                                        increment: 1
                                    },
                                    user: {
                                        update: {
                                            likesSummary: {
                                                increment: 1
                                            }
                                        }
                                    }
                                }
                            })

                            //добавление в закладки лайкнувшего
                            prisma.bookmarkStore.update({
                                where: {
                                    id: user.bookmarkStoreId
                                },
                                data: {
                                    likedComments: {
                                        connect: {
                                            id: `${id}`,
                                        }
                                    }
                                }
                            })
                        }
                        //если лайк уже есть
                        else {
                            //снятие лайка коменту и у автора в суммарных
                            prisma.threadComment.update({
                                where: {
                                    id: `${id}`
                                },
                                include: {
                                    user: true,
                                },
                                data: {
                                    likes: {
                                        decrement: 1
                                    },
                                    user: {
                                        update: {
                                            likesSummary: {
                                                decrement: 1
                                            }
                                        }
                                    }
                                }
                            })


                            //удаление из закладок лайкнувшего
                            prisma.bookmarkStore.update({
                                where: {
                                    id: user.bookmarkStoreId
                                },
                                data: {
                                    likedComments: {
                                        disconnect: {
                                            id: `${id}`,
                                        }
                                    }
                                }
                            })
                        }
                    }
                    //если самолайк
                    else {
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