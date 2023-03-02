import { blue } from "@mui/material/colors";
import {
  ComponentType,
  CSSProperties,
  ReactHTML,
  ReactNode,
  useRef,
  useState,
} from "react";
import { useDrag, useDrop } from "react-dnd";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { useHoverDetector } from "../../../hooks/useHoverDetector";
import { ComponentTagDragObject } from "./ComponentTag";
import {
  addComponentSchemaJson,
  moveComponentSchemaJson,
  selectComponentSchemaJsonByPath,
  selectCurrentSchemaPath,
  setCurrentSchemaPath,
} from "../editor.slice";
import {
  AddComponentSchemaJsonPayload,
  MoveComponentSchemaJsonPayload,
} from "../editor.type";

export interface EditableComponentProps {
  path: number[];
  Component: ComponentType<any> | keyof ReactHTML;
  isContainer?: boolean;
  props: Record<string, any>;
  children?: ReactNode[];
}

export interface EditableComponentDragObject {
  path: number[];
}

export default function EditableComponent({
  path,
  Component,
  isContainer,
  props,
  children,
}: EditableComponentProps) {
  const ref = useRef<HTMLElement>(null);
  const isSelected = useAppSelector(selectCurrentSchemaPath) === path;
  const [preDropPosition, setPreDropPosition] = useState<
    "upper" | "middle" | "lower"
  >();
  const isHovering = useHoverDetector(ref, { shallow: true });
  const dispatch = useAppDispatch();
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    dispatch(setCurrentSchemaPath({ path }));
  };

  const [{ isDragHovering, domRect }, drop] = useDrop<
    ComponentTagDragObject | EditableComponentDragObject,
    void,
    { isDragHovering: boolean; domRect?: DOMRect }
  >({
    accept: ["componentTag", "editableElement"],
    hover: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset || !domRect) return;

      const top = clientOffset.y - domRect.top;
      const bottom = domRect.bottom - clientOffset.y;

      if (isContainer) {
        if (top < domRect.height / 5) setPreDropPosition("upper");
        else if (bottom < domRect.height / 5) setPreDropPosition("lower");
        else setPreDropPosition("middle");
      } else {
        if (top < domRect.height / 2) setPreDropPosition("upper");
        else setPreDropPosition("lower");
      }
    },
    canDrop: (item, monitor) => {
      const acceptType = monitor.getItemType();

      if (acceptType === "editableElement")
        if ((item as EditableComponentDragObject).path === path) return false;

      return true;
    },
    drop: (item, monitor) => {
      const acceptType = monitor.getItemType();

      if (isDragHovering) {
        if (acceptType === "componentTag") {
          const payload = {} as AddComponentSchemaJsonPayload;

          payload.componentType = (item as ComponentTagDragObject).type;
          payload.referencedPath = path;
          if (preDropPosition === "upper") payload.position = "before";
          else if (preDropPosition === "middle") payload.position = "into";
          else payload.position = "after";

          dispatch(addComponentSchemaJson(payload));
        } else if (acceptType === "editableElement") {
          const payload = {} as MoveComponentSchemaJsonPayload;

          payload.movingComponentPath = (
            item as EditableComponentDragObject
          ).path;
          payload.targetComponentPath = path;
          if (preDropPosition === "upper") payload.position = "before";
          else if (preDropPosition === "middle") payload.position = "into";
          else payload.position = "after";

          dispatch(moveComponentSchemaJson(payload));
        }
      }
    },
    collect: (monitor) => ({
      isDragHovering: monitor.isOver({ shallow: true }),
      domRect: ref.current?.getBoundingClientRect(),
    }),
  });

  const [, drag] = useDrag({
    type: "editableElement",
    item: { path },
  });

  drag(drop(ref));

  let styles: CSSProperties = {};
  const BLUE_COLOR = blue[500];
  if (isContainer && !children) {
    styles.height = "50px";
    styles.outline = "grey dashed 3px";
    styles.outlineOffset = "-3px";
  }
  if (isSelected) {
    styles.outline = `${BLUE_COLOR} solid 3px`;
    styles.outlineOffset = "-3px";
  } else if (isHovering) {
    styles.outline = `${BLUE_COLOR} dotted 3px`;
    styles.outlineOffset = "-3px";
  }

  if (isDragHovering) {
    styles.outline = "none";
    if (preDropPosition === "upper")
      styles.boxShadow = `0 -10px 5px ${BLUE_COLOR}`;
    if (preDropPosition === "middle") styles.backgroundColor = BLUE_COLOR;
    if (preDropPosition === "lower")
      styles.boxShadow = `0 10px 5px ${BLUE_COLOR}`;
  }

  return (
    <Component
      ref={ref}
      {...props}
      children={children || props.children}
      style={{ ...styles, ...props.style }}
      onClick={handleClick}
    />
  );
}
