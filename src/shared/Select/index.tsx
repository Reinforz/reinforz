import { FormGroup, InputLabel, MenuItem, Select as MuiSelect } from "@material-ui/core";

interface Props<T extends Record<string, any>> {
  label: string
  state: T,
  stateKey: keyof T
  setState: (value: React.SetStateAction<T>) => void
  items: string[]
  menuItemLabel: (item: string) => string
}

export function Select<T extends Record<string, any>>(props: Props<T>) {
  const { items, menuItemLabel, state, stateKey, setState } = props;
  return <FormGroup>
    <InputLabel>{props.label}</InputLabel>
    <MuiSelect value={state[stateKey] as string[]}
      multiple
      onChange={(e) => {
        setState({ ...state, [stateKey]: e.target.value as string[] })
      }}>
      {items.map(item =>
        <MenuItem key={item} value={item}>{menuItemLabel(item)}</MenuItem>
      )}
    </MuiSelect>
  </FormGroup>
}