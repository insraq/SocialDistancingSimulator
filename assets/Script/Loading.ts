const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends cc.Component {
    protected onLoad() {
        cc.debug.setDisplayStats(false);
    }

    public startGame() {
        cc.director.loadScene("Main");
    }
}
