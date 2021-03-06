# RPG Combat Kata

See [Original README.md](./Original%20README.md) for the code kata this repository is implementing. You'll probably need to flick between these two files to follow along.  

# Iteration 1:  Characters, Damage and Healing
## Step 1: Implementing damage

### Testing
The wording of dealing damage is very specific: "exceeds current health". This implies 1000 damage against 1000 still leaves the character alive - which feels wrong. I'm assuming the kata is always right but would want to question that.
I needed to expose `isAlive` so I had some behaviour to test against, but treated health as an internal detail. 

There's nothing to test with a character's `level` so that was left unimplemented.

### Implementation
When I first implemented this, characters directly modified other characters health. While that was *okay*, it felt better to separate receiving damage from dealing it so instances only modify their own data.

### Refactoring
To show that nuance in tests, I refactored the starting health into a constant MAX_HEALTH and used it in the tests.
Some people don't like using anything from the implementation in test code, but I think a constant is okay here. If the constant's value changes in the future, it's still a valid test.

Speaking of tests, it felt worth explicitly showing the 'negative' case too where a character remained alive after taking some damage.

## Step 2: Healing
### Testing
The kata is vague on healing. I am going to assume healing is similar to damage - characters can heal others an arbitrary amount.
Again, I treated health as an implementation detail. This gave an interesting symmetry in the 'remaining dead' and the 'max health' cases depending on what order healing and damage happened.

### Implementation
I implemented this in three parts really - healing, remaining dead and max health, each with their own little red/green cycles - though I could see the refactoring could be left until the end. 

### Refactor
There's a symmetry with damage here - and some might find it tempting to combine the two somehow. I did not - that's some mental overhead everyone can do without!
However, I did again repeat the refactoring I did for damage where healing and receiving health are separated.

# Iteration 2: Self and levelling
## Step 1: Dealing with self
### Refactoring
In a change to the usual order, I started with refactoring first this time - before I wrote the tests I realised there were a few too many magic numbers hiding the intent of my tests.

## A misstep: a happy aaccident.
While damage was easy enough, I introduced a bug for healing by implementing it in an identical way to damage. TDD only really works if you write the right tests.

### Remediating the bug

When I attempted to change the tests, I realised that the bug could be made impossible by changing the code. Sure, the existing tests needed to change but that's a small price to pay.
How? Well, by changing the method signature from `heal(other, amount)` to just `heal(amount)`, the existing tests wouldn't compile anymore. 

I abandoned a traditional red/green/refactor here - but the thought process still had great value. I thought: "What's the interface I actually want to use?".
`receiveHealth` became `heal` and the old `heal` was removed entirely.

This meant the test I wrote for the wrong requirement could be totally deleted, provided I fixed the other tests.

### A final refactor

The character tests are getting big! I tried to make it clearer what character we want to assert on by consistently naming them all testSubject.

## Step 2: Level-scaling

### Testing

We finally had a use for level, but no mechanism to level up. I assumed that level was something innate, like how a fire-breathing dragon might be level 100, but a village idiot might be level 1. Testing without directly exposing health was again quite difficult. I settled for using some multipliers of the 'deadly' constant to try to illustrate that it was the difference in levels that made it different to other tests.

### Implementation

To avoid having to refactor everything, I made the assumption that levels were 1 if not specified otherwise. I decided to use a multiplier for damage, mirroring the original requirements of percentages.

### Refactoring

The only obvious refactor here was to extract the damage multiplier calculation into its own function. If it got more complicated than that, we might want to unit test it.
Assuming the requirements stopped here I'd be okay with this solution but dealing damage is taking on a life of its own. I've tried hard so far to avoid violating the tell-don't-ask principle. My gut isn't happy with where the amount of damage is calculated, but I need details of both characters to calculate it. 

# Iteration 3: Attack ranges
## Where to begin?

In the current system characters exist in a vacuum - the existence of two characters is enough to deal damage. However, in Iteration 3, attacks have a range so characters implicitly have a position.

An example isn't hard to come up with but the implementation is tricky:
    
    Given a melee character and a target charaacter 2 meters away 
    When the character attacks with 'deadly' damage
    Then the target is dead

We'll start by taking it piece by piece but might need a whole separate red/green/refactor cycle at the end to get to a good place.

