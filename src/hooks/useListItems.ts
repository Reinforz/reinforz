export default function (items: any[], selectedItems: string[], setItems: any, setSelectedItems: any) {

  const selectEndFromClickWithCurrent = (index: number) => {
    setSelectedItems(selectedItems.concat(items.filter((item, i) => i >= index).map(item => item._id)));
  }

  const selectUptoClickedWithCurrent = (index: number) => {
    setSelectedItems(Array.from(new Set(selectedItems.concat(items.filter((item, i) => i <= index).map(item => item._id)))));
  }

  const selectEndFromClick = (index: number) => {
    setSelectedItems(items.filter((item, i) => i >= index).map(item => item._id));
  }

  const selectUptoClicked = (index: number) => {
    setSelectedItems(items.filter((item, i) => i <= index).map(item => item._id));
  }

  const removeSelectedItem = (_id: string) => { setSelectedItems(selectedItems.filter(item => item !== _id)) };

  const addSelectedItems = (_id: string) => setSelectedItems([...selectedItems, _id]);

  const deleteItem = (_id: string) => setItems(items.filter(item => item._id !== _id));

  const removeAndDeleteSelectedItem = (_id: string) => {
    deleteItem(_id);
    removeSelectedItem(_id)
  }

  const selectOnlyClicked = (_id: string) => setSelectedItems([_id]);

  return {
    selectEndFromClickWithCurrent,
    selectUptoClickedWithCurrent,
    selectEndFromClick,
    selectUptoClicked,
    removeSelectedItem,
    addSelectedItems,
    removeAndDeleteSelectedItem,
    selectOnlyClicked
  }
}