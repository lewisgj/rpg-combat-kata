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
    #level: number;
    #position: number = 0;
    #attack: Attack;

    constructor(attack: Attack = Attack.Melee, position: number = 0, level: number = 1) {
        this.#position = position;
        this.#level = level;
        this.#attack = attack
    }

    isAlive(): boolean {
        return this.#isAlive;
    }

    dealDamage(other: Character, damage: number) {
        if (other === this) {
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

    heal(amount: number) {
        this.#health += amount;

        if (this.#health > Character.MAX_HEALTH) {
            this.#health = Character.MAX_HEALTH;
        }
    }
}

export enum Attack {
    Melee = 'MELEE',
    Ranged = 'RANGED'
}
