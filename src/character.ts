export class Character {
    static readonly MAX_HEALTH = 1000;
    #health = Character.MAX_HEALTH;
    #isAlive = true;

    isAlive(): boolean {
        return this.#isAlive;
    }

    dealDamage(other: Character, damage: number) {
       other.receiveDamage(damage);
    }

    receiveDamage(damage: number) {
        this.#health -= damage;
        if (this.#health < 0) {
            this.#health = 0;
            this.#isAlive = false;
        }
    }

    heal(other: Character, amount: number) {
        other.#health += amount;

        if (other.#health > Character.MAX_HEALTH) {
            other.#health = 1000;
        }
    }
}
