import { ComponentSchema } from "./schema.types";

export interface ComponentSchemaMap {
  [type: string]: ComponentSchema;
}

export const componentSchemaMap: ComponentSchemaMap = {
  paragraph: {
    type: "paragraph",
    label: "段落",
    component: "p",
    propSchemas: {
      children: {
        name: "children",
        label: "段落内容",
        type: "string",
        default: "段落内容",
      },
    },
  },
  link: {
    type: "link",
    label: "链接",
    component: "a",
    propSchemas: {
      children: {
        name: "children",
        label: "文本内容",
        type: "string",
        default: "文本内容",
      },
      href: {
        name: "href",
        label: "链接地址",
        type: "string",
        default: "#",
      },
      target: {
        name: "target",
        label: "打开方式",
        type: "string",
        enum: [
          { label: "当前页面打开", value: "_self" },
          { label: "新窗口打开", value: "_blank" },
        ],
        default: "_self",
      },
    },
  },
  image: {
    type: "image",
    label: "图片",
    component: "img",
    propSchemas: {
      src: {
        name: "src",
        label: "地址",
        type: "string",
        default: "https://picsum.photos/100",
      },
      alt: {
        name: "alt",
        label: "备用描述",
        type: "string",
        default: "一张随机图片",
      },
    },
  },
  container: {
    type: "container",
    label: "普通容器",
    component: "div",
    isContainer: true,
  },
};
