import { G } from "./Global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Place extends cc.Component {
    protected onLoad() {
        this.node.on(cc.Node.EventType.MOUSE_ENTER, () => {
            cc.game.canvas.style.cursor = "pointer";
        });
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, () => {
            cc.game.canvas.style.cursor = "default";
        });
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            G.sim.inspect(this.node);
        });
        this.node.on(cc.Node.EventType.MOUSE_WHEEL, (e: cc.Event.EventMouse) => {
            cc.Camera.main.node.y += Math.sign(e.getScrollY()) * 50;
        });
    }
}
