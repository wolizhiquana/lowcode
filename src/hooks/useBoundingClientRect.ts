import { useState, useEffect } from "react";

const useBoundingClientRect = (
  ref: React.RefObject<Element>
): DOMRect | null => {
  const [DOMRect, setDOMRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setDOMRect(ref.current.getBoundingClientRect());
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [ref]);

  return DOMRect;
};

export default useBoundingClientRect;
