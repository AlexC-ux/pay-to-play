import type { NextApiRequest, NextApiResponse } from 'next'
import Error from "../../../components/interfaces/error";
import { IUser, UserRoles } from "../../../components/interfaces/user";
import { sha512, sha256 } from 'crypto-hash';
import { PrismaClient } from '@prisma/client'


export default function handler(req: NextApiRequest, res: NextApiResponse<IUser | Error>) {
    let { email, passwordHash, login }: { email: string, passwordHash: string, login: string } = req.body;

    const prisma = new PrismaClient();

    async function main(props: { token: string }) {
        await prisma.users.create({
            data: {
                token: props.token,
                login: login,
                email: email,
                passwordHash: passwordHash,
                statusText: "",
                avatar: "",
                rating: 0,
                rank: 0,
                balance: 0,
            },
        }).then(newUser => {
            const user = <unknown>newUser;
            res.json(<IUser>user);
        })
    }

    verifCreds().then(isValid => {
        if (isValid) {
            const token = `${sha512(`${sha256(login)}.xxxx${sha256(email)}.yyyy${sha256(passwordHash.substring(10, 30))}`)}.x${sha256("email")}`
            main({ token })
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
    })




    async function verifCreds() {

        email = email.toLowerCase();

        if (
            email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            &&
            passwordHash.length == (await sha512("123")).length
            &&
            login.length > 6
        ) {

        }
        return true
    }

}