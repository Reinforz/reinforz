import { useEffect, useState } from "react";
import { usePrevious } from "react-use";

export default function (items: any[], setItems: any) {
  const [selectedItems, setSelectedItems] = useState([] as string[])

  const prevItems = usePrevious(items);
  const prev_items_ids = prevItems?.map(prevItem => prevItem._id) ?? []
  const new_items = items.filter(item => !prev_items_ids.includes(item._id)).map(item => item._id)

  useEffect(() => {
    setSelectedItems([...selectedItems, ...new_items])
    // eslint-disable-next-line
  }, [items])

  const resetSelectedItems = () => setSelectedItems([]);
  const setAllSelected = () => setSelectedItems(items.map(item => item._id));
  const deleteSelectedItems = () => {
    const new_items = items.filter(item => !selectedItems.includes(item._id))
    setItems(new_items);
    setSelectedItems([])
    return new_items;
  };
  const removeSelectedItem = (_id: string) => { setSelectedItems(selectedItems.filter(item => item !== _id)) };
  const deleteItem = (_id: string) => setItems(items.filter(item => item._id !== _id));
  const removeAndDeleteSelectedItem = (_id: string) => {
    deleteItem(_id);
    removeSelectedItem(_id)
  }
  const addSelectedItems = (_id: string) => setSelectedItems([...selectedItems, _id]);

  const total_selected = selectedItems.length;

  return {
    resetSelectedItems,
    setAllSelected,
    deleteSelectedItems,
    removeSelectedItem,
    deleteItem,
    removeAndDeleteSelectedItem,
    addSelectedItems,
    total_selected,
    selectedItems,
    setSelectedItems
  }
}