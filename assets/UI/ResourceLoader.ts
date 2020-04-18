import { G } from "../Script/Global";
import { StartUI } from "./UISystem";

const { ccclass, property } = cc._decorator;

let uiStarted = false;

@ccclass
export default class ResourceLoader extends cc.Component {

    @property({ type: [cc.Asset] }) private styles: cc.Asset[] = [];

    protected onLoad() {
        cc.game.addPersistRootNode(this.node);
        if (G.res !== null) {
            cc.warn("Multiple AudioController found!");
        }
        G.res = this;

        const s = document.createElement("style");
        s.innerHTML = this.styles.join("\n\n");
        document.head.appendChild(s);
    }

    protected start() {
        if (!uiStarted) {
            StartUI();
            uiStarted = true;
        }
    }

}
