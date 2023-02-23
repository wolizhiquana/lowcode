import { Button } from "@mui/material";
import React from "react";
import Heading from "./customComponents/Heading";

export interface ComponentSchema {
  type: string;
  Component?: React.ComponentType<any>;
}

export const getComponent = (type: string): ComponentSchema | undefined => {
  return schemaConfig[type];
};

export const schemaConfig: Record<string, ComponentSchema> = {
  div: {
    type: "div",
  },
  heading: {
    type: "heading",
    Component: Heading,
  },
  p: {
    type: "p",
  },
  a: {
    type: "a",
  },
  img: {
    type: "img",
  },
  "mui/button": {
    type: "mui/button",
    Component: Button,
  },
};
