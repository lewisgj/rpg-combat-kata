import {Character} from "./character";

const DEADLY_DAMAGE = Character.MAX_HEALTH+1;
const NON_LETHAL_DAMAGE = 500;
describe("Characters", () =>{
    it('should start alive', () => {
        const character = new Character();

        expect(character.isAlive()).toBeTruthy();
    });

    it('should die if damage exceeds current health', () => {
        const character1 = new Character();
        const character2 = new Character();

        character1.dealDamage(character2, DEADLY_DAMAGE);
        expect(character2.isAlive()).toBeFalsy();
    });

    it.each([NON_LETHAL_DAMAGE, Character.MAX_HEALTH])('should remain alive if receiving damage less than current health: %d', (damage) => {
        const character1 = new Character();
        const character2 = new Character();

        character1.dealDamage(character2, damage);
        expect(character2.isAlive()).toBeTruthy();
    });

    it('should not damage self', () => {
        const character1 = new Character();

        character1.dealDamage(character1, DEADLY_DAMAGE);

        expect(character1.isAlive()).toBeTruthy();
    });

    describe('Healing', () => {
        it('should recover health if healed', () => {
            const character1 = new Character();
            const character2 = new Character();

            character1.dealDamage(character2, Character.MAX_HEALTH);
            character1.heal(character2, 1);
            character1.dealDamage(character2, 1);

            // Normally MAX_HEALTH+1 damage kills characters as per another test...
            // but we've recovered 1 health so they're still alive.
            expect(character2.isAlive()).toBeTruthy();
        });

        // This isn't strictly what the kata says, but health is an implementation detail
        it('should remain dead', () => {
            const character1 = new Character();
            const character2 = new Character();

            character1.dealDamage(character2, DEADLY_DAMAGE);
            character1.heal(character2, NON_LETHAL_DAMAGE);

            expect(character2.isAlive()).toBeFalsy()
        })

        it('should not heal beyond max health', () => {
            const character1 = new Character();
            const character2 = new Character();

            character1.heal(character2, NON_LETHAL_DAMAGE);
            character1.dealDamage(character2, DEADLY_DAMAGE);

            expect(character2.isAlive()).toBeFalsy()
        });
    });
})
