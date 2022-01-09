import {Prop} from "./prop";

describe('Props', () => {
    it('should not belong to any faction', () => {
        const prop = new Prop(1000 ,0);

        expect(prop.belongsToFaction("someFaction")).toBeFalsy();
    });

    it('should be destroyed after taking more damage than health', () => {
        const prop = new Prop(1000 ,0);

        prop.receiveDamage(1001);

        expect(prop.isDestroyed()).toBeTruthy();
    });
});
