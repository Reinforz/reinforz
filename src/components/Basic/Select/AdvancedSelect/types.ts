export interface AdvancedSelectProps<T extends { _id: string }> {
  label: string,
  onChange: (e: React.ChangeEvent<{
    name?: string | undefined;
    value: string[];
  }>) => void,
  value: string[],
  items: T[],
  transformDisplay: (item: T) => string
}