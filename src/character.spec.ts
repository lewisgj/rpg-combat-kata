import {Character} from "./character";

describe("Characters", () =>{
    it('should start alive', () => {
        const character = new Character();

        expect(character.isAlive()).toBeTruthy();
    });

    it('should die if damage exceeds current health', () => {
        const character1 = new Character();
        const character2 = new Character();

        character1.dealDamage(character2, 1001);
        expect(character2.isAlive()).toBeFalsy();
    });

    it('should remain alive if receiving damage less than curreent health', () => {
        const character1 = new Character();
        const character2 = new Character();

        character1.dealDamage(character2, 500);
        expect(character2.isAlive()).toBeTruthy();
    });

})
