import { G } from "../Script/Global";
import { StartUI } from "./UISystem";

const { ccclass, property } = cc._decorator;

let uiStarted = false;

@ccclass
export default class ResourceLoader extends cc.Component {
    @property({ type: [cc.Asset] }) private styles: cc.Asset[] = [];

    @property({ type: cc.Asset }) public readonly policyImg: cc.Asset = null;
    @property({ type: cc.Asset }) public readonly inspectImg: cc.Asset = null;
    @property({ type: cc.Asset }) public readonly labImg: cc.Asset = null;
    @property({ type: cc.Asset }) public readonly statImg: cc.Asset = null;
    @property({ type: cc.Asset }) public readonly hospitalImg: cc.Asset = null;

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
