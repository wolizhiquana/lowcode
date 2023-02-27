import { ReactNode } from "react";
import { useDrag } from "react-dnd";

export interface ComponentTagProps {
  type: string;
}
export interface ComponentTagItem {
  type: string;
}

export default function ComponentTag({ type }: ComponentTagProps) {
  const [, drag] = useDrag(() => ({
    type: "componentTag",
    item: { type },
  }));

  return (
    <div ref={drag} style={{ marginLeft: 10 }}>
      <button>{type}</button>
    </div>
  );
}
