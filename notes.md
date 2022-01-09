# Notes

This file is for retrospective notes I made while performing different iterations and steps during the kata.

# Iteration 1
## Step 1: Implementing damage

### Testing (Red)
The wording of dealing damage is very specific: "exceeds current health". This implies 1000 damage against 1000 still leaves the character alive - which feels wrong. I'm assuming the kata is always right but would want to question that.
I needed to expose `isAlive` so I had some behaviour to test against, but treated health as an internal detail. 

There's nothing to test with a character's `level` so that was left unimplemented.

### Implementation (Green)
When I first implemented this, characters directly modified other characters health. While that was *okay*, it felt better to separate receiving damage from dealing it so instances only modify their own data.

### Refactoring (Refactor)
To show that nuance in tests, I refactored the starting health into a constant MAX_HEALTH and used it in the tests.
Some people don't like using anything from the implementation in test code, but I think a constant is okay here. If the constant's value changes in the future, it's still a valid test.

Speaking of tests, it felt worth explicitly showing the 'negative' case too where a character remained alive after taking some damage.

## Step 2: Healing
## Testing (Red)
The kata is vague on healing. I am going to assume healing is similar to damage - characters can heal others an arbitrary amount.


