import { Box } from "@mui/material";
import { blue } from "@mui/material/colors";
import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import useBoundingClientRect from "../../../hooks/useBoundingClientRect";
import { useHoverDetector } from "../../../hooks/useHoverDetector";
import { ComponentTagObject } from "../components/ComponentTag";
import {
  addComponentSchemaJson,
  selectComponentSchemaJsonByPath,
  selectCurrentSchemaPath,
  selectRootComponentSchemaJson,
  setCurrentSchemaPath,
} from "../editor.slice";
import {
  AddComponentSchemaJsonPayload,
  ComponentSchemaJson,
} from "../editor.type";
import { getComponent, getComponentSchema } from "../config/schemaConfig";
import { DropContainer } from "./styles";

export interface EditableComponentProps {
  path: number[];
  children?: ReactNode[];
}

export interface EditableComponentDragObject {}

export default function EditableComponent({
  path,
  children,
}: EditableComponentProps) {
  const ref = useRef<HTMLElement>(null);
  const componentData = useAppSelector(selectComponentSchemaJsonByPath(path));
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
    ComponentTagObject | EditableComponentDragObject,
    void,
    { isDragHovering: boolean; domRect?: DOMRect }
  >({
    accept: ["componentTag", "editableElement"],
    hover: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset || !domRect) return;

      const top = clientOffset.y - domRect.top;
      const bottom = domRect.bottom - clientOffset.y;

      let isContainer;
      if (componentData)
        isContainer = getComponentSchema(componentData.type).isContainer;
      if (isContainer) {
        if (top < domRect.height / 5) setPreDropPosition("upper");
        else if (bottom < domRect.height / 5) setPreDropPosition("lower");
        else setPreDropPosition("middle");
      } else {
        if (top < domRect.height / 2) setPreDropPosition("upper");
        else setPreDropPosition("lower");
      }
    },
    drop: (item, monitor) => {
      const acceptType = monitor.getItemType();

      if (isDragHovering) {
        if (acceptType === "componentTag") {
          const payload = {} as AddComponentSchemaJsonPayload;

          payload.componentType = (item as ComponentTagObject).type;
          payload.referencedPath = path;
          if (preDropPosition === "upper") payload.position = "before";
          else if (preDropPosition === "middle") payload.position = "into";
          else payload.position = "after";

          dispatch(addComponentSchemaJson(payload));
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
  });

  drag(drop(ref));

  if (!componentData) return null;
  const { component: Component, isContainer } = getComponentSchema(
    componentData.type
  );

  let styles: CSSProperties = {};
  const BLUE_COLOR = blue[500];
  if (isContainer && !children) {
    styles.height = "50px";
    styles.outline = "grey dashed 2px";
  }
  if (isSelected) styles.outline = `${BLUE_COLOR} solid 2px`;
  else if (isHovering) styles.outline = `${BLUE_COLOR} dotted 2px`;

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
      {...componentData.props}
      children={children || componentData.props.children}
      style={{ ...styles, ...componentData.props.style }}
      onClick={(e: MouseEvent) => {
        handleClick(e), componentData.props.onClick?.call();
      }}
    />
  );
}

export function DrawerTest() {
  const { children, childrenOrder } = useAppSelector(
    selectRootComponentSchemaJson
  );

  let renderedChildren;
  if (children && childrenOrder) {
    renderedChildren = childrenOrder.map((id) =>
      createEditableElement(children[id])
    );
  }

  return <Box height={"100vh"}>{renderedChildren}</Box>;
}

const createEditableElement = (data: ComponentSchemaJson): React.ReactNode => {
  const { path, children, childrenOrder } = data;

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
      children={renderedChildren}
    />
  );
};
