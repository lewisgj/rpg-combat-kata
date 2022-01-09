import {Attack, Character} from "./character";

const DEADLY_DAMAGE = Character.MAX_HEALTH + 1;
const NON_LETHAL_DAMAGE = 500;
describe("Characters", () => {
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
        const target = new Character(Attack.Melee, 0, 6);

        attacker.dealDamage(target, DEADLY_DAMAGE);
        expect(target.isAlive()).toBeTruthy()

        attacker.dealDamage(target, DEADLY_DAMAGE);
        expect(target.isAlive()).toBeFalsy()
    })

    it('should do 50% more damage if target is 5+ levels below attacker', () => {
        const attacker = new Character(Attack.Melee, 0, 6);
        const target = new Character();

        attacker.dealDamage(target, (DEADLY_DAMAGE / 3) * 2); // 2/3rds of deadly + 50% ~= original deadly amount
        expect(target.isAlive()).toBeFalsy()
    })

    describe("in factions", () => {
        it('should not hurt an ally', () => {
            const attacker = new Character();
            attacker.joinFaction("faction1");
            const theAlly = new Character();
            theAlly.joinFaction("faction1");

            attacker.dealDamage(theAlly, DEADLY_DAMAGE);

            expect(theAlly.isAlive()).toBeTruthy()
        });

        it('can heal an ally', () => {
            const healer = new Character();
            healer.joinFaction("faction1");
            const theAlly = new Character();
            theAlly.joinFaction("faction1");

            const other = new Character();

            other.dealDamage(theAlly, Character.MAX_HEALTH);
            healer.heal(1, theAlly);
            other.dealDamage(theAlly, 1);

            // Normally MAX_HEALTH+1 damage kills characters as per another test...
            // but we've recovered 1 health so they're still alive.
            expect(theAlly.isAlive()).toBeTruthy();
        });
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

    describe('Types of character', () => {
        describe("A melee fighter", () => {
            it.each([[0, 2], [0, 0], [2, 0]])('should only do damage if the character is in range (positions: %d -> %d)', (characterPosition, targetPosition, ) => {
                const testSubject = new Character(Attack.Melee, characterPosition, 1);
                const target = new Character(Attack.Melee, targetPosition, 1);

                testSubject.dealDamage(target, DEADLY_DAMAGE);

                expect(target.isAlive()).toBeFalsy();
            });

            it('should not do damage if the target is out of range (range: > 2)', () => {
                const testSubject = new Character(Attack.Melee, 0, 1);
                const target = new Character(Attack.Melee, 3, 1);

                testSubject.dealDamage(target, DEADLY_DAMAGE);

                expect(target.isAlive()).toBeTruthy();
            });
        });

        describe("A ranged fighter", () => {
            it.each([0, 20])('should only do damage if the character is in range (range: %d)', (startPosition) => {
                const testSubject = new Character(Attack.Ranged, 0, 1);
                const target = new Character(Attack.Melee, startPosition, 1);

                testSubject.dealDamage(target, DEADLY_DAMAGE);

                expect(target.isAlive()).toBeFalsy();
            });

            it('should not do damage if the target is out of range (range: > 20)', () => {
                const testSubject = new Character(Attack.Ranged, 0, 1);
                const target = new Character(Attack.Melee, 21, 1);

                testSubject.dealDamage(target, DEADLY_DAMAGE);

                expect(target.isAlive()).toBeTruthy();
            });
        });
    });
})
