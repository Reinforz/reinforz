export interface MultiCheckboxGroupProps<T> {
  items: Array<[keyof T, Array<(string | boolean | number)>]>,
  state: T,
  setState: (state: T) => void
}