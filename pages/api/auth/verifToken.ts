import type { NextApiRequest, NextApiResponse } from 'next'
import Error from "../../../components/interfaces/error";
import { IUser, UserRoles } from "../../../components/interfaces/user";


export default function handler(req: NextApiRequest, res: NextApiResponse<IUser | Error>) {
    const {token } = req.body;
    if (token=="token") {
        const user: IUser =
        {
            id: "value",
            email: "value",
            passwordHash: "value",
            balance: 123,
            login: "value",
            role: UserRoles.owner, // админская муть
            rank: 1, // админская муть
            statusText: "value",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRrIWlj3HycbF5hOt4MU821nqg8HC979y0ow&usqp=CAU",
            rating: 123, //оценки пользователей
            token: "token",
            notifications:[]
        }
        res.json(user)
    } else {
        res.json({ "error": "AUTH.ERROR.wrongToken" })
    }

}