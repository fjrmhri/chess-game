"use client";

import { useCallback, useEffect, useState } from "react";

import { BOARD_OPTIONS, BoardId, getBoardOptionById } from "@/constants/boardOptions";

type UseBoardPreferenceReturn = {
  boardId: BoardId;
  boardTexture: string;
  boardLabel: string;
  setBoardId: (boardId: BoardId) => void;
};

const STORAGE_KEY = "preferred-board-id";

export function useBoardPreference(): UseBoardPreferenceReturn {
  const [boardId, setBoardIdState] = useState<BoardId>(BOARD_OPTIONS[0].id);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const option = getBoardOptionById(saved);
    setBoardIdState(option.id);
  }, []);

  const setBoardId = useCallback((nextId: BoardId) => {
    setBoardIdState(nextId);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, nextId);
    }
  }, []);

  const selectedBoard = getBoardOptionById(boardId);

  return {
    boardId,
    boardTexture: selectedBoard.src,
    boardLabel: selectedBoard.label,
    setBoardId,
  };
}
