import Heading from "../customComponents/Heading";
import { ComponentSchema } from "./schema.types";

export interface ComponentSchemaMap {
  [type: string]: ComponentSchema;
}

export const componentSchemaMap: ComponentSchemaMap = {
  heading: {
    type: "heading",
    component: Heading,
    propSchemas: {
      level: {
        name: "level",
        label: "分级",
        type: "string",
        enum: [
          { label: "一级标题", value: "h1" },
          { label: "二级标题", value: "h2" },
          { label: "三级标题", value: "h3" },
          { label: "四级标题", value: "h4" },
          { label: "五级标题", value: "h5" },
          { label: "六级标题", value: "h6" },
        ],
        default: "h1",
      },
      children: {
        name: "children",
        label: "标题内容",
        type: "string",
        default: "标题内容",
      },
    },
  },
  paragraph: {
    type: "paragraph",
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
    component: "a",
    propSchemas: {
      hildren: {
        name: "children",
        label: "文本内容",
        type: "string",
        default: "文本内容",
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
    component: "div",
  },
};
