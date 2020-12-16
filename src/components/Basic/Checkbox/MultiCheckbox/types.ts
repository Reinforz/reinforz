export interface MultiCheckboxProps<S> {
  name: keyof S,
  items: string[],
  state: S,
  setState: (state: S) => void
}