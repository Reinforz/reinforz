import { useReducer, useCallback } from "react";

interface State<T extends { id: string }> {
  items: T[],
  selected_items: string[]
}

type Action = {
  type: "SELECT_ALL",
} | {
  type: "DESELECT_ALL"
} | {
  type: "SELECT",
  payload: { ids: string[] }
} | {
  type: "DESELECT",
  payload: { ids: string[] }
} | {
  type: "DELETE_SELECTED"
} | {
  type: "DELETE",
  payload: { id: string }
}

function useListReducer<T extends { id: string }>(state: State<T>, action: Action): State<T> {
  switch (action.type) {
    case "DELETE_SELECTED": {
      const items = state.items.filter(item => !state.selected_items.includes(item.id))
      return {
        items,
        selected_items: []
      }
    }
    case "DELETE":
      const items = state.items.filter(item => action.payload.id !== item.id),
        selected_items = state.selected_items.filter(id => action.payload.id !== id);
      return {
        items,
        selected_items
      }
    case "DESELECT":
      return {
        items: state.items,
        selected_items: state.selected_items.filter(id => !action.payload.ids.includes(id))
      }
    case "DESELECT_ALL":
      return {
        items: state.items,
        selected_items: []
      }
    case "SELECT":
      state.selected_items.push(...action.payload.ids)
      return state;
    case "SELECT_ALL":
      return {
        items: state.items,
        selected_items: state.items.map(item => item.id)
      }
  }
}

export default function <T extends { id: string }>(initial_items: T[]) {
  const [{ items, selected_items }, dispatch] = useReducer(useListReducer, {
    items: initial_items,
    selected_items: []
  })

  const deleteSelectedItems = useCallback(() => dispatch({ type: "DELETE_SELECTED" }), []),
    deleteItem = useCallback((id: string) => dispatch({ type: "DELETE", payload: { id } }), []),
    deselectItems = useCallback((ids: string[]) => dispatch({ type: "DESELECT", payload: { ids } }), []),
    selectItems = useCallback((ids: string[]) => dispatch({ type: "SELECT", payload: { ids } }), []),
    deselectAllItems = useCallback(() => dispatch({ type: "DESELECT_ALL" }), []),
    selectAllItems = useCallback(() => dispatch({ type: "SELECT_ALL" }), [])

  return {
    items,
    selected_items,
    total_selected: selected_items.length,
    total_items: items.length,
    deleteSelectedItems,
    deleteItem,
    deselectItems,
    deselectAllItems,
    selectItems,
    selectAllItems
  }
}