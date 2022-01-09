import {DamageModifiers, Targetable} from "./targetable";

const MAX_RANGES: Record<Attack, number> = {
    'MELEE': 2,
    'RANGED': 20
}

export class Character implements Targetable {
    static readonly MAX_HEALTH = 1000;
    readonly #level: number;
    readonly #position: number = 0;
    readonly #attack: Attack;
    #health = Character.MAX_HEALTH;
    #isAlive = true;
    #factions: Set<string> = new Set<string>();

    constructor(attack: Attack = Attack.Melee, position: number = 0, level: number = 1) {
        this.#position = position;
        this.#level = level;
        this.#attack = attack;
    }

    get position(): number {
        return this.#position;
    }

    isAlive(): boolean {
        return this.#isAlive;
    }

    dealDamage(target: Targetable, damage: number) {
        if (target === this) {
            return;
        }

        const distance = Math.abs(this.position - target.position);
        if (distance > MAX_RANGES[this.#attack]) {
            return;
        }

        if (this.#isAlly(target)) {
            return;
        }

        target.receiveDamage(damage, {attackerLevel: this.#level});
    }

    #isAlly(other: Targetable): boolean {
        const factionsInCommon = [...this.#factions].filter(x => other.belongsToFaction(x));
        return factionsInCommon.length > 0;
    }

    receiveDamage(baseDamage: number, modifiers: DamageModifiers) {
        const damage = this.#calculateDamage(baseDamage, modifiers);

        this.#health -= damage;
        if (this.#health < 0) {
            this.#health = 0;
            this.#isAlive = false;
        }
    }

    #calculateDamage(damage: number, {attackerLevel}: DamageModifiers) {
        const levelAdvantage = attackerLevel - this.#level;
        if (levelAdvantage <= -5) {
            return 0.5 * damage;
        } else if (levelAdvantage >= 5) {
            return 1.5 * damage;
        }

        return damage;
    }

    heal(amount: number, target?: Character) {
        if (target && this.#isAlly(target)) {
            target.#receiveHealth(amount);
            return;
        }

        this.#receiveHealth(amount)
    }

    #receiveHealth(amount: number) {
        this.#health += amount;

        if (this.#health > Character.MAX_HEALTH) {
            this.#health = Character.MAX_HEALTH;
        }
    }

    joinFaction(faction: string) {
        this.#factions.add(faction);
    }

    leaveFaction(faction: string) {
        this.#factions.delete(faction);
    }

    belongsToFaction(faction: string) {
        return this.#factions.has(faction);
    }
}

export enum Attack {
    Melee = 'MELEE',
    Ranged = 'RANGED'
}
