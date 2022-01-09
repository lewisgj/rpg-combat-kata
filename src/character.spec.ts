import {Character} from "./character";

describe("Characters", () =>{
    it('should start alive', () => {
        const character = new Character();

        expect(character.isAlive()).toBeTruthy();
    });

    it('should die if damage exceeds current health', () => {
        const character1 = new Character();
        const character2 = new Character();

        character1.dealDamage(character2, Character.MAX_HEALTH+1);
        expect(character2.isAlive()).toBeFalsy();
    });

    it.each([500, Character.MAX_HEALTH])('should remain alive if receiving damage less than current health: %d', (damage) => {
        const character1 = new Character();
        const character2 = new Character();

        character1.dealDamage(character2, damage);
        expect(character2.isAlive()).toBeTruthy();
    });
})
