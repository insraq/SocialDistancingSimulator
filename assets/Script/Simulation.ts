const { ccclass, property } = cc._decorator;

@ccclass
export default class Simulation extends cc.Component {

    @property({ type: cc.Node }) private people: cc.Node = null;
    @property({ type: cc.Node }) private places: cc.Node = null;

    protected onLoad() {
        this.schedule(this.tick, 1);
    }

    private tick() {
        const person = this.people.children[0];
        const pos = person.relativeFrom(this.places.children[0])
        pos.x += cc.randf(-50, 50);
        pos.y += cc.randf(-50, 50);
        cc.tween(person)
            .to(1, { position: pos }, { easing: cc.easing.quadInOut })
            .start();
    }

}

class World {

}

class Place {
    public node: cc.Node;
    public name: string;
}

class SocialPlace extends Place {
    public capacity: number;
}

class Person {
    public name: string;
    public home: Place;
    public work: Place;
    public infectedType: "serious" | "mild" | "asymptomatic" | "healthy";
    public infectedSince: number;
    public recoverDaysNeeded: number;
}