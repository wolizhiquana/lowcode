import React from "react";
import { getComponent } from "./config";

export interface ComponentSchemaData {
  id: number;
  type: string;
  props?: Record<string, any>;
  children?: ComponentSchemaData[];
}

export const createElement = (data: ComponentSchemaData): React.ReactNode => {
  const { type, props, children: childrenData } = data;
  const Component = getComponent(type)?.Component || type;

  const children =
    childrenData?.map((data) =>
      createElement({ ...data, props: { key: data.id, ...data.props } })
    ) || props?.children;

  return React.createElement(Component, props, children);
};
