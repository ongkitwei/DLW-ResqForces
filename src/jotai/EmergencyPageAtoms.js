import { atom } from "jotai";

const triggerLiveLocationAtom = atom(false);
const geminiOutputAtom = atom("");
const capturedImageAtom = atom(null);

export { triggerLiveLocationAtom, geminiOutputAtom, capturedImageAtom };
