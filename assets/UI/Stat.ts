import { icon } from "./UIHelper";
import { G } from "../Script/Global";
import { World } from "../Script/World";

export function Stat(): m.Component {
    let chart: Chart = null;
    return {
        oncreate: (vnode) => {
            chart = createChart(vnode.dom.querySelector(".chart-canvas"));
        },
        view: () => {
            return m(
                "div.modal",
                m("div.panel", [
                    m("div.header", ["Statistics", m("div.close", { onclick: () => cc.goto("/main") }, icon("close"))]),
                    m("canvas.chart-canvas", { width: 800, height: 570 }),
                ])
            );
        },
        onupdate: () => {
            updateChart(chart);
        },
    };
}

export function updateChart(chart: Chart) {
    const w = G.sim.world;
    chart.data.labels = w.timeData;
    chart.data.datasets[0].data = w.infectedData;
    chart.data.datasets[1].data = w.inHospitalData;
    chart.data.datasets[2].data = w.recoveredData;
    chart.update();
}

export function createChart(node: HTMLCanvasElement) {
    const w = G.sim.world;
    return new Chart(node, {
        type: "line",
        data: {
            labels: w.timeData,
            datasets: [
                {
                    label: "Infected",
                    data: w.infectedData,
                    fill: false,
                    borderColor: "#ffeaa7",
                },
                {
                    label: "In Hospital",
                    data: w.inHospitalData,
                    fill: false,
                    borderColor: "#ff7675",
                },
                {
                    label: "Recovered",
                    data: w.recoveredData,
                    fill: false,
                    borderColor: "#55efc4",
                },
            ],
        },
        options: {
            scales: {
                xAxes: [
                    {
                        gridLines: {
                            color: "rgba(255,255,255,0.2)",
                            zeroLineColor: "rgba(255,255,255,0.2)",
                        },
                    },
                ],
                yAxes: [
                    {
                        gridLines: {
                            color: "rgba(255,255,255,0.2)",
                            zeroLineColor: "rgba(255,255,255,0.2)",
                        },
                    },
                ],
            },
        },
    });
}
