import { configureStore } from "@reduxjs/toolkit";
import { editorReducer } from "./components/Editor/editor.slice";

export const store = configureStore({
  reducer: {
    eidtor: editorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
