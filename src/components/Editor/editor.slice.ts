import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { find, insert, remove } from "../../utils/dataStructure/pathTree";
import {
  AddComponentSchemaJsonPayload,
  ComponentSchemaJson,
  MoveComponentSchemaJsonPayload,
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
        const newData = { id, path, type: componentType, props };

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
        const newData = { id, path, type: componentType, props };

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
    moveComponentSchemaJson: (
      state,
      action: PayloadAction<MoveComponentSchemaJsonPayload>
    ) => {
      const { movingComponentPath, targetComponentPath, position } =
        action.payload;

      const source = find(state.componentSchemaJson, movingComponentPath);
      const target = find(state.componentSchemaJson, targetComponentPath);
      if (!source || !target) return;

      const sourceParentPath = source.path.slice(0, -1);
      const sourceParent = find(state.componentSchemaJson, sourceParentPath)!;

      const targetParentPath = target.path.slice(0, -1);
      const targetParent = find(state.componentSchemaJson, targetParentPath)!;

      delete sourceParent.children![source.id];
      sourceParent.childrenOrder = sourceParent.childrenOrder!.filter(
        (id) => id !== source.id
      );

      if (position === "into") {
        source.path = target.path.concat(source.id);
        insert(state.componentSchemaJson, source);
        targetParent.childrenOrder!.push(source.id);
      } else {
        source.path = targetParent.path.concat(source.id);
        targetParent.children![source.id] = source;
        const indexOfTargetInParent = targetParent.childrenOrder!.findIndex(
          (id) => id === target.id
        );
        targetParent.childrenOrder!.splice(
          indexOfTargetInParent + (position === "after" ? 1 : 0),
          0,
          source.id
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
export const {
  addComponentSchemaJson,
  moveComponentSchemaJson,
  setCurrentSchemaPath,
} = slice.actions;

// Selectors
export const selectEditorReducer = (state: RootState): EditorState =>
  state.eidtor;

export const selectComponentSchemaJson = createSelector(
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
