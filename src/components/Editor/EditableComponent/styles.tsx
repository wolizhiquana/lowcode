import { css } from "@emotion/react";
import { styled } from "@mui/material";
import { blue } from "@mui/material/colors";

export interface DropContainerProps {
  selected?: boolean;
  isHovering?: boolean;
  isDragHovering?: boolean;
  preDropPosition?: "upper" | "middle" | "lower";
}

const BLUE_COLOR = blue[500];

export const DropContainer = styled("div")<DropContainerProps>`
  ${({ selected }) =>
    selected &&
    css`
      outline: ${BLUE_COLOR} solid 2px;
    `}

  &:hover {
    ${({ selected, isHovering }) =>
      !selected &&
      isHovering &&
      css`
        outline: ${BLUE_COLOR} dotted 2px;
      `}
  }

  ${({ isDragHovering: isDragOvering }) =>
    isDragOvering &&
    css`
      outline-style: none;
    `}

  ${({ isDragHovering: isDragOvering, preDropPosition }) =>
    isDragOvering &&
    (preDropPosition === "upper"
      ? css`
          box-shadow: 0 -10px 5px ${BLUE_COLOR};
        `
      : preDropPosition === "middle"
      ? css`
          background-color: ${BLUE_COLOR};
        `
      : preDropPosition === "lower"
      ? css`
          box-shadow: 0 10px 5px ${BLUE_COLOR};
        `
      : null)}
`;
