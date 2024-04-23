// Every script needs a modifier function
const modifier = (text) => {
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
    const ADJECTIVE_CRITICAL_SUCCESS = "flawlessly";
    // The failure success message
    const ADJECTIVE_CRITICAL_FAILURE = "horrifically";
    // The critical success message
    const MESSAGE_SUCCESS = "succeed";
    // The failure success message
    const MESSAGE_FAILURE = "fail";

    //DO NOT MODIFY BELOW THIS LINE.
    //HERE THERE BE DRAGONS O_o.

    /**
     * The main entry point to the application.
     */
    const main = () => {
        /**
        * Sets the message to be sent to the user gated by ENABLED_USER_MESSAGES.
        * @param {string} message The message to be sent to the user.
        */
        const setMessage = (who, message) => {
            const newMessage = who + " " + message
            if (ENABLED_USER_MESSAGES) {
                state.message = newMessage
            }
            return newMessage;
        }

        const getMessage = (who, message) => {
            return message + ((who === "You" || who === "I") ? "" : "s");
        }

        /**
         * Decides the fate of the action.
         * @param {number} chance A fraction representing the total probability of success.
         * @returns The message for success or failure.
         */
        const oracle = (chance, who) => {
            const random = Math.random();
            const combine = (message, isSuccess) => {
                return (isSuccess ? " And " : " But ") + message;
            }
            if (random < DEFAULT_CRITICAL_FAILURE) {
                const message = getMessage(who, MESSAGE_FAILURE) + " " + ADJECTIVE_CRITICAL_FAILURE + "!";
                return combine(setMessage(who, message), false);
            } else if (random > DEFAULT_CRITICAL_SUCCESS) {
                const message = getMessage(who, MESSAGE_SUCCESS) + ADJECTIVE_CRITICAL_SUCCESS + ".";
                return combine(setMessage(who, message), true);
            } else if (random > chance) {
                const message = getMessage(who, MESSAGE_SUCCESS) + ".";
                return combine(setMessage(who, message), true);
            } else {
                const message = getMessage(who, MESSAGE_FAILURE) + "!";
                return combine(setMessage(who, message), false);
            }
        }

        // Define the default chance
        let chance = DEFAULT_CHANCE_FOR_SUCCESS;
        state.memory.frontMemory = "";
        state.message = undefined;
        const match = text.match(/(?:> (.*) (try|tries|attempt|attempts) )/i)
        if (match) {
            const matchAt = text.match(/(?:> .* (?:try|tries|attempt|attempts) @(0?.\d+)) /i);
            // If match then use the number provided by the user.
            if (matchAt && matchAt[1]) {
                // Parse th command for the number of the roll.
                chance = Number.parseFloat(matchAt[1]);
                // Remove the number for the roll from the text.
                text = text.replace(("@" + matchAt[1] + " "), "");
            }
            state.memory.frontMemory = oracle(chance, match[1]);
        }
    }
    main();

    return { text }
}

// Don't modify this part
modifier(text)