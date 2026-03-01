import { atom } from "jotai";

const homePageStatsAtoms = atom([{}]);
const homePageLoadingAtoms = atom([true, true, true]);

export { homePageStatsAtoms, homePageLoadingAtoms };
