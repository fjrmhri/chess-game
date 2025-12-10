import { NextResponse } from "next/server";
import { collection, doc, getDoc, getDocs, limit, query, where } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { normalizeInviteCode } from "@/lib/invite";

export async function POST(request: Request) {
  try {
    const { inviteCode } = await request.json();
    if (typeof inviteCode !== "string" || !inviteCode.trim()) {
      return NextResponse.json({ error: "Invalid invite code." }, { status: 400 });
    }

    const normalizedCode = normalizeInviteCode(inviteCode);
    const fallbackId = inviteCode.trim();
    const gameQuery = query(
      collection(db, "games"),
      where("inviteCode", "==", normalizedCode),
      limit(1)
    );
    const snapshot = await getDocs(gameQuery);

    if (!snapshot.empty) {
      return NextResponse.json({ gameId: snapshot.docs[0].id });
    }

    const directDoc = await getDoc(doc(db, "games", fallbackId));

    if (directDoc.exists()) {
      return NextResponse.json({ gameId: directDoc.id });
    }

    return NextResponse.json({ error: "Game not found." }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to join game right now." },
      { status: 500 }
    );
  }
}
