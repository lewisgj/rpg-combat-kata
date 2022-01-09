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
    #health = Character.MAX_HEALTH;
    #isAlive = true;
    readonly #level: number;
    readonly #position: number = 0;
    readonly #attack: Attack;
    #factions: Set<string> = new Set<string>();

    constructor(attack: Attack = Attack.Melee, position: number = 0, level: number = 1) {
        this.#position = position;
        this.#level = level;
        this.#attack = attack;
    }

    isAlive(): boolean {
        return this.#isAlive;
    }

    isAlly(other: Character): boolean {
        const factionsInCommon = new Set([...this.#factions].filter(x => other.#factions.has(x)));
        return factionsInCommon.size > 0;
    }

    dealDamage(other: Character, damage: number) {
        if (other === this) {
            return;
        }

        if (this.isAlly(other)) {
            return;
        }

        const distance = Math.abs(this.#position - other.#position);
        if (distance > MAX_RANGES[this.#attack]) {
            return;
        }

        const damageModifier = calculateDamageModifier(this.#level, other.#level);
        other.receiveDamage(damage * damageModifier);
    }

    receiveDamage(damage: number) {
        this.#health -= damage;
        if (this.#health < 0) {
            this.#health = 0;
            this.#isAlive = false;
        }
    }

    heal(amount: number, target?: Character) {
        if (target && this.isAlly(target)) {
            target.receiveHealth(amount);
            return;
        }

        this.receiveHealth(amount)
    }

    receiveHealth(amount: number) {
        this.#health += amount;

        if (this.#health > Character.MAX_HEALTH) {
            this.#health = Character.MAX_HEALTH;
        }
    }

    joinFaction(faction: string) {
        this.#factions.add(faction);
    }
}

export enum Attack {
    Melee = 'MELEE',
    Ranged = 'RANGED'
}
