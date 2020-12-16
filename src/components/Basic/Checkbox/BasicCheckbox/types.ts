import { CheckboxProps } from "@material-ui/core";

export interface BasicCheckboxProps extends CheckboxProps {
  disabled?: boolean,
  checked: boolean,
  name: string,
}