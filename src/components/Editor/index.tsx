import { Box, Container, Grid } from "@mui/material";
import React, { useEffect } from "react";
import { useAppDispatch } from "../../hooks";
import DropBox from "./DropBox";
import ComponentTag from "./EditableComponent";
import Editable from "./EditableComponent";
import { addComponentSchemaData } from "./editor.slice";

export default function Editor() {
  const dispatch = useAppDispatch();

  return (
    // <Container>
    <Grid container p={1}>
      <Grid item xs={6}>
        <ComponentTag type="image" />
      </Grid>
      <Grid item xs={6}>
        <DropBox elementInfo={{ path: [], isContainer: true }}>
          <Box height={200}></Box>
        </DropBox>
      </Grid>
    </Grid>
    // </Container>
  );
}

// const createElement = (data: ComponentSchemaData): React.ReactNode => {
//   const { type, props } = data;
//   const Component = getComponentSchema(type)!.Component;

//   if ("childrenOrder" in data) {
//     const { children, childrenOrder } = data;
//     const renderedChildren = childrenOrder?.map((id) => {
//       const childData = children![id];
//       return createElement({
//         ...childData,
//         props: { key: id, ...childData.props },
//       });
//     });
//     return React.createElement(Component, props, renderedChildren);
//   }

//   return React.createElement(Component, props);
// };
