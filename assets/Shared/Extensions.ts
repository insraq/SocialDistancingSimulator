declare namespace cc {
    interface Node {
        // tslint:disable-line
        angleTo(worldPoint: cc.Vec2): number;
        getWorldPosition(): cc.Vec2;
        relativeFrom(node: cc.Node): cc.Vec2;
        setWorldPosition(worldPosition: cc.Vec2): void;
        follow(node: cc.Node): void;
        getAttr<T>(key: string): T;
    }
    interface Graphics {
        // tslint:disable-line
        dashedLine(startPos: cc.Vec2, endPos: cc.Vec2, lineLength?: number, spaceLength?: number): void;
    }
    interface Vec2 {
        //tslint:disable-line
        clampDistance(min: number, max: number): Vec2;
    }
    export function normalizeAngle(angle: number): number;
    export function assert(cond: boolean, msg?: string): void;
    export function hasScene(sceneName: string): boolean;
    export function randi(minInclusive: number, maxInclusive: number): number;
    export function randf(minInclusive: number, maxInclusive: number): number;
    export function takeScreenshot(): Promise<string>;
    export function spriteFrameFromBase64(base64: string): Promise<SpriteFrame>;
    export function goto(url: string): void;
    export function urlIs(url: string): boolean;
    export function vibrate(pattern: number | number[]): boolean;
}

interface Array<T> {
    // tslint:disable-line
    randOne(): T;
    shuffle(): T[];
    sample(percentage: number, callback: (item: T, index: number, array: T[]) => void): void;
    uniq(): T[];
}

interface Number {
    // tslint:disable-line
    round(decimal): number;
}

Number.prototype.round = function round(this: number, decimal: number): number {
    const fac = Math.pow(10, decimal);
    return Math.round(this * fac) / fac;
};

Array.prototype.randOne = function <T>(this: T[]): T {
    return this[Math.floor(this.length * Math.random())];
};

Array.prototype.shuffle = function shuffle<T>(this: T[]): T[] {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
};

Array.prototype.sample = function sample<T>(
    this: T[],
    percentage: number,
    callback: (item: T, index: number, array: T[]) => void
) {
    this.shuffle();
    const count = Math.round(this.length * percentage);
    for (let i = 0; i < count; i++) {
        const c = this[i];
        callback(c, i, this);
    }
};

Array.prototype.uniq = function shuffle<T>(this: T[]): T[] {
    return this.filter((v, i, a) => a.indexOf(v) === i);
};

cc.Node.prototype.getWorldPosition = function (this: cc.Node) {
    const pos = cc.v2();
    this.parent.convertToWorldSpaceAR(this.position, pos);
    return pos;
};

cc.Node.prototype.setWorldPosition = function (this: cc.Node, worldPosition: cc.Vec2) {
    const pos = cc.v2();
    this.parent.convertToNodeSpaceAR(worldPosition, pos);
    this.position = pos;
};

cc.Node.prototype.relativeFrom = function (this: cc.Node, target: cc.Node) {
    const pos = cc.v2();
    this.parent.convertToNodeSpaceAR(target.getWorldPosition(), pos);
    return pos;
};

cc.Node.prototype.follow = function (this: cc.Node, target: cc.Node) {
    this.position = this.relativeFrom(target);
};

cc.Node.prototype.angleTo = function (this: cc.Node, worldPoint: cc.Vec2): number {
    const target = worldPoint.sub(this.getWorldPosition());
    const angel = Math.atan2(target.x, target.y);
    return (-angel * 180) / Math.PI;
};

cc.Node.prototype.getAttr = function <T>(this: cc.Node, key) {
    return this[key] as T;
};

cc.Vec2.prototype.clampDistance = function (this: cc.Vec2, min: number, max: number) {
    const length = this.mag();
    if (length < min) {
        return this.normalize().mul(min);
    }
    if (length > max) {
        return this.normalize().mul(max);
    }
    return this;
};

cc.spriteFrameFromBase64 = (base64) => {
    return new Promise<cc.SpriteFrame>((resolve, reject) => {
        const img = new Image();
        img.src = base64;
        img.onload = () => {
            const texture = new cc.Texture2D();
            texture.initWithElement(img);
            texture.handleLoadedTexture();
            const newframe = new cc.SpriteFrame(texture);
            resolve(newframe);
        };
    });
};

cc.takeScreenshot = () => {
    return new Promise<string>((resolve, reject) => {
        cc.director.on(cc.Director.EVENT_AFTER_DRAW, () => {
            const base64 = cc.game.canvas.toDataURL();
            cc.director.off(cc.Director.EVENT_AFTER_DRAW);
            resolve(base64);
        });
    });
};

cc.normalizeAngle = (angle) => {
    while (angle < -180) {
        angle += 360;
    }
    while (angle > 180) {
        angle -= 360;
    }
    return angle;
};

cc.randi = (min, max) => {
    return Math.round(cc.randf(min, max));
};

cc.randf = (min, max) => {
    return min + (max - min) * Math.random();
};

cc.goto = (url) => {
    window.location.hash = "!" + url;
};

cc.urlIs = (url) => {
    return window.location.hash === "!" + url;
};

cc.hasScene = (name) => {
    const scenes = cc.game.config.scenes;
    for (const s of scenes) {
        if (s.url.endsWith(name + ".fire")) {
            return true;
        }
    }
    return false;
};

cc.vibrate = (pattern) => {
    if (navigator.vibrate) {
        return navigator.vibrate(pattern);
    }
    return false;
};

if (cc.Graphics) {
    cc.Graphics.prototype.dashedLine = function (
        this: cc.Graphics,
        startPos,
        endPos,
        lineLength = 10,
        spaceLength = 20
    ) {
        let cursor = startPos;
        let count = 0;
        const direction = endPos.sub(startPos);
        if (direction.mag() < 10) {
            return;
        }
        const increment = direction.normalize();
        while ((endPos.x - cursor.x) * increment.x >= 0 && (endPos.y - cursor.y) * increment.y >= 0) {
            if (count % 2 === 0) {
                this.moveTo(cursor.x, cursor.y);
                cursor = cursor.add(increment.mul(lineLength));
            } else {
                this.lineTo(cursor.x, cursor.y);
                cursor = cursor.add(increment.mul(spaceLength));
            }
            count++;
        }
    };
}
