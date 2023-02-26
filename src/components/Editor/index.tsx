import React, { useEffect } from "react";
import { useAppDispatch } from "../../hooks";
import { addComponentSchemaData } from "./editor.slice";

export default function Editor() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      addComponentSchemaData({
        componentType: "container",
        referencedPath: [],
        position: "into",
      })
    );

    dispatch(
      addComponentSchemaData({
        componentType: "image",
        referencedPath: [1],
        position: "before",
      })
    );
  }, []);

  return <></>;
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
