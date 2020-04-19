import { D, G } from "./Global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends cc.Component {
    protected onLoad() {
        cc.game.canvas.onkeydown = document.onkeydown;
        cc.debug.setDisplayStats(false);
    }

    public startGame() {
        cc.director.loadScene("Main");
    }
}
