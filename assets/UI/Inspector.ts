import { G } from "../Script/Global";
import { icon } from "./UIHelper";
import { SocialPlace, COLOR_CODE } from "../Script/World";
import { log } from "../Script/Simulation";

export function Inspector(): m.Component {
    return {
        view: () => {
            const w = G.sim.world;

            if (!G.sim.inspectTarget) {
                return null;
            }

            let capacity = null;
            let close = m("div");
            if ((G.sim.inspectTarget as SocialPlace).capacity !== undefined) {
                capacity = (G.sim.inspectTarget as SocialPlace).capacity;
                if (G.sim.inspectTarget !== w.hospital) {
                    const social = G.sim.inspectTarget as SocialPlace;
                    if (social.capacityOverride === 0) {
                        close = m(
                            "button",
                            {
                                onclick: () => {
                                    if (w.tryUseActionPoint()) {
                                        social.capacityOverride = w.banGatheringof5 ? 5 : null;
                                        log(`${social.name} is open now.`, true);
                                    }
                                },
                            },
                            "Closed, click to open"
                        );
                    } else {
                        close = m(
                            "button",
                            {
                                onclick: () => {
                                    if (w.tryUseActionPoint()) {
                                        social.capacityOverride = 0;
                                        log(`${social.name} is closed now.`, true);
                                    }
                                },
                            },
                            "Open, click to close"
                        );
                    }
                }
            }
            const people = w.people.filter((p) => p.currentPlace === G.sim.inspectTarget);
            return m("div.inspector", [
                m("div.panel", [
                    m("div.header", [
                        "Inspector",
                        m("div.close", { onclick: () => (G.sim.inspectTarget = null) }, icon("close")),
                    ]),
                    m("div.scrollable", [
                        m("div.row", [m("div", "Name"), m("div", G.sim.inspectTarget.name)]),
                        m("div.row", [m("div", "Capacity"), m("div", capacity === null ? "N/A" : capacity)]),
                        m("div.row", [
                            m("div", `People (${people.length})`),
                            m("div", [
                                people.length > 0
                                    ? people.map((p, i) =>
                                          m("div", { style: { color: COLOR_CODE[p.infectedType] } }, p.name)
                                      )
                                    : "None",
                            ]),
                        ]),
                    ]),
                ]),
            ]);
        },
    };
}
