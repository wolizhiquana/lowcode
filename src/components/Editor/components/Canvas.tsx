import { Box } from "@mui/material";
import { forwardRef } from "react";

export interface CanvasProps {
  pageSize: { width: number; height?: number };
  mode: "edit" | "preview";
}

const Canvas = forwardRef(
  ({ pageSize: { width, height }, mode }: CanvasProps, ref) => {
    return (
      <Box
        ref={ref}
        width={width}
        height={height || "100%"}
        bgcolor="white"
      ></Box>
    );
  }
);

export default Canvas;
