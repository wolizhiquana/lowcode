import { ComponentSchemaData, createElement } from "./util";

const data: ComponentSchemaData = {
  id: 1,
  type: "div",
  children: [
    { id: 2, type: "heading", props: { level: "h1", children: "heading" } },
    { id: 3, type: "img", props: { src: "https://picsum.photos/100/100" } },
    { id: 4, type: "p", props: { children: "hello, world!" } },
    {
      id: 5,
      type: "mui/button",
      props: { variant: "contained", children: "button" },
    },
  ],
};

export default function Editor() {
  return <div>{createElement(data)}</div>;
}
