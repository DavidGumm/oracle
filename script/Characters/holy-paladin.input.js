const modifier = (text) => {/**
     * Every script needs a modifier function
     * Tests:
     * "> You try to use fighting to defend yourself."
     * "> You try to use first aid to heal yourself."
     * "> You try to use scavenging to find resources."
     * "> You try to move the rock."
     * "> You say \"Some words you say.\""
     */
    const oracle = (state, text, history, storyCards, info) => {
        const STARTING_ACTION_RATE = 0.5
        const STARTING_ACTION_MAX_BONUS_RATE = 0.1
        const STARTING_ACTION_MIN_BONUS_RATE = 0.01
        const defaultActionRate = () => STARTING_ACTION_RATE + (Math.random() * (STARTING_ACTION_MIN_BONUS_RATE - STARTING_ACTION_MAX_BONUS_RATE) + STARTING_ACTION_MAX_BONUS_RATE)
        const AUTHORS_NOTES = "[Setting: Lord of the Rings]\n[Tone: Epic, Morally Complex]\n[Style: Descriptive, Immersive]"

        class Exhaustion {
            constructor(
                // Enables the exhaustion system
                enabled = true,
                // Player exhaustion status threshold
                threshold = 9,
                // Starting value for for inactive turns counter
                inactive = 0,
                // Starting value for for active turns counter
                active = 0,
                // The message to display when the exhaustion threshold
                message = "You are exhausted!") {
                this.enabled = enabled;
                this.threshold = threshold;
                this.inactive = inactive;
                this.active = active;
                this.message = message;
            }
        }

        class Threat {
            constructor(
                // Enabled the player activity threat system
                enabled = true,
                // The threshold to drop below before activating
                threshold = 3,
                // The current count of active turns
                active = 3,
                // The current count of inactive turns.
                inactive = 3,
                // The outcomes you might encounter for player inaction.
                array = [
                    "You can barely hear something.",
                    "You saw something on the edge of your vision.",
                    "You smell something but cannot make it out."
                ]) {
                this.enabled = enabled;
                this.threshold = threshold;
                this.active = active;
                this.inactive = inactive;
                this.array = array;
            }
        }

        //Actions
        class Leveling {
            constructor(
                // Allow action increase
                increaseEnabled = true,
                // Allow action decrease
                decreaseEnabled = true,
                // The actions maximum rate
                maxRate = .95,
                // The actions minimum rate
                minRate = .5,
                // The base rate of action change
                rateOfChange = 0.01,
                // The experience failure multiplier
                rateOfChangeFailureMultiplier = 10,
                // The rate of action decrease. I recommend it be the success experience divided by less than the number of actions
                decreaseRate = 0.001) {
                this.increaseEnabled = increaseEnabled;
                this.decreaseEnabled = decreaseEnabled;
                this.maxRate = maxRate;
                this.minRate = minRate;
                this.rateOfChange = rateOfChange;
                this.rateOfChangeFailureMultiplier = rateOfChangeFailureMultiplier;
                this.decreaseRate = decreaseRate;
            }
        }

        class CoolDown {
            constructor(
                // Enables the action cool down system
                enabled = true,
                // How quick the cool down rate goes down per player turn
                decreaseRatePerAction = 1,
                // The failure threshold for when to cool down actions
                failureThreshold = 5,
                // The current count
                failureCount = 0,
                // The remaining Cool down turns
                remainingTurns = 0) {
                this.enabled = enabled;
                this.decreaseRatePerAction = decreaseRatePerAction;
                this.failureThreshold = failureThreshold;
                this.failureCount = failureCount;
                this.remainingTurns = remainingTurns;
            }
        }

        class Action {
            constructor(name, successEndings, failureEndings, successStart, failureStart, coolDownPhrase, rate, leveling, coolDown, note = "") {
                this.name = name.map(n => n.toLowerCase());
                this.successEndings = successEndings;
                this.failureEndings = failureEndings;
                this.successStart = successStart;
                this.failureStart = failureStart;
                this.coolDownPhrase = coolDownPhrase;
                this.rate = rate;
                this.leveling = leveling;
                this.coolDown = coolDown;
                this.note = note;
            }
        }

        //Set default Actions
        const ACTIONS = [
            new Action(
                // List of matching names
                ["default"],
                // Success adjectives
                ["righteous", "noble", "honorable"],
                // Failure adjectives
                ["misguided", "unworthy", "ignoble"],
                // Success statement
                "With steadfast conviction, you uphold justice and prove yourself",
                // Failure statement
                "Your attempt to champion righteousness falters as you appear",
                // Exhaustion statement / status
                "Your holy fervor wavers!",
                // Starting rate
                STARTING_ACTION_RATE + STARTING_ACTION_MAX_BONUS_RATE,
                {
                    // Allow action increase?
                    increaseEnabled: false,
                    // Allow action decrease?
                    decreaseEnabled: false,
                    // The actions maximum rate
                    maxRate: STARTING_ACTION_RATE + STARTING_ACTION_MAX_BONUS_RATE,
                    // The actions minimum rate
                    minRate: STARTING_ACTION_RATE + STARTING_ACTION_MAX_BONUS_RATE,
                    // The base rate of action change
                    rateOfChange: 0,
                    // The experience failure multiplier
                    rateOfChangeFailureMultiplier: 1,
                    // The rate of action decrease. I recommend it be the success experience divided by less than the number of actions
                    decreaseRate: 0
                },
                {
                    // Enables the action cool down system
                    enabled: false,
                    // How quick the cool down rate goes down per player turn
                    decreaseRatePerAction: 1,
                    // The failure threshold for when to cool down actions
                    failureThreshold: 3,
                    // The current count
                    failureCount: 0,
                    // The remaining Cool down turns
                    remainingTurns: 0
                }
            ),
            new Action(
                // List of matching names
                ["speech", "charisma", "diplomacy", "command"],
                // Success adjectives
                ["inspiring", "commanding", "rousing"],
                // Failure adjectives
                ["unconvincing", "meek", "uninspiring"],
                // Success statement
                "With righteous presence, you rally your allies and are",
                // Failure statement
                "Your attempt to inspire falls flat as you come across as",
                // Exhaustion statement / status
                "You struggle to summon an inspiring presence!",
                // Starting rate
                defaultActionRate(),
                new Leveling(),
                new CoolDown()
            ),
            new Action(
                // List of matching names
                ["fighting", "combat", "weapon"],
                // Success adjectives
                ["valorous", "heroic", "indomitable"],
                // Failure adjectives
                ["clumsy", "ineffective", "feeble"],
                // Success statement
                "You unleash a righteous onslaught with",
                // Failure statement
                "Your combat prowess falters as your attack proves",
                // Exhaustion statement / status
                "Your holy might deserts you in battle!",
                // Starting rate
                defaultActionRate(),
                new Leveling(),
                new CoolDown()
            ),
            new Action(
                // List of matching names
                ["build", "craft", "create"],
                // Success adjectives
                ["blessed", "consecrated", "hallowed"],
                // Failure adjectives
                ["flawed", "imperfect", "shoddy"],
                // Success statement
                "Guided by divine purpose, you craft something",
                // Failure statement
                "Your attempt at crafting falls short as the result is",
                // Exhaustion statement / status
                "The blessings needed for crafting evade you!",
                // Starting rate
                defaultActionRate(),
                new Leveling(),
                new CoolDown()
            ),
            new Action(
                // List of matching names
                ["magic", "holy magic", "divine power"],
                // Success adjectives
                ["radiant", "consecrated", "exalted"],
                // Failure adjectives
                ["feeble", "diminished", "waning"],
                // Success statement
                "You channel holy energies with",
                // Failure statement
                "Your attempt to wield divine power is",
                // Exhaustion statement / status
                "Your divine connection is strained!",
                // Starting rate
                defaultActionRate(),
                new Leveling(),
                new CoolDown()
            ),
            new Action(
                // List of matching names
                ["purify", "cleanse", "sanctify"],
                // Success adjectives
                ["immaculate", "unblemished", "resplendent"],
                // Failure adjectives
                ["tainted", "profane", "corrupted"],
                // Success statement
                "With holy light, you purge the profane in an",
                // Failure statement
                "Your attempt at purification proves",
                // Exhaustion statement
                "Your powers of purification wane!",
                // Starting rate
                defaultActionRate(),
                new Leveling(),
                new CoolDown()
            )
        ]

        // DO NOT MODIFY SCRIPT BELOW THIS LINE.
        // HERE THEIR BE MONSTERS!
        class PlayerActivity {
            exhaustion = new Exhaustion();
            threat = new Threat();
        }

        class Game {
            // Player activity
            playerActivity = new PlayerActivity();
        };

        // Helper functions
        const getRandomItem = array => array[Math.floor(Math.random() * array.length)];
        const getActionByName = name => state.player.actions.find(action => action.name.includes(name.toLowerCase())) || state.player.actions[0];

        // Adjust a action's success rate dynamically based on outcome
        const setActionState = (action, isSuccess) => {
            // Increase the action rate more significantly the lower the current action level is.
            const calculate = isSuccess => {
                return action.leveling.rateOfChange * (1 + ((action.rate * isSuccess ? 1 : action.leveling.rateOfChangeFailureMultiplier) / action.leveling.maxRate));
            }
            const newRate = calculate(isSuccess);
            if (isSuccess) {
                state.player.actions.forEach(sk => sk.failCount = 0);
                if (action.leveling.increaseEnabled) {
                    action.rate = Math.min(action.rate + newRate, action.leveling.maxRate);
                }
            } else {
                if (action.coolDown.enabled) {
                    action.failCount += 1;
                    decreaseActionRate(action, calculate(isSuccess));
                    if (action.failCount >= action.coolDown.threshold) {
                        action.coolDown = action.coolDown.threshold;
                    }
                }
            }
        }

        const decreaseActionRate = (action, newRate) => {
            if (action.leveling.decreaseEnabled) {
                reduce(action.leveling.minRate, action.rate, newRate);
            }
        }

        /**
         * Determine success or failure of a action
         * @param {action} action The action to check.
         * @returns {boolean} The success or failure of the action check.
         */
        const fate = (action) => {
            if (action.coolDown.enabled && (action.coolDown.remainingTurns > 0)) {
                return false;
            }
            const success = Math.random() < action.rate;
            setActionState(action, success);
            state.message += success ? `\nYour ${action.name[0]} check succeeded.\n` : `\nYour ${action.name[0]} check failed.\n`;
            return success;
        }

        /**
         * Gets the phrase
         * @param {action} action The action to get the phrase from.
         * @returns The phrase relent to the actions success or failure.
         */
        const getPhrase = (action) => {
            const success = fate(action);
            const successPhrase = action => `[${action.successStart} ${getRandomItem(action.successEndings)}.]`;
            const failurePhrase = action => `[${action.failureStart} ${getRandomItem(action.failureEndings)} and utterly fail!]`;
            const note = action => action.note !== "" ? ` [${action.name[0]} Action Note: ${action.note}]` : "";
            if (action.coolDown.remainingTurns > 0) {
                return `[${action.coolDownPhrase}]`;
            }
            return note(action) + (success ? successPhrase(action) : failurePhrase(action));
        }

        /**
         * Process all the actions providing an update to each non active action.
         * @param {string} name The Name of the action being used actively and action being ignored for updates.
         */
        const processActionsCoolDown = (name) => {
            state.player.actions.forEach(a => {
                if (a.name !== name) {
                    decreaseActionRate(a, -a.leveling.decreaseRate);
                    if (a.coolDown > 0) {
                        a.coolDown += -a.coolDown.decreaseRatePerAction;
                    }
                }
            });
        }

        /**
         * The oracle for use as command parse and entry point.
         * @param {string} text The user imputed text.
         * @returns the oracle's outcome for a player action.
         */
        const actionParse = (text) => {
            const actionRegex = /(?:> .* (try|attempt|tries|attempts) to use (.*) to |> .* (try|attempt|tries|attempts) to |> .* (say|says) "([^"]+)")/i;
            const match = text.match(actionRegex);
            if (match) {
                let action;
                if (match[2]) {  // If action name is captured
                    action = getActionByName(match[2]);
                    activeTurn(true);
                } else if (match[4]) {  // If speech is captured
                    action = getActionByName("speech");
                    activeTurn(false);
                } else {  // Default would be match[3]
                    action = getActionByName("default");
                    activeTurn(true);
                }
                processActionsCoolDown(action.name[0]);
                state.memory.frontMemory = getPhrase(action);
            } else {
                reduce(0, state.game.playerActivity.threat.active, -1);
                reduce(0, state.game.playerActivity.threat.inactive, -1);
                state.memory.frontMemory = "";  // No relevant action found
            }
        }

        const reduce = (min, number, amount) => number = Math.max(min, number + amount);

        /**
         * Logic for handling the player exhaustion.
         * @param {boolean} active If the player turn is an active one.
         */
        const activeTurn = (active) => {
            if (!state.game.playerActivity.exhaustion.enabled) return;
            if (active) {
                reduce()
                state.game.playerActivity.exhaustion.inactive = 0;
                state.game.playerActivity.exhaustion.active += 1;
                state.game.playerActivity.threat.active += 1;
                reduce(0, state.game.playerActivity.threat.inactive, -1);
            } else {
                state.game.playerActivity.exhaustion.active = 0;
                state.game.playerActivity.exhaustion.inactive += 1;
                state.game.playerActivity.threat.inactive += 1;
                reduce(0, state.game.playerActivity.threat.active, -1);
            }

            if (state.game.playerActivity.inactive > state.game.playerActivity.exhaustion.threshold) {
                state.player.status = "";
            } else if (state.game.playerActivity.exhaustion.active > state.game.playerActivity.exhaustion.threshold) {
                state.player.status = `[${state.game.playerActivity.exhaustion.message}]`;
            } else {
                state.player.status = "";
            }
        }

        const suddenly = () => {
            if (!state.game.playerActivity.threat.enabled) return "";
            const activity = Math.max(state.game.playerActivity.threat.active, state.game.playerActivity.threat.inactive);
            if (activity < state.game.playerActivity.threat.threshold) {
                // add to authors notes
                return getRandomItem(state.game.playerActivity.threat.array);
            }
            return "";
        }

        const authorsNoteManager = (notes) => {
            const note = notes.join(" ").trim();
            state.memory.authorsNote = note + AUTHORS_NOTES;
        }

        /**
         * Gets the players status.
         * @returns The status.
         */
        const getPlayerStatus = () => {
            const status = [getStatus().map(a => a.coolDownPhrase), suddenly()]
                .join(" ")
                .trim();
            if (status.length > 0) {
                return `[Your status: [${status}]]`;
            }
            return `[Your status: []]`;
        }

        /**
         * Gets an array of actions on cool down.
         * @returns an array of actions on cool down.
         */
        const getStatus = () => {
            let actions = state.player.actions.filter(a => a.coolDown.enabled && a.coolDown.remainingTurns > 0);
            if (state.player.status.length > 0) {
                actions.push(state.player.status);
            }
            return actions;
        };

        /**
         * Gets the players status for the message.
         * @returns The status.
         */
        const getPlayerStatusMessage = () => {
            const status =
                getStatus()
                    .map(a => `${a.name[0]} is cooling down for ${a.coolDown.remainingTurns} turns. Causing: "${a.coolDownPhrase}"`)
                    .join("\n")
                    .trim();
            if (status.length > 0) {
                return status;
            }
            return "";
        }
        // Check if player state exists, if not, initialize
        if (!state.player) {
            state.player = {
                status: "",
                actions: ACTIONS
            }
        }
        if (!state.game) {
            state.game = new Game();
        }
        // Ensure state.message is blank and ready.
        if (!state.message) {
            state.message = "";
        }

        // Call and modify the front Memory so the information is only exposed to the AI for a single turn.
        actionParse(text);

        authorsNoteManager([getPlayerStatus()]);
        // Notify the player of the status.
        state.message = getPlayerStatusMessage();
    }

    oracle(state, text, history, storyCards, info)
    return { text: text }
}

// Don't modify this part
modifier(text)