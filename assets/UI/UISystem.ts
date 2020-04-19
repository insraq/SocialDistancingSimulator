import { D, G } from "../Script/Global";
import { SocialPlace, COLOR_CODE, POLICIES } from "../Script/World";
import { log } from "../Script/Simulation";

const modalNode = document.createElement("div");
const toastNode = document.createElement("div");

export let tabHeight = (cc.view.getFrameSize().height * 100) / cc.winSize.height;

document.body.appendChild(modalNode);
document.body.appendChild(toastNode);

document.onkeydown = (e) => {
    if (e.keyCode === 32) {
        G.sim.world.isPaused ? G.sim.world.resume() : G.sim.world.pause();
        m.redraw();
    }
};

const hud: m.Component = {
    view: () => {
        const w = G.sim.world;

        let inspector: any = m("h2", "Click on a place to inspect");

        if (G.sim.inspectTarget) {
            let capacity = "";
            let close = m("div");
            if ((G.sim.inspectTarget as SocialPlace).capacity !== undefined) {
                capacity = `Max. Capacity: ${(G.sim.inspectTarget as SocialPlace).capacity}`;
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
            inspector = [
                m("div.row", [m("h2", { style: { flex: "1" } }, `${G.sim.inspectTarget.name}`), close]),
                m("div", capacity),
                m("h2", `People inside (${people.length})`),
                m(
                    "div",
                    people.length > 0
                        ? people.map((p, i) =>
                              m(
                                  "span",
                                  { style: { color: COLOR_CODE[p.infectedType] } },
                                  i === 0 ? p.name : `, ${p.name}`
                              )
                          )
                        : "None"
                ),
            ];
        }

        return m("div", [
            m("div.top", [
                m("div", `Day ${w.day}: ${w.stage} · Action Point: ${w.actionPoint}`),
                m(
                    "div",
                    m(
                        "div.pointer",
                        { onclick: () => (w.isPaused ? w.resume() : w.pause()), title: "Hotkey: Space bar" },
                        w.isPaused ? "Paused, click to resume" : "Running, click to pause"
                    )
                ),
                m(
                    "div",
                    `Infected: ${w.infected}/${w.people.length} · In Hospital: ${w.inHospital}/${w.hospital.capacity}`
                ),
            ]),
            m("div.bottom", [
                m("div.scrollable", [
                    m("h2", "Policies"),
                    m(
                        "div",
                        POLICIES.map((policy) =>
                            m(
                                "div.policy",
                                {
                                    class: policy.isActive(w) ? "green" : "",
                                    title: policy.isActive(w)
                                        ? "This policy is active, click the deactivate"
                                        : "Activate this policy",
                                    onclick: policy.toggle.bind(null, w),
                                },
                                policy.name
                            )
                        )
                    ),
                    m("div.sep"),
                    m("h2", "Actions"),
                    m(
                        "div.policy",
                        {
                            onclick: () => {
                                if (w.tryUseActionPoint()) {
                                    w.rampUpTesting();
                                    log("Action taken: Ramp up virus testing effort", true);
                                }
                            },
                        },
                        "Ramp up virus testing effort (50% of people in incubation period or asymptomatic will be detected)"
                    ),
                    m(
                        "div.policy",
                        {
                            onclick: () => {
                                if (w.tryUseActionPoint()) {
                                    w.medicineTrial();
                                    log("Action taken: Start trial of experimental medicine", true);
                                }
                            },
                        },
                        "Start trial of experimental medicine (50% of hospitalized patients will speed up recovery by 50%)"
                    ),
                ]),
                m("div", [
                    m("h2", "Color Code"),
                    m("div", [
                        m("span", { style: { color: COLOR_CODE.healthy } }, "Healthy "),
                        m("span", { style: { color: COLOR_CODE.incubated } }, "Incubated "),
                        m("span", { style: { color: COLOR_CODE.asymptomatic } }, "Asymptomatic "),
                        m("span", { style: { color: COLOR_CODE.mild } }, "Mild "),
                        m("span", { style: { color: COLOR_CODE.serious } }, "Serious "),
                        m("span", { style: { color: COLOR_CODE.recovered } }, "Recovered "),
                    ]),
                    m("div.sep"),
                    m("div.scrollable", inspector),
                ]),
                m("div", [
                    m("div.row", [
                        m("h2", { style: { flex: 1 } }, "Event Log"),
                        m("input[type=checkbox]", {
                            style: { marginRight: "5px" },
                            onclick: () => (D.scrollLogs = !D.scrollLogs),
                            checked: D.scrollLogs,
                        }),
                        "Auto Scroll",
                    ]),
                    m(
                        "div#log-container.scrollable",
                        w.logs.map((l) => m(".log-item", `- ${l}`))
                    ),
                ]),
            ]),
        ]);
    },
    onupdate: (vnode) => {
        if (D.scrollLogs) {
            const logContainer = document.querySelector("#log-container");
            if (logContainer) {
                logContainer.scrollTo(0, logContainer.scrollHeight);
            }
        }
    },
};

export function StartUI() {
    m.route(modalNode, "/main", {
        "/main": hud,
    });

    cc.goto("/main");
}

let toastTimeoutId: number = null;

export function showToast(text: string) {
    if (toastTimeoutId) {
        clearTimeout(toastTimeoutId);
        toastNode.innerHTML = "";
    }
    toastNode.innerHTML = `<div class="toast">${text}</div>`;
    toastTimeoutId = setTimeout(() => {
        toastNode.innerHTML = "";
        toastTimeoutId = null;
    }, 3500);
}
