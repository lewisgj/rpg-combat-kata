import {Character} from "./character";

const DEADLY_DAMAGE = Character.MAX_HEALTH+1;
const NON_LETHAL_DAMAGE = 500;
describe("Characters", () =>{
    it('should start alive', () => {
        const character = new Character();

        expect(character.isAlive()).toBeTruthy();
    });

    it('should die if damage exceeds current health', () => {
        const other = new Character();
        const testSubject = new Character();

        other.dealDamage(testSubject, DEADLY_DAMAGE);
        expect(testSubject.isAlive()).toBeFalsy();
    });

    it.each([NON_LETHAL_DAMAGE, Character.MAX_HEALTH])('should remain alive if receiving damage less than current health: %d', (damage) => {
        const other = new Character();
        const testSubject = new Character();

        other.dealDamage(testSubject, damage);
        expect(testSubject.isAlive()).toBeTruthy();
    });

    it('should not damage self', () => {
        const testSubject = new Character();

        testSubject.dealDamage(testSubject, DEADLY_DAMAGE);

        expect(testSubject.isAlive()).toBeTruthy();
    });

    describe('Healing', () => {
        it('should recover health if healed', () => {
            const other = new Character();
            const testSubject = new Character();

            other.dealDamage(testSubject, Character.MAX_HEALTH);
            testSubject.heal(1);
            other.dealDamage(testSubject, 1);

            // Normally MAX_HEALTH+1 damage kills characters as per another test...
            // but we've recovered 1 health so they're still alive.
            expect(testSubject.isAlive()).toBeTruthy();
        });

        // This isn't strictly what the kata says, but health is an implementation detail
        it('should remain dead', () => {
            const other = new Character();
            const testSubject = new Character();

            other.dealDamage(testSubject, DEADLY_DAMAGE);
            testSubject.heal(NON_LETHAL_DAMAGE);

            expect(testSubject.isAlive()).toBeFalsy()
        })

        it('should not heal beyond max health', () => {
            const other = new Character();
            const testSubject = new Character();

            testSubject.heal(NON_LETHAL_DAMAGE);
            other.dealDamage(testSubject, DEADLY_DAMAGE);

            expect(testSubject.isAlive()).toBeFalsy()
        });
    });
})
