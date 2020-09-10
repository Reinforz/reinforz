import { createMuiTheme, lighten, darken } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

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
    });
  else return createMuiTheme({
    palette: {
      type: "light",
      text: {
        primary: grey[900],
        secondary: grey[800]
      },
    },
    typography: {
      "fontFamily": `"Fira Sans"`,
      "fontSize": 14,
    },
    overrides: {
      'MuiTableCell': {
        stickyHeader: {
          backgroundColor: grey[300],
        }
      }
    }
  });
}

/*
        ,
        '.MuiTableRow-footer': {
          backgroundColor: ColorMap['D(d.0,25)']
        },
        '.MuiTableRow-head .MuiTableCell-stickyHeader': {
          backgroundColor: ColorMap['D(d.0,25)']
        },
        '.MuiTableCell-body': {
          backgroundColor: ColorMap['D(d.0,15)']
        }
*/