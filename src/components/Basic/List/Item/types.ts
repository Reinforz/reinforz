import { ListPropsCommon } from "../types";

export interface ListItemProps<T> extends ListPropsCommon<T> {
  item: T,
  index: number,
  setItems: any,
  setSelectedItems: any,
  selectedItems: string[],
  onDrag: (dragIndex: number, hoverIndex: number) => void
}