import boardPersp01 from "../../assets/board/board_persp_01.png";
import boardPersp02 from "../../assets/board/board_persp_02.png";
import boardPersp03 from "../../assets/board/board_persp_03.png";
import boardPersp04 from "../../assets/board/board_persp_04.png";
import boardPersp05 from "../../assets/board/board_persp_05.png";
import boardPlain01 from "../../assets/board/board_plain_01.png";
import boardPlain02 from "../../assets/board/board_plain_02.png";
import boardPlain03 from "../../assets/board/board_plain_03.png";
import boardPlain04 from "../../assets/board/board_plain_04.png";
import boardPlain05 from "../../assets/board/board_plain_05.png";

export const BOARD_OPTIONS = [
  { id: "board_persp_01", label: "Perspective 01", src: boardPersp01.src },
  { id: "board_persp_02", label: "Perspective 02", src: boardPersp02.src },
  { id: "board_persp_03", label: "Perspective 03", src: boardPersp03.src },
  { id: "board_persp_04", label: "Perspective 04", src: boardPersp04.src },
  { id: "board_persp_05", label: "Perspective 05", src: boardPersp05.src },
  { id: "board_plain_01", label: "Classic 01", src: boardPlain01.src },
  { id: "board_plain_02", label: "Classic 02", src: boardPlain02.src },
  { id: "board_plain_03", label: "Classic 03", src: boardPlain03.src },
  { id: "board_plain_04", label: "Classic 04", src: boardPlain04.src },
  { id: "board_plain_05", label: "Classic 05", src: boardPlain05.src },
] as const;

export type BoardOption = (typeof BOARD_OPTIONS)[number];
export type BoardId = BoardOption["id"];
export const DEFAULT_BOARD_ID: BoardId = BOARD_OPTIONS[0].id;

export function getBoardOptionById(boardId: string | null | undefined): BoardOption {
  const fallback = BOARD_OPTIONS[0];
  if (!boardId) return fallback;

  return BOARD_OPTIONS.find((option) => option.id === boardId) ?? fallback;
}
