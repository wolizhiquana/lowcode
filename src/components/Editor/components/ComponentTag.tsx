import { Button } from "@mui/material";
import { useDrag } from "react-dnd";

export interface ComponentTagProps {
  type: string;
  label: string;
}

export interface ComponentTagDragObject {
  type: string;
}

export default function ComponentTag({ type, label }: ComponentTagProps) {
  const [, drag] = useDrag<ComponentTagDragObject>({
    type: "componentTag",
    item: { type },
  });

  return (
    <Button ref={drag} variant="contained" fullWidth>
      {label}
    </Button>
  );
}
