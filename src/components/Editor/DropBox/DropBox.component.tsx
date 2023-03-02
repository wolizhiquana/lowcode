import { ReactNode, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { useAppDispatch } from "../../../hooks";
import { useHoverDetector } from "../../../hooks/useHoverDetector";
import { ComponentTagItem } from "../components/EditableComponent";
import { addComponentSchemaData } from "../editor.slice";
import { AddComponentSchemaJsonPayload } from "../editor.type";
import { DropContainer, DropContainerProps } from "./DropBox.styles";

export interface DropBoxProps {
  elementInfo: {
    path: number[];
    isContainer?: boolean;
  };
  children: ReactNode;
}

export default function DropBox({
  elementInfo: { path, isContainer = false },
  children,
}: DropBoxProps) {
  const [preDropPosition, setPreDropPosition] =
    useState<DropContainerProps["preDropPosition"]>();

  const dispatch = useAppDispatch();

  const ref = useRef<HTMLDivElement>(null);

  const isHovering = useHoverDetector(ref, { shallow: true });

  const [{ isOver }, drop] = useDrop<
    ComponentTagItem,
    void,
    { isOver: boolean }
  >(() => ({
    accept: ["componentTag", "element"],
    drop(item, monitor) {
      const dragSourceType = monitor.getItemType();
      if (dragSourceType === "componentTag") {
        const payload = {} as AddComponentSchemaJsonPayload;

        payload.componentType = item.type;
        payload.referencedPath = path;

        const clientOffset = monitor.getClientOffset();
        const rect = ref.current?.getBoundingClientRect();
        if (!clientOffset || !rect) return;

        const top = clientOffset.y - rect.top;
        const bottom = rect.bottom - clientOffset.y;
        if (isContainer) {
          if (top < rect.height / 5) payload.position = "before";
          else if (bottom < rect.height / 5) payload.position = "after";
          else payload.position = "into";
        } else {
          if (top < rect.height / 2) payload.position = "before";
          else payload.position = "after";
        }

        dispatch(addComponentSchemaData(payload));
      } else if (dragSourceType === "element") {
      }
    },
    hover(item, monitor) {
      const clientOffset = monitor.getClientOffset();
      const rect = ref.current?.getBoundingClientRect();
      if (!clientOffset || !rect) return;

      const top = clientOffset.y - rect.top;
      const bottom = rect.bottom - clientOffset.y;
      if (isContainer) {
        if (top < rect.height / 5) setPreDropPosition("upper");
        else if (bottom < rect.height / 5) setPreDropPosition("lower");
        else setPreDropPosition("middle");
      } else {
        if (top < rect.height / 2) setPreDropPosition("upper");
        else setPreDropPosition("lower");
      }
    },
    collect: (monitor) => {
      return { isOver: monitor.isOver({ shallow: true }) };
    },
  }));

  drop(ref);

  return (
    <DropContainer
      ref={ref}
      selected={false}
      isHovering={isHovering}
      isDragOvering={isOver}
      preDropPosition={preDropPosition}
    >
      {children}
    </DropContainer>
  );
}
