export class Character {
    static readonly MAX_HEALTH = 1000;
    #health = Character.MAX_HEALTH;
    #isAlive = true;

    isAlive(): boolean {
        return this.#isAlive;
    }

    dealDamage(other: Character, damage: number) {
        if (other === this) {
            return;
        }

        other.receiveDamage(damage);
    }

    receiveDamage(damage: number) {
        this.#health -= damage;
        if (this.#health < 0) {
            this.#health = 0;
            this.#isAlive = false;
        }
    }

    receiveHealth(amount: number) {
        this.#health += amount;

        if (this.#health > Character.MAX_HEALTH) {
            this.#health = Character.MAX_HEALTH;
        }
    }

    heal(other: Character, amount: number) {
        if (other === this) {
            return;
        }

        other.receiveHealth(amount);
    }
}
