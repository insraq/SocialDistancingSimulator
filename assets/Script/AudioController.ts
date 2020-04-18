import { D, G } from "./Global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioController extends cc.Component {

    public click: cc.AudioClip = null;
    public cheering: cc.AudioClip = null;
    public whistle: cc.AudioClip = null;
    public whoosh: cc.AudioClip = null;
    public freechest: cc.AudioClip = null;
    public gold: cc.AudioClip = null;
    public error: cc.AudioClip = null;
    public success: cc.AudioClip = null;

    public playEffect(sound: cc.AudioClip) {
        if (sound) {
            cc.audioEngine.playEffect(sound, false);
        }
    }

    protected onLoad() {
        cc.game.addPersistRootNode(this.node);
        if (G.audio !== null) {
            cc.warn("Multiple AudioController found!");
        }
        G.audio = this;
        cc.loader.loadResDir("sound", cc.AudioClip, (err, sounds: cc.AudioClip[]) => {
            if (err) {
                cc.error(err);
            }
            sounds.forEach((s) => {
                if (typeof this[s.name] !== "undefined") {
                    this[s.name] = s;
                } else {
                    cc.warn(`File: ${s.name} does not have a definition in AudioController`);
                }
            });
        });
    }
}
