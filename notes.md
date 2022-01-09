# Notes

This file is for retrospective notes I made while performing different iterations and steps during the kata.

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

We finally had a use for level, but no mechanism to level up. I assumed that level was something innate, like how a fire-breathing dragon might be level 100, but a village idiot might be level 1. Testing without directly exposing health was again quite difficult. I settled for using some multipliers of the 'deadly' constant to try to illusrate that it was the difference in levels that made it different to other tests.

### Implementation

To avoid having to refactor everything, I made the assumption that levels were 1 if not specified otherwise.
