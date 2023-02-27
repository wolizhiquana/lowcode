import { ReactNode, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { useAppDispatch } from "../../../hooks";
import { ComponentTagItem } from "../EditableComponent";
import { addComponentSchemaData } from "../editor.slice";
import { AddComponentSchemaDataPayload } from "../editor.type";
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
  const [dropPosition, setDropPosition] =
    useState<DropContainerProps["dropPosition"]>();
  const despatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop<
    ComponentTagItem,
    void,
    { isOver: boolean }
  >(() => ({
    accept: ["componentTag", "element"],
    drop(item, monitor) {
      const dragSourceType = monitor.getItemType();
      if (dragSourceType === "componentTag") {
        const payload = {} as AddComponentSchemaDataPayload;

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

        despatch(addComponentSchemaData(payload));
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
        if (top < rect.height / 5) setDropPosition("upper");
        else if (bottom < rect.height / 5) setDropPosition("lower");
        else setDropPosition("middle");
      } else {
        if (top < rect.height / 2) setDropPosition("upper");
        else setDropPosition("lower");
      }
    },
    collect: (monitor) => {
      return { isOver: monitor.isOver() };
    },
  }));
  drop(ref);

  return (
    <DropContainer
      ref={ref}
      selected={false}
      dropPosition={dropPosition}
      isOver={isOver}
    >
      {children}
    </DropContainer>
  );
}
