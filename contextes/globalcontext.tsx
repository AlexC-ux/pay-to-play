import { Theme, ThemeProvider } from "@mui/material";
import { Context, createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { IUser } from "../components/interfaces/user";
import { darkThemeOptions } from "../themes/dark";
import HasToken from "./Checkers/HasToken";

export interface IGlobalContext {
    theme: [Theme, React.Dispatch<React.SetStateAction<Theme>>]
    user: {
        value: IUser | undefined
        dispatch: Dispatch<SetStateAction<undefined | IUser>>
    }
}


export const GlobalContext: Context<IGlobalContext | null> = createContext<IGlobalContext | null>(null)

export function GlobalContextWrapper(props: { children: any }) {

    const [userDefault, setUserDefault]: [IUser | undefined, Dispatch<SetStateAction<IUser | undefined>>] = useState()

    const contextDefaultValue: IGlobalContext = {
        theme: useState(darkThemeOptions),
        user: {
            value: userDefault,
            dispatch: setUserDefault
        }
    }

    return <GlobalContext.Provider value={contextDefaultValue}>

        <ThemeProvider theme={contextDefaultValue.theme[0]}>
            <HasToken />
            {props.children}
        </ThemeProvider>
    </GlobalContext.Provider>

}