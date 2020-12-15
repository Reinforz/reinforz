export interface CustomRadioProps<T> {
  name: keyof T,
  items: (string | boolean | number)[],
  state: T,
  setState: (state: T) => void
}