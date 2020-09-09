import { withStyles, lighten, darken } from '@material-ui/core/styles';

export default withStyles(
  (theme) => {
    const colorfn = {
      D: ["dark", darken],
      L: ["light", lighten]
    } as const;

    const ColorMap: Record<string, string> = {}

    type ThemeTypes = "l" | "d";
    type ThemeFns = "L" | "D";
    const theme_types = ["d", "l"] as ThemeTypes[];
    const theme_fns = ["D", "L"] as ThemeFns[];

    theme_fns.forEach(theme_fn => {
      theme_types.forEach(_theme_type => {
        (theme.palette.background as any)[colorfn[theme_fn][0]].forEach((shade: string, shade_index: number) => {
          [15, 25, 50].forEach(intensity => ColorMap[`${theme_fn}(${_theme_type}.${shade_index},${intensity})`] = colorfn[theme_fn][1](shade, intensity / 100))
        })
      })
    })

    return {
      '@global': {
        '.MuiFormControlLabel-label.Mui-disabled': {
          color: `${ColorMap['L(l.0,25)']} !important`
        },
        '.MuiCheckbox-colorPrimary.Mui-disabled': {
          color: `${ColorMap['L(l.0,25)']} !important`
        },
        '.MuiPaper-root': {
          backgroundColor: ColorMap['D(l.0,15)']
        },
        '.MuiTableRow-head': {
          backgroundColor: ColorMap['D(d.0,25)']
        },
        '.MuiTableRow-footer': {
          backgroundColor: ColorMap['D(d.0,25)']
        },
        '.MuiTableRow-head .MuiTableCell-stickyHeader': {
          backgroundColor: ColorMap['D(d.0,25)']
        },
        '.MuiTableCell-body': {
          backgroundColor: ColorMap['D(d.0,15)']
        }
      }
    };
  },
  { withTheme: true }
)(() => null);