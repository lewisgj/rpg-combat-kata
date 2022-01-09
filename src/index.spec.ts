export class Character {
    #health = 1000;
    #isAlive = true;

    isAlive(): boolean {
        return this.#isAlive;
    }

    dealDamage(other: Character, damage: number) {
        other.#health -= damage;
        if (other.#health < 0) {
            other.#health = 0;
            other.#isAlive = false;
        }
    }
}

describe("Characters", () =>{
    it('should start alive', () => {
        const character = new Character();

        expect(character.isAlive()).toBeTruthy();
    });

    it('should die after 1000 damage', () => {
        const character1 = new Character();
        const character2 = new Character();

        character1.dealDamage(character2, 1001);
        expect(character2.isAlive()).toBeFalsy();
    });

})
