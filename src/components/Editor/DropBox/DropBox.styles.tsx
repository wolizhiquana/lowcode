import { css } from "@emotion/react";
import { styled } from "@mui/material";
import { blue } from "@mui/material/colors";

export interface DropContainerProps {
  dropPosition?: "upper" | "middle" | "lower";
  selected: boolean;
  isOver: boolean;
}

const BLUE_COLOR = blue[500];

export const DropContainer = styled("div")<DropContainerProps>`
  ${({ selected }) =>
    selected &&
    css`
      outline: ${BLUE_COLOR} solid 2px;
    `}

  &:hover {
    ${({ selected }) =>
      !selected &&
      css`
        outline: ${BLUE_COLOR} dotted 2px;
      `}
  }

  ${({ isOver }) =>
    isOver &&
    css`
      outline-style: none;
    `}

  ${({ isOver, dropPosition }) =>
    isOver &&
    (dropPosition === "upper"
      ? css`
          box-shadow: 0 -10px 5px ${BLUE_COLOR};
        `
      : dropPosition === "middle"
      ? css`
          background-color: ${BLUE_COLOR};
        `
      : dropPosition === "lower"
      ? css`
          box-shadow: 0 10px 5px ${BLUE_COLOR};
        `
      : null)}
`;
