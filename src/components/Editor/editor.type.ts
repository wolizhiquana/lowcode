export interface ComponentSchemaJson {
  path: number[];
  type: string;
  props: Record<string, any>;
  children?: Record<string, ComponentSchemaJson>;
  childrenOrder?: number[];
}

export interface AddComponentSchemaJsonPayload {
  componentType: string;
  referencedPath: number[];
  position: "into" | "before" | "after";
}
