export interface ListState {
  selectedItems: string[],
  setSelectedItems: (data: string[]) => void
}

export interface ListPropsCommon<T> {
  fields: (string | ((data: T) => string))[],
  icons?: ((index: number, _id: string) => void)[],
  onDelete?: (items: T[]) => void
  items: T[],
}

export interface ListProps<T> extends ListPropsCommon<T> {
  header: string,
  children: any,
  setItems: (data: T[]) => void,
}