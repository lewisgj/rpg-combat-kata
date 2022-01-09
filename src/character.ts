function calculateDamageModifier(attackerLevel: number, targetLevel: number): number {
    const levelAdvantage = attackerLevel - targetLevel;
    if (levelAdvantage <= -5) {
        return 0.5;
    }
    else if (levelAdvantage >= 5) {
        return 1.5;
    }

    return 1;
}

export class Character {
    static readonly MAX_HEALTH = 1000;
    #health = Character.MAX_HEALTH;
    #isAlive = true;
    #level: number;

    constructor(level: number = 1) {
        this.#level = level;
    }

    isAlive(): boolean {
        return this.#isAlive;
    }

    dealDamage(other: Character, damage: number) {
        if (other === this) {
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
