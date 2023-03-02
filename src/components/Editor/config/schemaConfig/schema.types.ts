import { ComponentType, ReactHTML } from "react";

export interface ComponentSchema {
  type: string;
  label: string;
  Component: ComponentType<any> | keyof ReactHTML;
  propSchemas?: Record<string, PropSchema>;
  isContainer?: boolean;
}

export interface PropSchemaBase {
  name: string;
  label: string;
  required?: boolean;
}

export interface StringPropSchema extends PropSchemaBase {
  type: "string";
  enum?: { label: string; value: string }[];
  default: string;
}

export interface NumberPropSchema extends PropSchemaBase {
  type: "number";
  enum?: { label: string; value: number }[];
  default: number;
}
export interface BooleanPropSchema extends PropSchemaBase {
  type: "number";
  default: boolean;
}

type PropSchema = StringPropSchema | NumberPropSchema | BooleanPropSchema;
