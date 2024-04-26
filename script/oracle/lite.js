const determineOutcome = require("./lib/determine.outcome.js");

// Every script needs a modifier function
const modifier = (text) => {
    const DEFAULT_CHANCE_FOR_SUCCESS = 0.5;
    /**
    * The main application logic to match commands.
    */
    const main = (chance) => {
        const matchDefault = text.match(/(?:> (.*) (try|tries|attempt|attempts) )/i);

        if (matchDefault) {
            const matchAtChance = text.match(/(?:> .* (?:try|tries|attempt|attempts) @(0?.\d+)) /i);
            if (matchAtChance && matchAtChance[1]) {
                chance = parseFloat(matchAtChance[1]);
                text = text.replace("@" + matchAtChance[1] + " ", "");
            }
            return determineOutcome(chance, matchDefault[1], Math.random());
        } else {
            return "";
        }
    }
    state.memory.frontMemory = main(DEFAULT_CHANCE_FOR_SUCCESS);
}
modifier(text);