import { useState } from "react";

export interface UseCycleOutput {
  // Current item obtained from current_index
  current_item: any;
  // Used to get the next item in the cycle
  getNextIndex: () => void;
  // Used to get the prev item in the cycle
  getPrevIndex: () => void;
  // Checks whether or not the cycle has been xhausted
  hasEnded: boolean;
  // Get the current index of the cycle
  current_index: number;
  // Checks whether current_index is the last item
  is_last_item: boolean;
}

export default function (items: any[]): UseCycleOutput {
  const [current_index, setCurrentIndex] = useState(0);

  return {
    current_item: items[current_index],
    getNextIndex: () => {
      setCurrentIndex(current_index + 1)
    },
    getPrevIndex: () => {
      setCurrentIndex(current_index - 1)
    },
    hasEnded: current_index === items.length,
    current_index,
    is_last_item: current_index === items.length - 1
  }
}

