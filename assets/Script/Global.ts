import ResourceLoader from "../UI/ResourceLoader";
import Simulation from "./Simulation";
import { getUrlParams } from "../Shared/Helper";

export const G: { res: ResourceLoader; sim: Simulation } = {
    res: null,
    sim: null,
};

export const D = {
    // Config
    familyCount: 50,
    familySize: 6,
    workplaceCount: 6,
    socialPlaceCount: 7,
    socialPlaceCapacity: 0.5,
    hospitalCapacity: 0.05,
    initialInfected: 1,
    incubationDay: 3,
    asymptomaticPencentage: 0.5,
    seriousPencentage: 0.15,
    infectedChance: 0.1,
    recoverDaysNeeded: 5,
    seriousRecoverDaysMultiplier: 2,
    // Settings
    scrollLogs: true,
};
const params = getUrlParams();

for (const key in params) {
    if (params.hasOwnProperty(key) && D.hasOwnProperty(key)) {
        console.log(`Game parameter overriden: ${key} = ${params[key]} (from ${D[key]})`);
        D[key] = parseFloat(params[key]);
    }
}
