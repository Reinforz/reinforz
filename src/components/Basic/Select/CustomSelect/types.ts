export interface CustomSelectProps {
  label: string,
  value: string,
  onChange: (e: React.ChangeEvent<{
    name?: string | undefined;
    value: unknown;
  }>) => void,
  items: string[],
}