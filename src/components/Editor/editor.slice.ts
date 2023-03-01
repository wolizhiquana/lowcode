import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { find, insert } from "../../utils/dataStructure/pathTree";
import {
  AddComponentSchemaJsonPayload,
  ComponentSchemaJson,
} from "./editor.type";
import { getComponentDefaultProps } from "./config/schemaConfig";

export interface EditorState {
  componentSchemaJson: ComponentSchemaJson;
  currentSchemaPath?: number[];
  nextUId: number;
}

const initialState: EditorState = {
  componentSchemaJson: {
    path: [] as ComponentSchemaJson["path"],
  } as ComponentSchemaJson,
  nextUId: 1,
};

const slice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    addComponentSchemaJson: (
      state,
      action: PayloadAction<AddComponentSchemaJsonPayload>
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

    setCurrentSchemaPath: (
      state,
      action: PayloadAction<{ path: number[] }>
    ) => {
      state.currentSchemaPath = action.payload.path;
    },
  },
});

export const editorReducer = slice.reducer;
export const { addComponentSchemaJson, setCurrentSchemaPath } = slice.actions;

// Selectors
export const selectEditorReducer = (state: RootState): EditorState =>
  state.eidtor;

export const selectRootComponentSchemaJson = createSelector(
  [selectEditorReducer],
  ({ componentSchemaJson }) => componentSchemaJson
);

export const selectComponentSchemaJsonByPath = (path: number[]) =>
  createSelector([selectEditorReducer], ({ componentSchemaJson }) =>
    find(componentSchemaJson, path)
  );

export const selectCurrentSchemaPath = createSelector(
  [selectEditorReducer],
  ({ currentSchemaPath: selectedPath }) => selectedPath
);
