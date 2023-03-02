import { Box, BoxProps, ButtonProps, css, styled } from "@mui/material";
import { blue } from "@mui/material/colors";
import {
  forwardRef,
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { useDrop } from "react-dnd";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { useHoverDetector } from "../../../hooks/useHoverDetector";
import { getComponentSchema } from "../config/schemaConfig";
import EditableComponent from "./EditableComponent";
import {
  addComponentSchemaJson,
  selectComponentSchemaJson,
} from "../editor.slice";
import {
  AddComponentSchemaJsonPayload,
  ComponentSchemaJson,
} from "../editor.type";
import { ComponentTagDragObject } from "./ComponentTag";

export interface CanvasProps {
  pageSize: { width: number; height?: number };
  mode: "edit" | "preview";
}

interface ContainerProps {
  width: number;
  height?: number;
  isHovering: boolean;
  isDragHovering: boolean;
}

const Container = styled("div")<ContainerProps>(
  ({ width, height, isHovering, isDragHovering }) => ({
    width: width,
    height: height || "100%",
    outline: isHovering ? `3px dotted ${blue[500]}` : "none",
    outlineOffset: -3,
    backgroundColor: "white",
  })
);

const Canvas = forwardRef<HTMLDivElement, CanvasProps>(
  ({ pageSize: { width, height }, mode }, ref) => {
    const boxRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => boxRef.current!);
    const dispatch = useAppDispatch();

    const isHoveringCurrent = useHoverDetector(boxRef, { shallow: true });
    const [{ isDragOverCurrent }, drop] = useDrop<
      ComponentTagDragObject | { a: string },
      void,
      {
        isDragOverCurrent: boolean;
      }
    >({
      accept: ["componentTag", "editableElement"],
      collect: (monitor) => ({
        isDragOverCurrent: monitor.isOver({ shallow: true }),
      }),
      drop: (item, monitor) => {
        const acceptType = monitor.getItemType();

        if (isDragOverCurrent) {
          if (acceptType === "componentTag") {
            const payload = {} as AddComponentSchemaJsonPayload;

            payload.componentType = (item as ComponentTagDragObject).type;
            payload.position = "into";
            payload.referencedPath = [];

            dispatch(addComponentSchemaJson(payload));
          }
        }
      },
    });
    drop(boxRef);

    const json = useAppSelector(selectComponentSchemaJson);
    const { children: childrenJson, childrenOrder } = json;
    let children: ReactNode[] | null = null;
    if (mode === "edit") {
      if (childrenOrder && childrenJson)
        children = childrenOrder.map((id) =>
          createEditableElement(childrenJson[id])
        );
    }

    return (
      <Container
        ref={boxRef}
        width={width}
        height={height}
        isHovering={isHoveringCurrent}
        isDragHovering={isDragOverCurrent}
      >
        {children}
      </Container>
    );
  }
);

export default Canvas;

const createEditableElement = (data: ComponentSchemaJson): ReactNode => {
  const { type, path, props, children, childrenOrder } = data;
  const { Component, isContainer } = getComponentSchema(type);

  let renderedChildren;
  if (children && childrenOrder) {
    renderedChildren = childrenOrder.map((id) =>
      createEditableElement(children[id])
    );
  }

  return (
    <EditableComponent
      key={path.join()}
      path={path}
      Component={Component}
      isContainer={isContainer}
      props={props}
      children={renderedChildren}
    />
  );
};
