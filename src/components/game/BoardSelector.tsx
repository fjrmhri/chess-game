"use client";

import { BOARD_OPTIONS, BoardId } from "@/constants/boardOptions";
import { cn } from "@/lib/utils";

interface BoardSelectorProps {
  value: BoardId;
  onChange: (boardId: BoardId) => void;
}

export function BoardSelector({ value, onChange }: BoardSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {BOARD_OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={cn(
            "group overflow-hidden rounded-lg border bg-card text-left transition hover:border-primary/60 hover:shadow-md",
            value === option.id ? "border-primary ring-2 ring-primary/30" : "border-border/70"
          )}
        >
          <div
            className="relative aspect-square w-full"
            style={{
              backgroundImage: `url(${option.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="flex items-center justify-between px-3 py-2 text-sm">
            <span className="font-medium text-foreground">{option.label}</span>
            {value === option.id ? (
              <span className="rounded-full bg-primary/15 px-2 py-1 text-[11px] font-semibold text-primary">Selected</span>
            ) : (
              <span className="text-[11px] text-muted-foreground">Tap to use</span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