## Step 1: Melee fighters
### Testing
Let's assume everything's a melee fighter to start (though we'll make it explicit in the code.) While I could make the attack take a distance parameter, it feels like the class (or pair of Characters) should calculate it.

The simplest test I need to force a meaningful change is an 'out of range' example - though I've also added 'in range' examples to be clear what the range cut-off is.

### Implementation

So many choices! To make it explicit, characters take an enum for their "attack type". It felt like the simplest thing I could do while still giving it a name. All the constructor parameters have default values so there's just a few breaking changes which is deliberate. Putting the attack type first means can be confident I'm not setting a level as the position in existing code. We might revisit this constructor later as this class grows.
Again taking the simplest road, I let the attacking character handle the logic (like I did for level modifiers), while the receiving character decides whether it's dead as a result.

### Refactor

There's nothing obvious yet! I avoided subclassing "MeleeFighter" from "Character": while conceptually it makes sense, I fear that the damage rules are changing a lot so want that defined in a single place.

I was arguably missing some tests for negative distances, so went back and added that to justify to myself why `Math.abs` is required.

## Step 2: Ranged fighters

### Testing
This looks familiar! I duplicated the tests from melee fighters, rather than expanding on the existing ones to start with. I'm not always a fan of this kind of shortcut but I'd much rather see duplicated or verbose test code provided it's clear what's going on.

### Implementation
I went for a really naive approach here to make the test pass - just another if statement, duplicating the code. I'll leave the heavy lifting to the refactor step. 

### Refactoring

Well, this looks horrible!
```ts
if (this.#attack === Attack.Melee) {
    const distance = Math.abs(this.#position - other.#position);
    if (distance > 2) {
        return;
    }
}
else if (this.#attack === Attack.Ranged) {
    const distance = Math.abs(this.#position - other.#position);
    if (distance > 20) {
        return;
    }
}
```

Let's move the distance calculation up:

```ts
const distance = Math.abs(this.#position - other.#position);
if (this.#attack === Attack.Melee) {
    if (distance > 2) {
        return;
    }
}
else if (this.#attack === Attack.Ranged) {
    if (distance > 20) {
        return;
    }
}
```

Next, let's remove the nesting:

```ts
const distance = Math.abs(this.#position - other.#position);
if (this.#attack === Attack.Melee && distance > 2) {
    return;
}
else if (this.#attack === Attack.Ranged && distance > 20) {
    return;
}
```

That's better, but I think there's an even better option:

```ts
const MAX_RANGES: Record<Attack, number> = {
    'MELEE': 2,
    'RANGED': 20
}

class Character {
    // ...
    dealDamage(other: Character, damage: number) {
        if (other === this) {
            return;
        }

        const distance = Math.abs(this.#position - other.#position);
        if (distance > MAX_RANGES[this.#attack]) {
            return;
        }

        const damageModifier = calculateDamageModifier(this.#level, other.#level);
        other.receiveDamage(damage * damageModifier);
    }
    // ...
}
```

I like this a lot! Thanks to Typescript and the `Record` type, we can trust that `MAX_RANGES` will contain a value for every `Attack`. If we add a new type in the future, it'll be a compile-time error if we also forget to add a range here.

This 'guard' style of `if this is true, then abort` tends to scale well too in my experience as all the possible rules are layed out linearly and in precedence order. It's also straight-forward to refactor more complex rule definitions into a single function call.  

I've left the test duplication as-is. I'm generally not a fan of large `it.each` blocks: it can be difficult to work out what the intention behind each test case is and it's often clearer and simpler to just write out what it is you're trying to test. 

# The scheduled retrospective
I've been quite retrospective in these notes already but to answer the questions head on:

* I feel the design is keeping up with requirements okay. Iteration 3 was the biggest challenge for reasons I've written above.
* I don't feel great about my design - it's largely in one growing class. At some point, I will need to break this up but the seams aren't apparent to me yet.
* Everything is tested as I've defined it. The real question is does my 100% code coverage really qualify as 100% test coverage!

# Iteration 4: Factions and Allies
## Testing

We're back to the 'health-as-implementation-detail' point, but this time with factions. I focused first on 'allies can't hurt each other' - which is motivation to create most of the code!
Something nice happened with these tests - the 'language' I'd built up and implemented so far made them relatively easy to write. Partly because the requirements are purely additions, I could extend the existing test suite and not need to worry about the others.

## Implementation

The requirement "Newly created characters belong to no faction" felt a bit like programming-by-remote-control - I'll decide that, thank you!
I chose a set of strings to represent factions as there can be more than one - though was disappointed to see that there's no intersection function built-in to decide if two groups of factions overlap.

I'm not happy with the overall design - healing now resembles damaging again with healing and receiving health as distinct methods, but with a different signature.
Factions

## Refactoring

I broke the rules here a bit. The main test I wrote didn't pass the first time, and to help me debug I simplified my code as I went along. By the time I had fixed the bug, it was already much easier to understand.
When writing these notes, I did refactor the 'receive' methods to be private. I'm not sure private access is enough to fix the whole design, but it's better than it being public.

# Iteration 5 - Props
## Start by refactoring?

I've felt since iteration 3 that it can't all be the Character's responsibility - and it's nice to have a requirement to nudge us away from that.

I think there's an interface we should extract first - `Targetable`. `Targetable` things have a position and health, and can receive damage.

What effects might this have on our code?

- A character being dead and or a prop being destroyed can be the same thing (at least in this universe)
- A character's `dealDamage` method doesn't change depending on the target, if it takes a `Targetable` instead
- Most things stay the same.

Let's give it a go!

## Nope!
That refactoring got hairy quickly - It got as far as the attacker asking the prop for its position to know if it should receive damage and on first glance, that didn't sit right at all.

Let's do it properly, starting with a prop taking damage test and let the design emerge.

## Testing, Initial implementation

The test I started with was "Can a character destroy a prop?". This followed the established pattern of damaging characters until they died. Nothing exciting to share!

## Implementation, Refactoring

Here's where it gets interesting. `Targetable` was a reasonable idea, but what I couldn't see at the time was how to simplify the damage calculation. A working test suite helped me refactor with confidence.

I noticed that the rules fell into two camps:

1. First, decide whether the current character can/should attack
   1. Are we trying to attack ourselves?
   2. Are we in attack range?
   3. Are they an ally?
2. Second, decide how much damage to do
   - This is different for props and characters! 

### Deciding whether to attack
The first group is easier to implement if you assume that Characters and Props have things in common - such as positions. 
If a position is available on both, then the character can always do a range check.

Factions were stretching the idea, possibly a little too far. If both props and characters have a `belongsToFaction` accessor, we can hardcode the response to always return false for props.

### Deciding how much damage
"Tell don't ask" was how I approached the second group.

   How can I push the calculation down to the thing being attacked without circular references and other confusing implementation details?
   
A new metaphor appeared in "damage modifiers". Instead of deciding how much damage to do, and then telling the target how much damage to receive, the `dealDamage()` function now gives it any relevant information. This did mean that `receiveDamage` became public again - but that was inevitable once `Props` existed. The damage calculation can be kept simple for Props while Characters can take level difference and anything else into account in the future. 
