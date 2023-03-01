import { css } from "@emotion/react";
import { Box, styled, Toolbar } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Canvas from "../components/Canvas";

const CanvasContainer = styled(Box)`
  flex-grow: 1;
  padding: 1rem;
  display: grid;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.12);
  overflow: auto;
`;

export default function CanvasPanel() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLElement>(null);
  const [justifyContent, setJustifyContent] = useState<"start" | "center">(
    "center"
  );

  useEffect(() => {
    const handler = () => {
      const containerWidth =
        containerRef.current!.getBoundingClientRect().width;
      const canvasWidth = canvasRef.current!.getBoundingClientRect().width;

      if (containerWidth < canvasWidth) setJustifyContent("start");
      else setJustifyContent("center");
    };

    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Toolbar></Toolbar>

      <CanvasContainer ref={containerRef} justifyContent={justifyContent}>
        <Canvas ref={canvasRef} pageSize={{ width: 1280 }} mode="edit" />
      </CanvasContainer>

      <Toolbar></Toolbar>
    </Box>
  );
}
