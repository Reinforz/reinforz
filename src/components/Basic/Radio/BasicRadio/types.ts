export interface BasicRadioProps<T> {
  name: keyof T,
  items: (string | boolean | number)[],
  state: T,
  setState: (state: T) => void
}