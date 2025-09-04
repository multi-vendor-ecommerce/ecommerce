import { useState, useEffect } from "react";

const countDown = (start, onEnd) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (count <= 0) {
      if (onEnd) onEnd();
      return;
    }
    const timer = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, onEnd]);

  const reset = () => setCount(start);

  return [count, reset];
};

export default countDown;