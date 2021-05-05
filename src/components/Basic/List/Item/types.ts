import { ListPropsCommon } from "../types";
export interface ListItemProps<T extends { _id: string }> extends ListPropsCommon<T> {
  item: T,
  index: number,
  toggleItem: (id: string) => void,
  selected_items: string[],
}