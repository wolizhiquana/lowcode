export interface ComponentSchemaJson {
  id: number;
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

export interface MoveComponentSchemaJsonPayload {
  movingComponentPath: number[];
  targetComponentPath: number[];
  position: "into" | "before" | "after";
}
