import { G, D } from "../Script/Global";
import { icon } from "./UIHelper";
import { createChart, updateChart } from "./Stat";

export function EventViewer(): m.Component {
    let showPanel = true;
    return {
        view: () => {
            const w = G.sim.world;
            return m("div.event-log", [
                icon("message", 24, 5, { marginTop: "1px" }),
                m("div.f1.truncate.pointer", { onclick: () => (showPanel = !showPanel) }, w.logs[w.logs.length - 1]),
                showPanel
                    ? m("div.panel.log-panel", [
                          m("div.header", [
                              m(
                                  "div.fcc",
                                  {
                                      onclick: () => (D.scrollLogs = !D.scrollLogs),
                                  },
                                  [icon(D.scrollLogs ? "check_box" : "check_box_outline_blank", 16, 5), "Auto Scroll"]
                              ),
                              m("div.close", { onclick: () => (showPanel = false) }, icon("close")),
                          ]),
                          m(
                              "div.scrollable",
                              w.logs.map((l) => m("div.log-item", l))
                          ),
                      ])
                    : null,
            ]);
        },
        onupdate: (vnode) => {
            if (D.scrollLogs) {
                const logContainer = vnode.dom.querySelector(".scrollable");
                if (logContainer) {
                    logContainer.scrollTo(0, logContainer.scrollHeight);
                }
            }
        },
    };
}

export function Chart(): m.Component {
    let chart: Chart = null;
    return {
        oncreate: (vnode) => {
            chart = createChart(vnode.dom.querySelector(".chart-canvas"));
        },
        view: () => {
            return m("div.panel.chart-hud", [
                m("div.header", [
                    "Statistics",
                    m("div.close", { onclick: () => cc.goto("/stat") }, icon("open_in_new")),
                ]),
                m("canvas.chart-canvas", { width: 400, height: 270 }),
            ]);
        },
        onupdate: () => {
            updateChart(chart);
        },
    };
}
