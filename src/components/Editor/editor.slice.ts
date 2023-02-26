import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { find, insert } from "../../utils/dataStructure/pathTree";
import {
  AddComponentSchemaDataPayload,
  ComponentSchemaData,
} from "./editor.type";
import { getComponentDefaultProps } from "./schemaConfig";

export interface EditorState {
  componentSchemaJson: ComponentSchemaData;
  nextUId: number;
}

const initialState: EditorState = {
  componentSchemaJson: {
    path: [] as ComponentSchemaData["path"],
  } as ComponentSchemaData,
  nextUId: 1,
};

const slice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    addComponentSchemaData: (
      state,
      action: PayloadAction<AddComponentSchemaDataPayload>
    ) => {
      const { componentType, referencedPath, position } = action.payload;

      if (position === "into") {
        const referenced = find(state.componentSchemaJson, referencedPath);
        if (!referenced) return;

        const id = state.nextUId++;
        const path = [...referencedPath, id];
        const props = getComponentDefaultProps(componentType);
        const newData = { path, type: componentType, props };

        insert(state.componentSchemaJson, newData);
        if (!referenced.childrenOrder) referenced.childrenOrder = [];
        referenced.childrenOrder.push(id);
      } else {
        const referencedParentPath = referencedPath.slice(0, -1);
        const referencedParent = find(
          state.componentSchemaJson,
          referencedParentPath
        );
        if (!referencedParent) return;

        const id = state.nextUId++;
        const path = [...referencedParentPath, id];
        const props = getComponentDefaultProps(componentType);
        const newData = { path, type: componentType, props };

        insert(state.componentSchemaJson, newData);
        const indexOfReferenceInParent =
          referencedParent.childrenOrder!.findIndex(
            (id) => id === referencedPath[referencedPath.length - 1]
          );
        referencedParent.childrenOrder!.splice(
          indexOfReferenceInParent + (position === "after" ? 1 : 0),
          0,
          id
        );
      }
    },
  },
});

export const editorReducer = slice.reducer;
export const { addComponentSchemaData } = slice.actions;
