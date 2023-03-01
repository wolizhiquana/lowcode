import { RefObject, useState, useEffect } from "react";

export interface useHoverDetectorOptions {
  shallow?: boolean;
}

export function useHoverDetector(
  ref: RefObject<HTMLElement>,
  { shallow = false }: useHoverDetectorOptions = {}
) {
  const [isHover, setIsHover] = useState(false);

  const handleMouseOver = (e: MouseEvent): void => {
    if (ref.current) {
      if (shallow) setIsHover(ref.current === e.target);
      else setIsHover(ref.current.contains(e.target as Node));
    }
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  useEffect(() => {
    ref.current?.addEventListener("mouseover", handleMouseOver);
    ref.current?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      ref.current?.removeEventListener("mouseover", handleMouseOver);
      ref.current?.removeEventListener("mouseleave", handleMouseOver);
    };
  }, [ref]);

  return isHover;
}
