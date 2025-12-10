import { collection, getDocs, limit, query, where } from "firebase/firestore";

import { db } from "@/lib/firebase";

const INVITE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const INVITE_LENGTH = 8;

function generateCandidateCode() {
  return Array.from({ length: INVITE_LENGTH }, () =>
    INVITE_ALPHABET.charAt(Math.floor(Math.random() * INVITE_ALPHABET.length))
  ).join("");
}

export function normalizeInviteCode(code: string) {
  return code.trim().toUpperCase();
}

async function codeExists(code: string) {
  const snapshot = await getDocs(
    query(collection(db, "games"), where("inviteCode", "==", code), limit(1))
  );
  return !snapshot.empty;
}

export async function createUniqueInviteCode() {
  let attempts = 0;
  while (attempts < 5) {
    const candidate = generateCandidateCode();
    if (!(await codeExists(candidate))) {
      return candidate;
    }
    attempts += 1;
  }
  throw new Error("Unable to generate an invite code right now.");
}
