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
      },
      typography: {
        "fontFamily": `"Fira Sans"`,
        "fontSize": 14,
      },
      color: {
        light: grey[800],
        dark: grey[900],
        base: darken(grey[800], .25),
      },
      overrides: {
        'MuiFormControlLabel': {
          'label': {
            color: lighten(grey[200], 0.25)
          },
        },
        'MuiTableRow': {
          'head': {
            backgroundColor: darken(grey[700], .25)
          }
        }
      }
    } as ExtendedThemeOptions);
  else return createMuiTheme({
    palette: {
      type: "light",
      text: {
        primary: grey[900],
        secondary: grey[800]
      },
      background: {
        paper: lighten(grey[200], .50)
      },
    },
    color: {
      light: lighten(grey[200], .50),
      dark: grey[300],
      base: grey[200],
    },
    typography: {
      "fontFamily": `"Fira Sans"`,
      "fontSize": 14,
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          "*::-webkit-scrollbar": {
            width: '10px'
          },
          "&::-webkit-scrollbar-track": {
            background: "#161616"
          },
          "&::-webkit-scrollbar-thumb": {
            background: grey[400]
          }
        },
      },
      'MuiTableCell': {
        stickyHeader: {
          backgroundColor: grey[300],
        },
      },
      'MuiTableFooter': {
        'root': {
          backgroundColor: lighten(grey[200], .50)
        }
      }
    }
  } as ExtendedThemeOptions);
}