import {Prop} from "./prop";

function calculateDamageModifier(attackerLevel: number, targetLevel: number): number {
    const levelAdvantage = attackerLevel - targetLevel;
    if (levelAdvantage <= -5) {
        return 0.5;
    } else if (levelAdvantage >= 5) {
        return 1.5;
    }

    return 1;
}

const MAX_RANGES: Record<Attack, number> = {
    'MELEE': 2,
    'RANGED': 20
}

export class Character {
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

    isAlly(other: Character): boolean {
        const factionsInCommon = [...this.#factions].filter(x => other.#factions.has(x));
        return factionsInCommon.length > 0;
    }

    dealDamage(target: Character | Prop, damage: number) {
        if (target === this) {
            return;
        }

        const distance = Math.abs(this.position - target.position);
        if (distance > MAX_RANGES[this.#attack]) {
            return;
        }

        if (target instanceof Prop) {
            target.receiveDamage(damage);
            return;
        }

        if (this.isAlly(target)) {
            return;
        }

        const damageModifier = calculateDamageModifier(this.#level, target.#level);
        target.#receiveDamage(damage * damageModifier);
    }

    #receiveDamage(damage: number) {
        this.#health -= damage;
        if (this.#health < 0) {
            this.#health = 0;
            this.#isAlive = false;
        }
    }

    heal(amount: number, target?: Character) {
        if (target && this.isAlly(target)) {
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
}

export enum Attack {
    Melee = 'MELEE',
    Ranged = 'RANGED'
}
