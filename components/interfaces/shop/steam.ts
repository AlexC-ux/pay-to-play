import { ISteamGame } from "./game";

export interface ISteamAccountCard{
    sellerName:string,
    lastOnline:number,
    title:string,
    cost:number,
    boosted:boolean,
    time:number,
    id:string,
    games:ISteamGame[]
}

export interface ISteamAccountDescription extends ISteamAccountCard{
    balance:number,
    balanceCurrency:string//валюта
}