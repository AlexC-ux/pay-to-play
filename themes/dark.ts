import { blue, pink } from "@mui/material/colors";
import { createTheme, Theme } from "@mui/material/styles";

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

export const darkThemeOptions: Theme = createTheme(
  {
    palette: {
      mode: "dark",
      primary: {
        main: '#27737f',
      },
      secondary: {
        main: '#10bba6',
      },
      background: {
        default: '#1d2b2a',
        paper: '#243735',
      },
      getContrastText(color:string) {
        return "grey"
      },
      warning: {
        main: '#b18137',
      },
      text: {
        primary: '#eaeaea',
      },
    },
    typography: {
      fontFamily: 'Montserrat',
    },
    components: {
      MuiTypography: {
        defaultProps: {
          color: "text.primary"
        }
      }
    },
  }
)