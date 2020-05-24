import { G } from "../Script/Global";
import { EventViewer, Chart } from "./EventViewer";
import { icon } from "./UIHelper";
import { BottomBar } from "./BottomBar";
import { Inspector } from "./Inspector";

export function Hud(): m.Component {
    return {
        view: () => {
            const w = G.sim.world;
            return m("div", [
                m("div.top", [
                    m("div", [
                        m("div.stat", [m("div", "Day"), m("div", w.day)]),
                        m("div.stat", [m("div", "Time"), m("div", w.stage)]),
                        m("div.stat", [m("div", "Action Pts"), m("div", w.actionPoint)]),
                        m("div.stat", [m("div", "Infected"), m("div", `${w.infected}/${w.people.length}`)]),
                        m("div.stat", [m("div", "In Hospital"), m("div", `${w.inHospital}/${w.hospital.capacity}`)]),
                    ]),
                    m("div", [
                        m(
                            "div.top-icon",
                            {
                                onclick: () => (w.isPaused ? w.resume() : w.pause()),
                                title: "Pause (Hotkey: Space)",
                                class: w.isPaused ? "" : "inactive",
                            },
                            icon("pause")
                        ),
                        m(
                            "div.top-icon",
                            {
                                onclick: () => (w.isPaused ? w.resume() : w.pause()),
                                title: "Resume (Hotkey: Space)",
                                class: w.isPaused ? "inactive" : "",
                            },
                            icon("play_arrow")
                        ),
                    ]),
                ]),
                m(EventViewer),
                m.route.get() === "/stat" ? null : m(Chart),
                m(BottomBar),
                m(Inspector),
            ]);
        },
    };
}

// m("div.bottom", [
//     m("div.scrollable", [
//         m("h2", "Policies"),
//         m(
//             "div",
//             POLICIES.map((policy) =>
//                 m(
//                     "div.policy",
//                     {
//                         class: policy.isActive(w) ? "green" : "",
//                         title: policy.isActive(w)
//                             ? "This policy is active, click the deactivate"
//                             : "Activate this policy",
//                         onclick: policy.toggle.bind(null, w),
//                     },
//                     policy.name
//                 )
//             )
//         ),
//         m("div.sep"),
//         m("h2", "Actions"),
//         m(
//             "div.policy",
//             {
//                 onclick: () => {
//                     if (w.tryUseActionPoint()) {
//                         w.rampUpTesting();
//                         log("Action taken: Ramp up virus testing effort", true);
//                     }
//                 },
//             },
//             "Ramp up virus testing effort (50% of people in incubation period or asymptomatic will be detected)"
//         ),
//         m(
//             "div.policy",
//             {
//                 onclick: () => {
//                     if (w.tryUseActionPoint()) {
//                         w.medicineTrial();
//                         log("Action taken: Start trial of experimental medicine", true);
//                     }
//                 },
//             },
//             "Start trial of experimental medicine (50% of hospitalized patients will speed up recovery by 50%)"
//         ),
//     ]),
//     m("div", [
//         m("h2", "Color Code"),
//         m("div", [
//             m("span", { style: { color: COLOR_CODE.healthy } }, "Healthy "),
//             m("span", { style: { color: COLOR_CODE.incubated } }, "Incubated "),
//             m("span", { style: { color: COLOR_CODE.asymptomatic } }, "Asymptomatic "),
//             m("span", { style: { color: COLOR_CODE.mild } }, "Mild "),
//             m("span", { style: { color: COLOR_CODE.serious } }, "Serious "),
//             m("span", { style: { color: COLOR_CODE.recovered } }, "Recovered "),
//         ]),
//         m("div.sep"),
//         m("div.scrollable", inspector),
//     ]),
//     m("div", [
//         m("div.row", [
//             m("h2", { style: { flex: 1 } }, "Event Log"),
//             m("input[type=checkbox]", {
//                 style: { marginRight: "5px" },
//                 onclick: () => (D.scrollLogs = !D.scrollLogs),
//                 checked: D.scrollLogs,
//             }),
//             "Auto Scroll",
//         ]),
//         m(
//             "div#log-container.scrollable",
//             w.logs.map((l) => m(".log-item", `- ${l}`))
//         ),
//     ]),
// ]),
