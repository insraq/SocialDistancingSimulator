import { G } from "../Script/Global";
import { Hud } from "./Hud";
import { Policy } from "./Policy";
import { Stat } from "./Stat";

const hudNode = document.createElement("div");
const modalNode = document.createElement("div");
const toastNode = document.createElement("div");

export let tabHeight = (cc.view.getFrameSize().height * 100) / cc.winSize.height;

document.body.appendChild(hudNode);
document.body.appendChild(modalNode);
document.body.appendChild(toastNode);

document.onkeydown = (e) => {
    if (e.keyCode === 32) {
        G.sim.world.isPaused ? G.sim.world.resume() : G.sim.world.pause();
        m.redraw();
    }
};

export function StartUI() {
    Chart.defaults.global.defaultFontColor = "rgba(255,255,255,1)";
    Chart.defaults.global.defaultFontFamily = "FontBold_LABEL";
    Chart.defaults.global.defaultFontSize = 14;
    m.mount(hudNode, Hud);
    m.route(modalNode, "/main", {
        "/main": { view: () => m("div") },
        "/policy": Policy,
        "/stat": Stat,
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
