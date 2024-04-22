const tester = (state, text, history, storyCards, info) => {
    const oracle = (state, text, history, storyCards, info) => {
        const STARTING_ACTION_RATE = 0.4;
        const STARTING_ACTION_MAX_BONUS_RATE = 0.2;
        const STARTING_ACTION_MIN_BONUS_RATE = 0.01;
        const defaultActionRate = () => STARTING_ACTION_RATE + (Math.random() * (STARTING_ACTION_MIN_BONUS_RATE - STARTING_ACTION_MAX_BONUS_RATE) + STARTING_ACTION_MAX_BONUS_RATE);
        const AUTHORS_NOTES = "[Setting: Zombie post-apocalypse] [Tone: Grim, Dark] [Style: Gritty, Evocative, Fast Zombies]";
        const ENABLE_DYNAMIC_ACTIONS_SYSTEM = false;
        const ENABLE_DYNAMIC_EVENT_SYSTEM = true;

        class Event {
            constructor(chance, description) {
                // The chance this can be the event
                this.chance = chance;
                // The description of the event to be presented to the AI
                this.description = description;
            }
        }

        class EventSystem {
            constructor(
                // The name or id to use to find the event status
                name,
                // The array of event status.
                events,
                // The overall chance the event can change
                chance
            ){
                this.name = name;
                this.events = events;
                this.chance = chance;
                this.current = getRandomItem(events);
                this.description = this.current.description;
            }
            change() {
                if (Math.random() < this.chance) {
                    const random = Math.random();
                    this.events.every(e => {
                        if (random < e.chance) {
                            this.current = e;
                            this.description = e.description;
                            return false;
                        }
                    });
                }
            }
        }

        class Exhaustion {
            constructor(
                // Enables the exhaustion system
                enabled = true,
                // Player exhaustion status threshold
                threshold = 5,
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
                // The current count of inactive turns
                inactive = 3,
                // The outcomes you might encounter for player inaction
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
                minRate = .3,
                // The base rate of action change
                rateOfChange = 0.001,
                // The experience failure multiplier
                rateOfChangeFailureMultiplier = 10,
                // The rate of action decrease. I recommend it be the success experience divided by less than the number of actions
                decreaseRate = 0.001 / 6) {
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
                failureThreshold = 3,
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
            constructor(
                name = [],
                successEndings = ["masterful", "remarkable", "flawless"],
                failureEndings = ["clumsy", "inept", "futile"],
                successStart = "Successfully, you manage to be",
                failureStart = "Despite your efforts, you end up being",
                coolDownPhrase = "You are unable to!",
                rate = defaultActionRate(),
                leveling = new Leveling(),
                coolDown = new CoolDown(),
                note = "") {
                this.name = name.map(n => n.toLowerCase());
                this.successEndings = successEndings;
                this.failureEndings = failureEndings;
                this.successStart = successStart;
                this.failureStart = failureStart;
                this.coolDownPhrase = coolDownPhrase;
                this.note = note;
                this.rate = rate;
                this.leveling = leveling;
                this.coolDown = coolDown;
            }
        }

        //Set default Actions
        const ACTIONS = [
            new Action(
                ["default"],
                ["masterful", "remarkable", "flawless"],
                ["clumsy", "inept", "futile"],
                "Successfully, you manage to be",
                "Despite your efforts, you end up being",
                "You are unable to!",
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
                ["speech", "charisma", "diplomacy"],
                ["persuasive","charming","convincing"],
                ["awkward", "unconvincing", "ineffectual"],
                "You speak with",
                "You try to be persuasive, but your words are",
                "You're too flustered to speak clearly!",
                defaultActionRate(),
                new Leveling(),
                new CoolDown()
            ),// START action change section.
            new Action(
                ["fighting","combat","weapon"],
                ["brutal efficiency", "deadly precision", "unyielding resolve"],
                ["misjudged", "ineffective", "reckless"],
                "You attack with",
                "Your attack proves",
                "You could die!",
                defaultActionRate(),
                new Leveling(),
                new CoolDown()
            ),
            new Action(
                ["movement","move","running","jumping","dodge"],
                ["agile", "graceful", "fluid"],
                ["unprepared", "reckless", "awkward"],
                "Your movement is successfully and",
                "Your attempt to move was",
                "You can't move anymore!",
                defaultActionRate(),
                new Leveling(),
                new CoolDown()
            ),
            new Action(
                ["scavenging"],
                ["find valuable resources", "uncover useful supplies", "discover essential items"],
                ["unprepared", "inadequate", "perilous"],
                "You scavenge successfully and",
                "Your attempt to scavenge is deemed",
                "You can't locate things to scavenge.",
                defaultActionRate(),
                new Leveling(),
                new CoolDown()
            ),
            new Action(
                ["stealth"],
                ["silent steps", "ghost-like silence", "undetectable movements"],
                ["clumsy", "exposed", "detected"],
                "You move with",
                "Your attempt to move stealthily fails; you are",
                "You are being conspicuous.",
                defaultActionRate(),
                new Leveling(),
                new CoolDown()
            ),
            new Action(
                ["first aid"],
                ["lifesaving actions", "precise techniques", "effective treatments"],
                ["ineffective", "clumsy", "detrimental"],
                "You administer first aid with",
                "Your attempt at first aid is",
                "Your medical supplies are running dangerously low.",
                defaultActionRate(),
                new Leveling(),
                new CoolDown(),
                "You used vital supplies for your first-aid attempt."
            )// End action change section.
        ];

        // DO NOT MODIFY SCRIPT BELOW THIS LINE.
        // HERE THEIR BE MONSTERS!

        class PlayerActivity {
            exhaustion = new Exhaustion();
            threat = new Threat();
        }

        class Game {
            // Player activity
            playerActivity = new PlayerActivity();
            dynamicActions = ENABLE_DYNAMIC_ACTIONS_SYSTEM;
            eventSystem = [
                new EventSystem(
                    "The weather.",
                    [
                        new Event(.05, "It is thundering outside."),
                        new Event(.1, "There are clouds and precipitation outside."),
                        new Event(.15, "There are clouds outside."),
                        new Event(.25, "There is a thick fog outside."),
                        new Event(1, "It is clear outside."),
                    ],
                    0.1
                ),
                new EventSystem(
                    "Blood Moon",
                    [
                        new Event(.5, "Suddenly a zombie appears!"),
                        new Event(1, ""),
                    ],
                    0.1
                )
            ]
        };

        // Helper functions
        const getRandomItem = array => array[Math.floor(Math.random() * array.length)];

        const getActionByName = name => {
            if (state.game.dynamicActions) {
                let action = state.player.actions.find(action => action.name.includes(name.toLowerCase()));
                if (!action) {
                    // If skill does not exist, create it with default attributes.
                    let names = [];
                    names.push(name.toLowerCase());
                    const newAction = new Action(names);
                    state.player.actions.push(newAction); // Add the new action to the actions array
                }
                return state.player.actions.find(action => action.name.includes(name.toLowerCase()));
            }
            return state.player.actions.find(action => action.name.includes(name.toLowerCase())) || state.player.actions[0];
        }

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
            const actionRegex = /(?:> You (try|attempt) to use (.*) to |> You (try|attempt) to |> You say "([^"]+)")/i;
            const match = text.match(actionRegex);
            state.game.eventSystem.forEach(e => e.change());
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

        const getEventSystem = () => {
            if (ENABLE_DYNAMIC_EVENT_SYSTEM) {
                return state.game.eventSystem.map(e => e.description);
            }
            return [];
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

        const authorsNoteManager = (notes) => (notes.join(" ").trim() + " " + AUTHORS_NOTES).trim();

        /**
         * Gets the players status.
         * @returns The status.
         */
        const getPlayerStatus = () => {
            const status = [
                state.player.actions.filter(a => a.coolDown.enabled && a.coolDown.remainingTurns > 0).map(a => a.coolDownPhrase),
                state.player.status,
                suddenly()]
                .join(" ")
                .trim();
            if (status.length > 0) {
                return `[Your status: ${status}]`;
            }
            return "";
        }

        /**
         * Gets the players status for the message.
         * @returns The status.
         */
        const getPlayerStatusMessage = () => {
            const status = state.player.actions.filter(a => a.coolDown.enabled && a.coolDown.remainingTurns > 0)
                    .map(a => `${a.name[0]} is cooling down for ${a.coolDown.remainingTurns} turns. Causing: "${a.coolDownPhrase}"`)
                    .join("\n")
                    .trim();
            if (status !== "") {
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
        // Ensure state.memory.authorsNote is blank and ready.
        if (!state.memory.authorsNote) {
            state.memory.authorsNote = "";
        }
        // Ensure state.message is blank and ready.
        state.message = "";

        // Call and modify the front Memory so the information is only exposed to the AI for a single turn.
        actionParse(text);

        state.memory.authorsNote = authorsNoteManager([
            getPlayerStatus(),
            ...getEventSystem()
        ]);

        // Notify the player of the status.
        state.message += getPlayerStatusMessage();
    }
    oracle(state, text, history, storyCards, info);

    return { state, text, history, storyCards, info }
}

module.exports = tester;