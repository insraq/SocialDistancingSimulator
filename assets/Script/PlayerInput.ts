const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerInput extends cc.Component {

    protected onLoad() {
        this.node.on(cc.Node.EventType.MOUSE_WHEEL, (e: cc.Event.EventMouse) => {
            cc.Camera.main.node.y += Math.sign(e.getScrollY()) * 50;
        });
    }
}
