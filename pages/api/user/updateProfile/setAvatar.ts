import { Notifications, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "../../../../app/sessions";
import util from "util";
import multer from "multer";
import fs from "fs";
import { cwd } from 'node:process';
import path from "path";
import cuid from "cuid";

export const config = {
    api: {
        bodyParser: false,
    },
};


export default async function handler(req: any, res: any) {
    const session = await getSession(req, res);
    const prisma = new PrismaClient();

    await util.promisify(multer().any())(req, res);
    const avatarFile: {
        fieldname: string,
        originalname: string,
        encoding: string,
        mimetype: string,
        buffer: Buffer
        size: number
    } = req.files[0];

    if (avatarFile.mimetype.match(/(image\/){1,1}(png|jpeg){1,1}/gm)) {
        if (avatarFile.size <= 102400) {
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
        } else {
            res.json({ "error": "API.AVATAR.FileSizeError" })
        }
    } else {
        res.json({ "error": "API.AVATAR.FileFormatError" })
    }


    async function main() {
        await prisma.users.findUnique({
            where: {
                token: session.token
            },
            select: {
                avatar: true
            }
        }).then(async user => {
            if (!!user) {
                const oldUserAvatarName = user.avatar
                const avatarsDirectory = path.resolve(cwd(), "public", "avatars");
                const newUserAvatarName = `${cuid()}.${/(image\/)(png|jpeg)/gm.exec(avatarFile.mimetype)![2]}`;
                if (oldUserAvatarName != "") {
                    fs.unlinkSync(path.resolve(avatarsDirectory, oldUserAvatarName))
                }
                fs.writeFileSync(path.resolve(avatarsDirectory, newUserAvatarName), avatarFile.buffer)
                await prisma.users.update({
                    where: {
                        token: session.token
                    },
                    data: {
                        avatar: newUserAvatarName
                    },
                    select: {
                        avatar: true
                    }
                }).then(user => {
                    res.json(user)
                })
            } else {
                res.json({ "error": "AUTH.ERROR.wrongToken" })
            }
        })
    }

}