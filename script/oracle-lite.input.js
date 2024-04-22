const tester = (state, text, history, storyCards, info) => {
    const oracle = (chance) => {
        state.memory.frontMemory = ""
        state.message = ""
        if (text.match(/(?:> You (try|attempt) to)/i)) {
            const random = Math.random();
            if (random < .05) {
                state.memory.frontMemory = " But you fail horrifically."
                state.message = "You fail horrifically."
            } else if (random < chance) {
                state.memory.frontMemory = " You succeed."
                state.message = "You succeed."
            } else {
                state.memory.frontMemory = " But you fail!"
                state.message = "You fail!"
            }
        }
    }
    // Change to any fraction less than 1 but greater then 0 for the probability of success. The higher the value the more likely you are to succeed.
    oracle(.5);

    return { state, text, history, storyCards, info }
}
module.exports = tester;