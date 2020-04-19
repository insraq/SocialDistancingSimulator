import { FIRST_NAMES, LAST_NAMES, SHORT_NAMES, COMPANY_NAME_POSTFIX, SOCIAL_NAME_POSTFIX, SHORT_ADJ } from "./Names";
import { D, G } from "./Global";
import { capitalize } from "../Shared/Helper";
import { World, Place, SocialPlace, IXY } from "./World";
import { Person } from "./Person";
import { showToast } from "../UI/UISystem";

const { ccclass, property } = cc._decorator;

export const TURN_PER_TICK = 5;

@ccclass
export default class Simulation extends cc.Component {
    @property(cc.Node) private people: cc.Node = null;
    @property(cc.Prefab) private personPrefab: cc.Prefab = null;

    @property(cc.Node) private places: cc.Node = null;
    @property(cc.Prefab) private placePrefab: cc.Prefab = null;

    public world: World;

    public inspectTarget: Place;

    public inspect(node: cc.Node) {
        if (this.world.hospital.node === node) {
            this.inspectTarget = this.world.hospital;
            m.redraw();
            return;
        }
        const work = this.world.work.find((p) => p.node === node);
        if (work) {
            this.inspectTarget = work;
            m.redraw();
            return;
        }
        const social = this.world.socialPlaces.find((p) => p.node === node);
        if (social) {
            this.inspectTarget = social;
            m.redraw();
            return;
        }
        const home = this.world.homes.find((p) => p.node === node);
        if (home) {
            this.inspectTarget = home;
            m.redraw();
            return;
        }
    }

    protected onLoad() {
        G.sim = this;
        this.setup();
    }

    private setup() {
        this.world = new World();

        const node = cc.instantiate(this.placePrefab);
        node.getComponentInChildren(cc.Label).string = "🏥 Hospital";
        node.parent = this.places;
        this.world.hospital = new SocialPlace("Hospital", node);

        for (let i = 0; i < D.workplaceCount; i++) {
            const node = cc.instantiate(this.placePrefab);
            const companyName = capitalize(SHORT_NAMES.randOne() + " " + COMPANY_NAME_POSTFIX.randOne());
            node.getComponentInChildren(cc.Label).string = "🏭" + companyName;
            node.parent = this.places;

            this.world.work.push(new Place(companyName, node));
        }

        for (let i = 0; i < D.socialPlaceCount; i++) {
            const node = cc.instantiate(this.placePrefab);
            const companyName = capitalize(SHORT_ADJ.randOne() + " " + SOCIAL_NAME_POSTFIX.randOne());
            node.getComponentInChildren(cc.Label).string = "🎠" + companyName;
            node.parent = this.places;

            const socialPlace = new SocialPlace(companyName, node);
            let capacity = (D.socialPlaceCapacity * D.familyCount * D.familySize) / D.socialPlaceCount;
            capacity = Math.round(capacity * randRange());
            socialPlace.capacity = capacity;
            this.world.socialPlaces.push(socialPlace);
        }

        for (let i = 0; i < D.familyCount; i++) {
            const familyName = LAST_NAMES.randOne();

            const node = cc.instantiate(this.placePrefab);
            node.getComponentInChildren(cc.Label).string = "🏡" + familyName;
            node.parent = this.places;

            const home = new Place(familyName, node);
            this.world.homes.push(home);

            let familySize = D.familySize;
            familySize = Math.round(familySize * randRange());
            for (let j = 0; j < familySize; j++) {
                this.world.people.push(
                    new Person(
                        FIRST_NAMES.randOne() + " " + familyName,
                        this.createPersonNode(),
                        home,
                        this.world.work.randOne()
                    )
                );
            }
        }

        this.world.hospital.capacity = Math.round(this.world.people.length * D.hospitalCapacity);

        this.world.people.shuffle();

        for (let i = 0; i < D.initialInfected; i++) {
            this.world.people[i].infectBy(null, this.world.day);
        }

        // Do this in next frame as Layout takes this frame to resize correctly
        this.scheduleOnce(() => {
            this.world.init();
            this.schedule(this.world.tick.bind(this.world), 1);
        }, 0);
    }

    private createPersonNode() {
        const node = cc.instantiate(this.personPrefab);
        node.parent = this.people;
        return node;
    }
}

export function randPos<T extends IXY>(pos: T) {
    pos.x += cc.randf(-60, 60);
    pos.y += cc.randf(-40, 60);
    return pos;
}

export function randRange() {
    return cc.randf(0.5, 1.5);
}

export function log(str: string, toast = false) {
    G.sim.world.logs.push(str);
    if (toast) {
        showToast(str);
    }
    console.log(str);
}
