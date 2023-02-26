export interface ComponentSchemaData {
  path: number[];
  type: string;
  props: Record<string, any>;
  children?: Record<string, ComponentSchemaData>;
  childrenOrder?: number[];
}

export interface AddComponentSchemaDataPayload {
  componentType: string;
  referencedPath: number[];
  position: "into" | "before" | "after";
}
