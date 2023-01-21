import { Theme, ThemeProvider } from "@mui/material";
import React, { useState } from "react";
import { darkThemeOptions } from "../../themes/dark";

export const ThemeContext = React.createContext({ state: darkThemeOptions, dispatch: (a: Theme) => { } });


export function ThemeContextWrapper(props: { children: JSX.Element }) {

    const [state, dispatch] = useState(darkThemeOptions)

    return <ThemeContext.Provider value={{ state, dispatch }}>
        <ThemeProvider theme={state}>
            {props.children}
        </ThemeProvider>
    </ThemeContext.Provider>
}