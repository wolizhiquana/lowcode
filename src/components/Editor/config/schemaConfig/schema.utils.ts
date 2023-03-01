import { ComponentType } from "react";
import { componentSchemaMap } from "./schema.config";
import { ComponentSchema } from "./schema.types";

export const getComponentSchema = (type: string): ComponentSchema => {
  const schema = componentSchemaMap[type];
  if (!schema) throw new Error(`invalid compoennt type: ${type}`);

  return schema;
};

export const getComponentSchemas = (): ComponentSchema[] => {
  return Object.values(componentSchemaMap);
};

export const getComponent = (type: string): ComponentSchema["component"] => {
  return getComponentSchema(type).component;
};

export const getComponentDefaultProps = (
  type: string
): Record<string, any> | undefined => {
  const schema = getComponentSchema(type);
  if (!schema) throw new Error(`invalid component type: ${type}`);
  if (!schema.propSchemas) return {};

  return Object.entries(schema.propSchemas).reduce(
    (props, [name, schema]) => ({ ...props, [name]: schema.default }),
    {} as Record<string, any>
  );
};
