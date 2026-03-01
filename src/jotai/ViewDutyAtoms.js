import { atom } from "jotai";

const isCopiedAtoms = atom(false);
const formattedTextAtoms = atom("");

export { isCopiedAtoms, formattedTextAtoms };
