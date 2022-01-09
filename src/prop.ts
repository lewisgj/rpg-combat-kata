import {Targetable} from "./targetable";

export class Prop implements Targetable {
    readonly #position: number;
    #health: number;
    #isAlive: boolean = false;

    constructor(health: number, position: number) {
        this.#health = health;
        this.#position = position;
    }

    get position(): number {
        return this.#position;
    }

    isDestroyed(): boolean {
        return !this.#isAlive;
    }

    receiveDamage(damage: number) {
        this.#health -= damage;
        if (this.#health < 0) {
            this.#health = 0;
            this.#isAlive = false;
        }
    }

    belongsToFaction(faction: string) {
        return false;
    }
}
