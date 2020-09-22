import { useState } from "react";

export default function (items: any[]) {
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