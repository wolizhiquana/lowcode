import { Box } from "@mui/material";
import React, { ComponentType } from "react";
import { useAppSelector } from "../../hooks";
import DropBox from "./DropBox";
import { ComponentSchemaJson } from "./editor.type";
import { getComponent, getComponentSchema } from "./config/schemaConfig";

export default function Drawer() {
  const componentDataJson = useAppSelector(
    (state) => state.eidtor.componentSchemaJson
  );

  const renderedChildren = componentDataJson.childrenOrder?.map((id) => {
    return createElement(componentDataJson.children![id]);
  });

  return (
    <DropBox elementInfo={{ path: [], isContainer: true }}>
      <Box height={200} width={200}>
        {renderedChildren}
      </Box>
    </DropBox>
  );
}

const createElement = (data: ComponentSchemaJson): React.ReactNode => {
  const { type, path, props } = data;
  const { component: Component, isContainer } = getComponentSchema(type);

  const { children, childrenOrder } = data;
  if (children && childrenOrder) {
    const renderedChildren = childrenOrder?.map((id) => {
      const childData = children![id];
      return createElement(childData);
    });
    return (
      <DropBox elementInfo={{ path, isContainer }} key={path.join()}>
        <Component {...props}>{renderedChildren}</Component>
      </DropBox>
    );
  }

  return (
    <DropBox
      elementInfo={{ path, isContainer: !!isContainer }}
      key={path.join()}
    >
      <Component {...props} />
    </DropBox>
  );
};

const a: ComponentType = () => <></>;
