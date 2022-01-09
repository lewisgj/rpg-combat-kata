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

    it('should do 50% less damage if target is 5+ levels above attacker', () => {
        const attacker = new Character();
        const target = new Character(6);

        attacker.dealDamage(target, DEADLY_DAMAGE);
        expect(target.isAlive()).toBeTruthy()

        attacker.dealDamage(target, DEADLY_DAMAGE);
        expect(target.isAlive()).toBeFalsy()
    })

    it('should do 50% more damage if target is 5+ levels below attacker', () => {
        const attacker = new Character(6);
        const target = new Character();

        attacker.dealDamage(target, (DEADLY_DAMAGE / 3)*2); // 2/3rds of deadly + 50% ~= original deadly amount
        expect(target.isAlive()).toBeFalsy()
    })

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
