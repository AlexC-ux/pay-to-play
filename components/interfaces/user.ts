import { INotification } from "./notification";

export enum UserRoles {
    low,
    user,
    medium,
    moderator,
    admin,
    owner
}

export interface IUser {
    id: string,
    email: string,
    passwordHash: string,
    balance: number,
    login: string, //maxlen 27
    role: UserRoles, // админская муть
    rank: number, // админская муть
    statusText: string,
    avatar: string,
    rating: number, //оценки пользователей
    token: string,
    notifications:INotification[]
}