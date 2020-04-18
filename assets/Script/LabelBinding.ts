import { nf } from "../Shared/Helper";
import { D } from "./Global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LabelBinding extends cc.Component {

    @property() private property: string = "";
    @property() private prefix: string = "";
    @property() private postfix: string = "";
    @property private formatNumber: boolean = false;

    private label: cc.Label;
    private current: number;

    protected onLoad() {
        this.label = this.getComponent(cc.Label);
        if (!this.property) {
            cc.error("Please set `property` for LabelBinding");
        }
        this.current = D[this.property];
        this.updateLabel();
    }

    protected update() {
        if (this.current !== D[this.property]) {
            this.current = D[this.property];
            this.updateLabel();
        }
    }

    private updateLabel() {
        let content = this.current.toString();
        if (this.formatNumber) {
            content = nf(this.current);
        }
        this.label.string = this.prefix + content + this.postfix;
    }

}
