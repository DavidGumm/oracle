const tester = (state, text, history, storyCards, info) => {
    // Change the values below to fractions of a whole number to affect the script.

    // Chance of success, .5 is like roll an 11 or better on a 20 sided dice.
    const DEFAULT_CHANCE_FOR_SUCCESS = .5;
    // Chance of failure, .05 is like a roll a 1 on a 20 sided dice.
    const DEFAULT_CRITICAL_FAILURE = .05;
    // Chance of critical success, .95 is like rolling a 20 on a 20 sided dice.
    const DEFAULT_CRITICAL_SUCCESS = .95;
    // Enabled user messages. If you find this feature annoying disable it here.
    const ENABLED_USER_MESSAGES = true;

    // The following are the messages you receive and are send to the AI to signify success or failure.
    // The critical success message
    const ADJECTIVES_CRITICAL_SUCCESS = ["flawlessly"];
    // The failure success message
    const ADJECTIVES_CRITICAL_FAILURE = ["horrifically"];
    // The success message
    const MESSAGE_SUCCESS = "succeed";
    // The failure message
    const MESSAGE_FAILURE = "fail";

    //DO NOT MODIFY BELOW THIS LINE.
    //HERE THERE BE DRAGONS O_o.

    /**
     * Gets a random item from an array.
     * @param {array} arr Array of items.
     * @returns Random item from the array or an empty string if array is empty.
     */
    const getRandomItem = (arr) => arr.length ? arr[Math.floor(Math.random() * arr.length)] : "";

    /**
     * Sends a message to the user if messages are enabled.
     * @param {string} message The message to send.
     */
    const setUserMessage = (message) => {
        if (ENABLED_USER_MESSAGES) {
            state.message = message;
        }
        return message;
    }

    /**
     * Decides the fate of the action.
     * @param {number} chance A fraction representing the total probability of success.
     * @returns The message for success or failure.
     */
    const determineOutcome = (chance, who) => {
        const random = Math.random();
        const isSuccess = random > chance;
        const isCritical = random < DEFAULT_CRITICAL_FAILURE || random > DEFAULT_CRITICAL_SUCCESS;
        const adjective = getRandomItem(isSuccess ?
            ADJECTIVES_CRITICAL_SUCCESS : ADJECTIVES_CRITICAL_FAILURE);
        const message = (isSuccess ? MESSAGE_SUCCESS : MESSAGE_FAILURE) + ((who === "You" || who === "I") ? "" : "s") +
            (isCritical ? ` ${adjective}` : "") +
            (isSuccess ? "." : "!");
        return (isSuccess ? " And " : " But ") + setUserMessage(who + " " + message);
    }

    /**
    * The main function that coordinates the application logic.
    */
    function main(chance) {
        const match = text.match(/(?:> (.*) (try|tries|attempt|attempts) )/i);

        if (match) {
            const matchAt = text.match(/(?:> .* (?:try|tries|attempt|attempts) @(0?.\d+)) /i);
            if (matchAt && matchAt[1]) {
                chance = parseFloat(matchAt[1]);
                text = text.replace("@" + matchAt[1] + " ", "");
            }
            state.memory.frontMemory = determineOutcome(chance, match[1]);
        } else {
            state.memory.frontMemory = "";
        }
    }
    main(DEFAULT_CHANCE_FOR_SUCCESS);

    return { state, text, history, storyCards, info }
}
module.exports = tester;