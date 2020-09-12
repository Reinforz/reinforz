import { createMuiTheme, lighten, darken } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { ExtendedThemeOptions } from '../types';

export default function (theme: "dark" | "light") {
  if (theme === "dark")
    return createMuiTheme({
      palette: {
        type: "dark",
        text: {
          primary: grey[100],
          secondary: grey[200]
        },
        background: {
          defaultt: darken(grey[800], .25),
        }
      },
      typography: {
        "fontFamily": `"Fira Sans"`,
        "fontSize": 14,
      },
      color: {
        light: grey[800],
        dark: grey[900],
        base: darken(grey[800], .25),
        opposite_dark: grey[300],
        opposite_base: grey[200],
        opposite_light: lighten(grey[200], .50)
      },
    } as ExtendedThemeOptions);
  else return createMuiTheme({
    palette: {
      type: "light",
      text: {
        primary: grey[900],
        secondary: grey[800]
      },
      background: {
        paper: lighten(grey[200], .50),
        default: grey[200]
      },
    },
    color: {
      light: lighten(grey[200], .50),
      dark: grey[300],
      base: grey[200],
      opposite_dark: grey[900],
      opposite_base: darken(grey[800], .25),
      opposite_light: grey[800]
    },
    typography: {
      "fontFamily": `"Fira Sans"`,
      "fontSize": 14,
    },
  } as ExtendedThemeOptions);
}