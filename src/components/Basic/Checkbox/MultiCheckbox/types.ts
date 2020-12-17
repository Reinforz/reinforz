export interface MultiCheckboxProps<S> {
  name: keyof S,
  items: (string | boolean | number)[],
  state: S,
  setState: (state: S) => void
}