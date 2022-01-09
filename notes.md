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
