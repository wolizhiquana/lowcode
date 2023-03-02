import { RefObject, useState, useEffect } from "react";

export interface useHoverDetectorOptions {
  shallow?: boolean;
}

export function useHoverDetector(
  ref: RefObject<HTMLElement>,
  { shallow = false }: useHoverDetectorOptions = {}
) {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseOver = (e: MouseEvent): void => {
    if (ref?.current) {
      if (shallow) setIsHovering(ref.current === e.target);
      else setIsHovering(ref.current.contains(e.target as Node));
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  useEffect(() => {
    ref.current?.addEventListener("mouseover", handleMouseOver);
    ref.current?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      ref.current?.removeEventListener("mouseover", handleMouseOver);
      ref.current?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref]);

  return isHovering;
}
