export type DamageModifiers = {
    attackerLevel: number
}

export type Targetable = {
    receiveDamage(baseDamage: number, modifiers: DamageModifiers): void
    position: number
    belongsToFaction(faction: string): boolean
}
