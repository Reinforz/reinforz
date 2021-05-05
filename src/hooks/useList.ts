import { useReducer, useCallback } from "react";

interface State {
  selected_items: string[]
}

type Action = {
  type: "DESELECT_ALL"
} | {
  type: "SELECT",
  payload: { ids: string[] }
} | {
  type: "DESELECT",
  payload: { ids: string[] }
} | {
  type: "TOGGLE",
  payload: { id: string }
}

function useListReducer(state: State, action: Action): State {
  switch (action.type) {
    case "DESELECT":
      return {
        selected_items: state.selected_items.filter(id => !action.payload.ids.includes(id))
      }
    case "DESELECT_ALL":
      return {
        selected_items: []
      }
    case "SELECT":
      state.selected_items.push(...action.payload.ids)
      return state;
    case "TOGGLE":
      const is_selected = state.selected_items.includes(action.payload.id);
      if (!is_selected) state.selected_items.push(action.payload.id);
      else state.selected_items = state.selected_items.filter(id => id !== action.payload.id);
      return {
        selected_items: state.selected_items,
      }
  }
}

export default function () {
  const [{ selected_items }, dispatch] = useReducer(useListReducer, {
    selected_items: []
  });

  const deselectItems = useCallback((ids: string[]) => dispatch({ type: "DESELECT", payload: { ids } }), []),
    selectItems = useCallback((ids: string[]) => dispatch({ type: "SELECT", payload: { ids } }), []),
    deselectAllItems = useCallback(() => dispatch({ type: "DESELECT_ALL" }), []),
    toggleItem = useCallback((id: string) => dispatch({ type: "TOGGLE", payload: { id } }), []);

  return {
    selected_items,
    total_selected: selected_items.length,
    deselectItems,
    deselectAllItems,
    selectItems,
    toggleItem
  }
}