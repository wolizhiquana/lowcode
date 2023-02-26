import React from "react";

export interface HeadingProps extends React.HTMLProps<HTMLHeadingElement> {
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export default function Heading({ level, ...rest }: HeadingProps) {
  return React.createElement(level, rest);
}
