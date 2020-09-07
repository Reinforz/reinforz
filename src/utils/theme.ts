import { createMuiTheme } from '@material-ui/core/styles';
import { blue, red, pink } from '@material-ui/core/colors';

import { ExtendedTypeBackground } from '../types';

export default createMuiTheme({
  typography: {
    "fontFamily": `"Fira Sans"`,
    "fontSize": 14,
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500
  },
  palette: {
    primary: { main: blue['500'] },
    secondary: { main: pink.A400 },
    text: {
      primary: '#ddd',
      secondary: '#ccccccd1'
    },
    error: {
      main: red[500],
      dark: red['900']
    },
    background: {
      paper: '#fff',
      default: '#fafafa',
      dark: ['#212121', '#424242', '#616161'],
      main: ['#212121', '#424242', '#616161'],
      light: ['#9e9e9e', '#bdbdbd', '#e0e0e0']
    } as ExtendedTypeBackground
  },
});