import { TURN_PER_TICK, randRange, log } from "./Simulation";
import { D, G } from "./Global";
import { Person } from "./Person";
import { showToast } from "../UI/UISystem";

export class World {
    private _tick: number = 0;
    public people: Person[] = [];
    public socialPlaces: SocialPlace[] = [];
    public homes: Place[] = [];
    public work: Place[] = [];
    public hospital: SocialPlace;
    public logs: string[] = [];
    public actionPoint: number = 1;
    public isPaused = false;
    public gameOver = false;
    public infectedData: number[] = [];
    public recoveredData: number[] = [];
    public inHospitalData: number[] = [];
    public timeData: string[] = [];
    // Policies
    public hospitalizeMild = false;
    public homeQuarantineMild = false;
    private _banGatheringof5 = false;
    public get banGatheringof5() {
        return this._banGatheringof5;
    }
    public set banGatheringof5(value) {
        this._banGatheringof5 = value;
        if (this._banGatheringof5) {
            this.socialPlaces.forEach((p) => {
                if (p.capacityOverride !== 0) {
                    p.capacityOverride = 5;
                }
            });
        } else {
            this.socialPlaces.forEach((p) => {
                if (p.capacityOverride !== 0) {
                    p.capacityOverride = null;
                }
            });
        }
    }
    public wearFacialMaskInPublic = false;
    private _workFromHome = false;
    public get workFromHome() {
        return this._workFromHome;
    }
    public set workFromHome(value) {
        this._workFromHome = value;
        if (this._workFromHome) {
            this.people.sample(0.5, (p) => (p.workFromHome = true));
        } else {
            this.people.forEach((p) => (p.workFromHome = false));
        }
    }
    // Actions
    public rampUpTesting() {
        this.people
            .filter((p) => p.infectedType === "incubated" || p.infectedType === "asymptomatic")
            .sample(0.5, (c) => {
                if (c.infectedType === "incubated") {
                    c.develop(this);
                } else if (c.infectedType === "asymptomatic") {
                    c.infectedType = "mild";
                    c.recoverDaysNeeded = Math.round(D.recoverDaysNeeded * randRange());
                }
            });
    }
    public medicineTrial() {
        this.people
            .filter((p) => p.currentPlace === this.hospital)
            .sample(0.5, (c) => (c.recoverDaysNeeded = Math.round(c.recoverDaysNeeded * 0.5)));
    }
    public pause() {
        this.isPaused = true;
    }
    public resume() {
        this.isPaused = false;
    }

    // Logic
    public init() {
        this.people.forEach((p) => {
            p.init(this);
        });
    }
    public tick() {
        if (this.isPaused) {
            return;
        }
        const oldDay = this.day;
        const oldTurn = this.turn;
        this._tick++;
        const newDay = this.day;
        const newTurn = this.turn;
        if (newDay > oldDay) {
            this.actionPoint++;
        }
        if (this._tick === 1 || newTurn > oldTurn) {
            this.infectedData.push(this.infected);
            this.inHospitalData.push(this.inHospital);
            this.recoveredData.push(this.recovered);
            this.timeData.push(this._tick === 1 || newDay > oldDay ? `D${newDay}` : "");
        }
        this.people.forEach((p) => {
            p.tick(this);
        });

        if (
            this.people.filter((p) => p.currentPlace === this.hospital).length > this.hospital.capacity &&
            !this.gameOver
        ) {
            if (confirm("Game over! Your hospital is overloaded. Do you want to continue to run the simulation?")) {
                this.gameOver = true;
            } else {
                window.location.reload();
            }
        }

        if (!this.gameOver && this.infected === 0) {
            alert("You won! Your citizens have survived the virus without overloading your hospital");
            window.location.reload();
        }
        m.redraw();
    }
    public tryUseActionPoint(point = 1) {
        if (this.actionPoint >= point) {
            this.actionPoint -= point;
            return true;
        }
        showToast(`You need ${point} action point(s) for this. You do not have enough action point(s)`);
        return false;
    }
    public get turn() {
        return Math.floor(this._tick / TURN_PER_TICK);
    }
    public get stage() {
        const stage = this.turn % 3;
        switch (stage) {
            case 0:
                return "1:00 am";
            case 1:
                return "9:00 am";
            case 2:
                return "5:00 pm";
        }
    }
    public get day() {
        return Math.floor(this.turn / 3) + 1;
    }
    public get inHospital() {
        return this.people.filter((p) => p.currentPlace === this.hospital).length;
    }
    public get infected() {
        return this.people.filter((p) => p.infectedType !== "healthy" && p.infectedType !== "recovered").length;
    }
    public get recovered() {
        return this.people.filter((p) => p.infectedType === "recovered").length;
    }
}

export const POLICIES = [
    {
        name: "People with mild symptoms should be home quarantined",
        isActive: (w: World) => w.homeQuarantineMild,
        toggle: (w: World) => {
            if (w.tryUseActionPoint()) {
                log(`Policy activated: ${POLICIES[0].name}, this will deactivate "${POLICIES[1].name}" policy`);
                w.homeQuarantineMild = !w.homeQuarantineMild;
                w.hospitalizeMild = false;
            }
        },
    },
    {
        name: "People with mild symptoms should be hospitalized",
        isActive: (w: World) => w.hospitalizeMild,
        toggle: (w: World) => {
            if (w.tryUseActionPoint()) {
                log(`Policy activated: ${POLICIES[1].name},  this will deactivate "${POLICIES[0].name}" policy`);
                w.hospitalizeMild = !w.hospitalizeMild;
                w.homeQuarantineMild = false;
            }
        },
    },
    {
        name: "Ban gathering of more than 5 people (does not apply to workplaces or home)",
        isActive: (w: World) => w.banGatheringof5,
        toggle: (w: World) => {
            if (w.tryUseActionPoint()) {
                log(`Policy activated: ${POLICIES[2].name}`);
                w.banGatheringof5 = !w.banGatheringof5;
            }
        },
    },
    {
        name: "Recommend wearing facial mask in public places (decrease infection rate by 50%)",
        isActive: (w: World) => w.wearFacialMaskInPublic,
        toggle: (w: World) => {
            if (w.tryUseActionPoint()) {
                log(`Policy activated: ${POLICIES[2].name}`);
                w.wearFacialMaskInPublic = !w.wearFacialMaskInPublic;
            }
        },
    },
    {
        name: "Recommend people to work from home (50% of people will work from home)",
        isActive: (w: World) => w.workFromHome,
        toggle: (w: World) => {
            if (w.tryUseActionPoint()) {
                log(`Policy activated: ${POLICIES[2].name}`);
                w.workFromHome = !w.workFromHome;
            }
        },
    },
];

export class Place {
    public node: cc.Node;
    public name: string;

    constructor(name: string, node: cc.Node) {
        this.name = name;
        this.node = node;
    }
}

export class SocialPlace extends Place {
    private _capacity: number;
    public capacityOverride: number = null;
    public get capacity(): number {
        if (this.capacityOverride !== null) {
            return this.capacityOverride;
        }
        return this._capacity;
    }
    public set capacity(value: number) {
        this._capacity = value;
    }
}

export type InfectionType = "recovered" | "serious" | "mild" | "asymptomatic" | "incubated" | "healthy";

export const COLOR_CODE = {
    healthy: "#ffffff",
    incubated: "#dddddd",
    asymptomatic: "#bbbbbb",
    mild: "#ffeaa7",
    serious: "#ff7675",
    recovered: "#55efc4",
};

export interface IXY {
    x: number;
    y: number;
}
