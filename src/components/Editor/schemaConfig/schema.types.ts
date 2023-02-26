export interface ComponentSchema {
  type: string;
  component: React.ComponentType<any> | keyof JSX.IntrinsicElements;
  propSchemas?: Record<string, PropSchema>;
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
