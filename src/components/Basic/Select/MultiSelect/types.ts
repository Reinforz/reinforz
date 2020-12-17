export interface MultiSelectProps {
  label: string,
  onChange: (e: React.ChangeEvent<{
    name?: string | undefined;
    value: string[];
  }>) => void,
  value: string[],
  items: string[],
}