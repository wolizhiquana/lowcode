import { Box, Drawer, styled } from "@mui/material";
import CanvasPanel from "./layout/CanvasPanel";
import ComponentPanel from "./layout/ComponentPanel";
import ConfigurationPanel from "./layout/ConfigurationPanel";

const drawerWidth = 256;

const EditorDrawer = styled(Drawer)`
  width: ${drawerWidth}px;
  flex-shrink: 0;

  & .MuiDrawer-paper {
    width: ${drawerWidth}px;
    box-sizing: "border-box";
  }
`;

export default function Editor() {
  return (
    <Box display="flex" height="100vh">
      <EditorDrawer variant="permanent" anchor="left">
        <ComponentPanel />
      </EditorDrawer>

      <Box flexGrow={1} maxWidth={`calc(100vw - 2*${drawerWidth}px)`}>
        <CanvasPanel />
      </Box>

      <EditorDrawer variant="permanent" anchor="right">
        <ConfigurationPanel />
      </EditorDrawer>
    </Box>
  );
}
