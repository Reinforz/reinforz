import { useState } from "react";

export default function (timeout: number) {
  const [is_disabled, setIsDisabled] = useState(false);

  return {
    disable: () => {
      setIsDisabled(true);
      setTimeout(() => {
        setIsDisabled(false)
      }, timeout)
    },
    is_disabled
  }
}