import { randPos, randRange, log } from "./Simulation";
import { D } from "./Global";
import { Place, InfectionType, COLOR_CODE, World } from "./World";
export class Person {
    public name: string;
    public home: Place;
    public work: Place;
    public node: cc.Node;
    private _infectedType: InfectionType = "healthy";
    public get infectedType(): InfectionType {
        return this._infectedType;
    }
    public set infectedType(value: InfectionType) {
        this._infectedType = value;
        if (this.node) {
            this.node.color = cc.color().fromHEX(COLOR_CODE[this._infectedType]);
        }
    }
    public infectedSince: number = 0;
    public infectedFrom: Person;
    public incubationDays: number;
    public recoverDaysNeeded: number;
    public currentPlace: Place;
    public currentTurn: number = 0;
    public workFromHome = false;
    constructor(name: string, node: cc.Node, home: Place, work: Place) {
        this.node = node;
        this.name = name;
        this.home = home;
        this.work = work;
    }
    public init(world: World) {
        this.node.follow(this.home.node);
        this.node.position = randPos(this.node.position);
        this.currentPlace = this.home;
        this.tick(world);
    }
    public infectBy(other: Person, day: number) {
        this.infectedType = "incubated";
        this.infectedFrom = other;
        this.infectedSince = day;
        this.incubationDays = Math.round(D.incubationDay * randRange());
        if (other) {
            log(
                `${this.name} is infected by ${other.name} on Day ${this.infectedSince} at ${other.currentPlace.name}. Incubation days = ${this.incubationDays}`
            );
        } else {
            log(`${this.name} is patient 0. Incubation days = ${this.incubationDays}`);
        }
    }
    public develop(world: World) {
        if (Math.random() < D.asymptomaticPencentage) {
            this.infectedType = "asymptomatic";
            this.recoverDaysNeeded = Math.round(D.recoverDaysNeeded * randRange());
        } else if (Math.random() < D.seriousPencentage) {
            this.currentPlace = world.hospital;
            this.infectedType = "serious";
            this.recoverDaysNeeded = Math.round(D.seriousRecoverDaysMultiplier * D.recoverDaysNeeded * randRange());
        } else {
            if (world.hospitalizeMild) {
                this.currentPlace = world.hospital;
            } else if (world.homeQuarantineMild) {
                this.currentPlace = this.home;
            }
            this.infectedType = "mild";
            this.recoverDaysNeeded = Math.round(D.recoverDaysNeeded * randRange());
        }
        log(
            `${this.name}'s infection has developed into ${this.infectedType}. Recover days needed = ${this.recoverDaysNeeded}`
        );
    }
    public tick(world: World) {
        if (this.currentTurn < world.turn) {
            this.currentTurn = world.turn;
            if (this.currentPlace === world.hospital) {
                // Do nothing
            } else if (this.infectedType === "mild" && world.homeQuarantineMild) {
                if (this.currentPlace !== this.home) {
                    log(
                        `${this.name} has returned home from ${this.currentPlace.name} because of home quarantine policy`
                    );
                    this.currentPlace = this.home;
                }
            } else if (this.currentTurn % 3 === 0) {
                this.currentPlace = this.home;
            } else if (this.currentTurn % 3 === 1) {
                this.currentPlace = this.workFromHome ? this.home : this.work;
            } else if (this.currentTurn % 3 === 2) {
                const socialPlace = world.socialPlaces.randOne();
                if (world.people.filter((p) => p.currentPlace === socialPlace).length < socialPlace.capacity) {
                    this.currentPlace = socialPlace;
                } else {
                    this.currentPlace = this.home;
                }
            }
        } else {
            if (this.infectedType !== "healthy") {
                if (this.infectedType === "incubated" && world.day - this.infectedSince > this.incubationDays) {
                    this.develop(world);
                }
                if (
                    (this.infectedType === "mild" ||
                        this.infectedType === "serious" ||
                        this.infectedType === "asymptomatic") &&
                    world.day - this.infectedSince > this.incubationDays + this.recoverDaysNeeded
                ) {
                    log(`${this.name} has recovered from ${this.infectedType}.`);
                    this.infectedType = "recovered";
                    this.currentPlace = this.home;
                }
                let infectedChance = D.infectedChance;
                if (world.wearFacialMaskInPublic) {
                    infectedChance *= 0.5;
                }
                if (Math.random() < infectedChance) {
                    const candidates = world.people.filter(
                        (p) =>
                            p.infectedType === "healthy" &&
                            p !== this &&
                            p.currentPlace === this.currentPlace &&
                            p.infectedSince === 0
                    );
                    if (candidates.length > 0) {
                        candidates.randOne().infectBy(this, world.day);
                    }
                }
            }
        }
        const pos = this.node.relativeFrom(this.currentPlace.node);
        cc.tween(this.node)
            .to(1, { position: randPos(pos) }, { easing: cc.easing.quadInOut })
            .start();
    }
}
