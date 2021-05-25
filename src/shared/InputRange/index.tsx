import { FormGroup, InputBaseComponentProps, InputLabel, TextField } from "@material-ui/core";

interface Props<T extends Record<string, any>> {
  label: string
  state: T,
  stateKey: keyof T
  range: [number, number]
  setState: (value: React.SetStateAction<T>) => void
  inputProps: [InputBaseComponentProps, InputBaseComponentProps]
}

export default function InputRange<T extends Record<string, any>>(props: Props<T>) {
  const { inputProps, setState, state, stateKey, range, label } = props;

  return <FormGroup>
    <InputLabel>{label}</InputLabel>
    <TextField type="number" inputProps={inputProps[0]} value={range[0]} onChange={(e) => {
      setState({ ...state, [stateKey]: [e.target.value, range[1]] })
    }} />
    <TextField type="number" inputProps={inputProps[1]} value={range[1]} onChange={(e) => {
      setState({ ...state, [stateKey]: [range[0], e.target.value] })
    }} />
  </FormGroup>
}