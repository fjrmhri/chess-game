// Komponen SVG bidak catur bergaya minimalis
// Sumber: User:Cburnett, CC BY-SA 3.0, via Wikimedia Commons

import { SVGProps } from "react";

const pieceStyles: SVGProps<SVGSVGElement> = {
  stroke: "black",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  width: "100%",
  height: "100%",
};

export function WhiteKing(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...pieceStyles} {...props}>
      <g fill="white">
        <path d="M 22.5,11.63 L 22.5,6" style={{ fill: "none", stroke: "black", strokeLinejoin: "miter" }} />
        <path d="M 20,8 L 25,8" style={{ fill: "none", stroke: "black", strokeLinejoin: "miter" }} />
        <path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25" />
        <path d="M 11.5,37 C 17,40.5 27,40.5 32.5,37 L 32.5,32 C 32.5,32 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,25 L 22.5,25 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,32 12.5,32 L 11.5,37" />
        <path d="M 20,8 L 25,8" style={{ fill: "none", stroke: "black", strokeLinejoin: "miter" }} />
      </g>
    </svg>
  );
}

export function WhiteQueen(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...pieceStyles} {...props}>
      <g fill="white">
        <path d="M 8,12 A 4,4 0 1,1 16,12" />
        <path d="M 37,12 A 4,4 0 1,1 29,12" />
        <path d="M 22.5,12.5 L 22.5,12.5 A 4,4 0 1,1 22.5,12.5" />
        <path d="M 15,11 L 30,11" />
        <path d="M 11.5,14.5 A 25.5,25.5 0 0,1 33.5,14.5" />
        <path d="M 11.5,14.5 C 17.5,24.5 27.5,24.5 33.5,14.5" />
        <path d="M 11.5,37 C 17,40.5 27,40.5 32.5,37 L 32.5,32 C 32.5,32 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,25 L 22.5,25 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,32 12.5,32 L 11.5,37" />
      </g>
    </svg>
  );
}

export function WhiteRook(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...pieceStyles} {...props}>
      <g fill="white">
        <path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z" />
        <path d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z" />
        <path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14" />
        <path d="M 34,14 L 31,14 L 31,29.5 L 14,29.5 L 14,14 L 11,14" />
        <path d="M 31,14 L 31,29.5 L 14,29.5 L 14,14" style={{ fill: "none", stroke: "white", strokeWidth: 0 }} />
      </g>
    </svg>
  );
}

export function WhiteBishop(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...pieceStyles} {...props}>
      <g fill="white">
        <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.26,38.99 36,38.5 C 32.11,37.5 25.89,38.5 22.5,34.5 C 19.11,38.5 12.89,37.5 9,38.5 C 7.74,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36" />
        <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 34.5,24.5 32,11.5 30,9 C 28,5 24,5 22.5,9" />
        <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 34.5,24.5 32,11.5 30,9 C 28,5 24,5 22.5,9 L 22.5,26" />
        <path d="M 22.5,26 C 22.5,26 19.5,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32" />
        <path d="M 15,32 C 13,29.5 15,14.5 15,14.5 C 15,14.5 13,11.5 15,9 C 17,5 21,5 22.5,9" />
        <path d="M 22.5,15.5 A 1,1 0 1,1 22.5,13.5 A 1,1 0 1,1 22.5,15.5 z" />
        <path d="M 20,8 L 25,8" style={{ fill: "none", stroke: "black", strokeLinejoin: "miter" }} />
      </g>
    </svg>
  );
}

export function WhiteKnight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...pieceStyles} {...props}>
      <g fill="white">
        <path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z" />
        <path d="M 14,36 L 14,33 L 31,33 L 31,36 L 14,36 z" />
        <path d="M 11.5,33 L 11.5,30 L 33.5,30 L 33.5,33 L 11.5,33 z" />
        <path d="M 12,30 L 12,15.5 C 12,15.5 6.5,12 6,20 C 6,20 8,23 12,23" />
        <path d="M 24.5,10 C 24.5,10 22,12 22,14 C 22,14 22,15.5 24,15.5 C 24,15.5 28.5,15.5 28.5,12 C 28.5,12 28.5,10 24.5,10" />
        <path d="M 31,12.5 C 31,12.5 24,11.5 24,18 C 24,18 24,27.5 31.5,27.5" />
        <path d="M 31.5,27.5 C 31.5,27.5 33.5,27.5 33.5,26 C 33.5,26 33.5,15 31,12.5" />
      </g>
    </svg>
  );
}

export function WhitePawn(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...pieceStyles} {...props}>
      <g fill="white">
        <path d="M 22.5,9 C 19.5,9 19.5,12 22.5,12 C 25.5,12 25.5,9 22.5,9" />
        <path d="M 22.5,12 C 22.5,12 22.5,15 22.5,15 C 22.5,15 16.5,15 16.5,21 C 16.5,27 28.5,27 28.5,21 C 28.5,15 22.5,15 22.5,15" />
        <path d="M 16.5,21 C 16.5,21 16.5,23 16.5,23 C 16.5,23 28.5,23 28.5,23 C 28.5,23 28.5,21 28.5,21" />
        <path d="M 14,27 C 14,27 14,29 14,29 C 14,29 31,29 31,29 C 31,29 31,27 31,27" />
        <path d="M 11.5,32 C 11.5,32 11.5,34.5 11.5,34.5 C 11.5,34.5 33.5,34.5 33.5,34.5 C 33.5,34.5 33.5,32 33.5,32" />
        <path d="M 9,37 L 36,37 L 36,39 L 9,39 L 9,37 z" />
      </g>
    </svg>
  );
}

export function BlackKing(props: SVGProps<SVGSVGElement>) {
  return <WhiteKing fill="black" stroke="white" {...props} />;
}
export function BlackQueen(props: SVGProps<SVGSVGElement>) {
  return <WhiteQueen fill="black" stroke="white" {...props} />;
}
export function BlackRook(props: SVGProps<SVGSVGElement>) {
  return <WhiteRook fill="black" stroke="white" {...props} />;
}
export function BlackBishop(props: SVGProps<SVGSVGElement>) {
  return <WhiteBishop fill="black" stroke="white" {...props} />;
}
export function BlackKnight(props: SVGProps<SVGSVGElement>) {
  return <WhiteKnight fill="black" stroke="white" {...props} />;
}
export function BlackPawn(props: SVGProps<SVGSVGElement>) {
  return <WhitePawn fill="black" stroke="white" {...props} />;
}
