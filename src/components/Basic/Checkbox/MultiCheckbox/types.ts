export interface MultiCheckboxProps<S> {
  name: keyof S,
  value: string,
  onChange: (e: React.ChangeEvent<{
    name?: string | undefined;
    value: unknown;
  }>) => void,
  items: string[],
  state: S,
  setState: (state: S) => void
}