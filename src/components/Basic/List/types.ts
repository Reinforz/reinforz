export interface ListState {
  selected_items: string[],
  selectItems: (data: string[]) => void
}

export interface ListPropsCommon<T extends { _id: string }> {
  fields: (string | ((data: T) => string))[],
  icons?: ((index: number, _id: string) => void)[],
}

export interface ListProps<T extends { _id: string }> extends ListPropsCommon<T> {
  header: string,
  children: (state: ListState) => JSX.Element,
  items: T[],
  className: string
}