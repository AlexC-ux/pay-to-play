import { setCookie } from "cookies-next";
import type { NextApiRequest, NextApiResponse } from 'next'
import Error from "../../../components/interfaces/error";
import { INotification } from "../../../components/interfaces/notification";


export default function handler(req: NextApiRequest, res: NextApiResponse<INotification[] | Error>) {
    const { token } = req.body;
    if (token == "token") {
        const notifs: INotification[] = [{ id: "-1", title: "Тестовое уведомление", time: Date.now(), text: "Тестовое содержание еведомления.", new:true }]
        res.json(notifs)
    } else {
        res.json({ "error": "AUTH.ERROR.wrongToken" })
    }

}