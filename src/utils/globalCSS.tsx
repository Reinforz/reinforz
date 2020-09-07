import { withStyles, lighten } from '@material-ui/core/styles';

import { ExtendedTypeBackground } from '../types';

export default withStyles(
  (theme) => {
    const light025 = lighten((theme.palette.background as ExtendedTypeBackground).light[0], 0.25);
    return {
      '@global': {
        '.MuiFormControlLabel-label.Mui-disabled': {
          color: `${light025} !important`
        },
        '.MuiCheckbox-colorPrimary.Mui-disabled': {
          color: `${light025} !important`
        }
      }
    };
  },
  { withTheme: true }
)(() => null);