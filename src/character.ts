export class Character {
    #health = 1000;
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
}
