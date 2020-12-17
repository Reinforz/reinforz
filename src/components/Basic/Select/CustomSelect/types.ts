export interface CustomSelectProps {
  label: string,
  onChange: (e: React.ChangeEvent<{
    name?: string | undefined;
    value: unknown;
  }>) => void,
  items: string[],
  value: string
}