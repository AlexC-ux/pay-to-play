import { Theme, ThemeProvider } from "@mui/material";
import { Context, createContext, useState } from "react";
import { darkThemeOptions } from "../themes/dark";

export interface IGlobalContext {
    theme: [Theme, React.Dispatch<React.SetStateAction<Theme>>]
}


export const GlobalContext: Context<IGlobalContext | null> = createContext<IGlobalContext | null>(null)

export function GlobalContextWrapper(props: { children: any }) {
    const contextDefaultValue: IGlobalContext = {
        theme: useState(darkThemeOptions)
    }

    return <GlobalContext.Provider value={contextDefaultValue}>

        <ThemeProvider theme={contextDefaultValue.theme[0]}>
            {props.children}
        </ThemeProvider>
    </GlobalContext.Provider>

}