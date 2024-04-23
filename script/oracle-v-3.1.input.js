const oracle = (state, text, history, storyCards, info) => {
    // Helper functions
    const getRandomItem = arr => arr[Math.floor(Math.random() * arr.length)];

    const getNextItem = (arr, currentIndex) => {
        if (!arr.length) {
            throw new Error('Array cannot be empty.');
        }
        // Ensure the currentIndex is within the array bounds
        currentIndex = currentIndex % arr.length;
        return arr[(currentIndex + 1) % arr.length];
    }

    class ActionRate {
        /**
         * The starting action rates.
         * @param {number} starting The minimum value for an action.
         * @param {number} MaxBonusRate The max starting bonus rate.
         * @param {number} MinBonusRate The min starting bonus rate.
         */
        constructor(starting, MaxBonusRate, MinBonusRate) {
            this.starting = starting;
            this.MaxBonusRate = MaxBonusRate;
            this.MinBonusRate = MinBonusRate;
        }
        defaultActionRate() {
            return this.starting + (Math.random() * (this.MinBonusRate - this.MaxBonusRate) + this.MaxBonusRate)
        }
    }

    /**
     * The event for the event system.
     * @param {number} chance The chance this can be the event
     * @param {string} description The description of the event to be presented to the AI
     */
    class EventType {
        constructor(chance, description) {
            this.chance = chance;
            this.description = description;
        }
    }

    /**
     * An event system.
     * @param {string} name The name of id to find the event.
     * @param {EventType} events An array of events posable in this scenario.
     * @param {*} chance The likelihood of the event changing.
     */
    class EventSystem {
        constructor(name, events, chance) {
            this.name = name;
            this.events = events;
            this.chance = chance;
            this.current = getRandomItem(events);
            this.description = this.current.description;
            this.isRandom = true
        }
        change() {
            if (Math.random() < this.chance) {
                if (this.isRandom) {

                    const random = Math.random();
                    this.events.every(e => {
                        if (random < e.chance) {
                            this.current = e;
                            this.description = e.description;
                            return false;
                        }
                    });
                } else {
                    this.current = getNextItem(this.events, this.events.indexOf(e => e.description === this.current.description));
                }
            }
        }
    }

    /**
     * The player exhaustion tracking system.
     * @param {boolean} enabled If the system is active and in use.
     * @param {number} threshold The threshold at which the system activates.
     * @param {number} inactive Turns of inactivity.
     * @param {number} active Turns of activity.
     * @param {string} message The message to display when exhausted.
     */
    class Exhaustion {
        constructor(enabled, threshold, inactive, active, message) {
            this.enabled = enabled;
            this.threshold = threshold;
            this.inactive = inactive;
            this.active = active;
            this.message = message;
        }
    }

    /**
     * The threat system for use durning 'low' player activity. The system system is activated off a lack of player action over time.
     * @param {boolean} enabled Enabled the player activity threat system
     * @param {number} threshold The threshold to drop below before activating
     * @param {number} active The current count of active turns
     * @param {number} inactive The current count of inactive turns
     * @param {string[]} array The outcomes you might encounter for player inaction
     */
    class Threat {
        constructor(enabled, threshold, active, inactive, array) {
            this.enabled = enabled;
            this.threshold = threshold;
            this.active = active;
            this.inactive = inactive;
            this.array = array;
        }
    }

    /**
     * The leveling information for an action.
     * @param {boolean} increaseEnabled Allow action increase
     * @param {boolean} decreaseEnabled Allow action decrease
     * @param {number} maxRate The actions maximum rate
     * @param {number} minRate The actions minimum rate
     * @param {number} rateOfChange The base rate of action change
     * @param {number} rateOfChangeFailureMultiplier The experience failure multiplier
     * @param {number} decreaseRate The rate of action decrease. I recommend it be the success experience divided by less than the number of actions
     */
    class Leveling {
        constructor(increaseEnabled, decreaseEnabled, maxRate, minRate, rateOfChange, rateOfChangeFailureMultiplier, decreaseRate) {
            this.increaseEnabled = increaseEnabled;
            this.decreaseEnabled = decreaseEnabled;
            this.maxRate = maxRate;
            this.minRate = minRate;
            this.rateOfChange = rateOfChange;
            this.rateOfChangeFailureMultiplier = rateOfChangeFailureMultiplier;
            this.decreaseRate = decreaseRate;
        }
    }

    /**
     * The actions cool down subsystem.
     * @param {boolean} enabled Enables the action cool down system
     * @param {number} decreaseRatePerAction How quick the cool down rate goes down per player turn
     * @param {number} failureThreshold The failure threshold for when to cool down actions
     * @param {number} failureCount The current count
     * @param {number} remainingTurns The remaining Cool down turns
     */
    class CoolDown {
        constructor(enabled, decreaseRatePerAction, failureThreshold, failureCount, remainingTurns) {
            this.enabled = enabled;
            this.decreaseRatePerAction = decreaseRatePerAction;
            this.failureThreshold = failureThreshold;
            this.failureCount = failureCount;
            this.remainingTurns = remainingTurns;
        }
    }

    const defaultActionLeveling = () => new Leveling(
        increaseEnabled = true, // Allow action increase
        decreaseEnabled = true, // Allow action decrease
        maxRate = .95, // The actions maximum rate
        minRate = .3, // The actions minimum rate
        rateOfChange = 0.001, // The base rate of action change
        rateOfChangeFailureMultiplier = 10, // The experience failure multiplier
        decreaseRate = 0.001 / 6 // The rate of action decrease. I recommend it be the success experience divided by less than the number of actions
    );

    const defaultActionCoolDown = () => new CoolDown(
        true, //Enable the action cool down subsystem
        1, // The rate of decrease per turn.
        3, // The failure threshold at which to activate the cool down
        0, // The current failure count.
        0 // Turns remain on cool down.
    );

    class Action {
        constructor(
            name = [],
            successEndings = ["masterful", "remarkable", "flawless"],
            failureEndings = ["clumsy", "inept", "futile"],
            successStart = "Successfully, you manage to be",
            failureStart = "Despite your efforts, you end up being",
            coolDownPhrase = "You are unable to!",
            rate = 0,
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

    class PlayerActivity {
        constructor(exhaustion, threat) {
            this.exhaustion = exhaustion;
            this.threat = threat;
        }
    }

    class Game {
        constructor(playerActivity, dynamicActions, eventSystem, eventSystemEnabled, authorsNote, ActionRate, players) {
            this.playerActivity = playerActivity;
            this.dynamicActions = dynamicActions;
            this.eventSystem = eventSystem;
            this.eventSystemEnabled = eventSystemEnabled;
            this.authorsNote = authorsNote;
            this.ActionRate = ActionRate;
            this.players = players;
        }
    };

    const delphicBase = (state, text, history, storyCards, info) => {
        const GAME = new Game(
            new PlayerActivity(
                new Exhaustion(
                    true, // Enables the exhaustion system
                    5, // Player exhaustion status threshold
                    0, // Starting value for for inactive turns counter
                    0, // Starting value for for active turns counter
                    "You are exhausted!" // The message to display when the exhaustion threshold
                ),
                new Threat(
                    true, // Enabled the player activity threat system
                    3, // The threshold to drop below before activating
                    3, // The current count of active turns
                    3, // The current count of inactive turns,
                    [
                        "You can barely hear something.",
                        "You saw something on the edge of your vision.",
                        "You smell something but cannot make it out."
                    ]
                )
            ),
            false, // Enable subsystem to allow dynamically added skills during game play.
            [
                new EventSystem(
                    "Natural Weather",
                    [
                        new EventType(.05, "It is thundering outside."),
                        new EventType(.1, "There are clouds and precipitation outside."),
                        new EventType(.15, "There are clouds outside."),
                        new EventType(.25, "There is a thick fog outside."),
                        new EventType(1, "It is clear outside."),
                    ],
                    0.1
                ),
                new EventSystem(
                    "Blood Moon",
                    [
                        new EventType(.5, "Suddenly a zombie appears!"),
                        new EventType(1, ""),
                    ],
                    0.1
                ),
                new EventSystem(
                    "Feeling",
                    [
                        new EventType(.05, "You feel upset."),
                        new EventType(.10, "You feel betrayed."),
                        new EventType(.15, "You feel emotional hurt."),
                        new EventType(.20, "You are sad."),
                        new EventType(.25, "You are depressed."),
                        new EventType(.30, "You feel happy."),
                        new EventType(.35, "You feel evil."),
                        new EventType(.40, "You feel generous."),
                        new EventType(.45, "You feel selfish."),
                        new EventType(.50, "You need attention from another person."),
                        new EventType(.55, "You need the comfort of home."),
                        new EventType(1, ""),
                    ],
                    0.1
                )
            ],
            true, // Event system enabled
            "Setting: Zombie post-apocalypse. Tone: Grim, Dark. Style: Gritty, Evocative, Fast Zombies.", // The default authors note for the setting.
            new ActionRate(
                .2, // The base starting rate for actions
                .2, // The maximum starting bonus
                .01 // The minimum starting bonus
            ),
        );

        if (!state.game) {
            state.game = GAME;
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
                state.game.ActionRate.starting + state.game.ActionRate.MaxBonusRate,
                {
                    // Allow action increase?
                    increaseEnabled: false,
                    // Allow action decrease?
                    decreaseEnabled: false,
                    // The actions maximum rate
                    maxRate: state.game.ActionRate.starting + state.game.ActionRate.MaxBonusRate,
                    // The actions minimum rate
                    minRate: state.game.ActionRate.starting + state.game.ActionRate.MaxBonusRate,
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
                ["charisma", "speech", "diplomacy", "talk", "speak", "converse"],
                ["persuasive", "charming", "convincing"],
                ["awkward", "unconvincing", "ineffectual"],
                "You speak with",
                "You try to be persuasive, but your words are",
                "You're too flustered to speak clearly!"
            ),// START action change section.
            new Action(
                ["fighting", "combat", "weapon", "hit", "strike", "attack"],
                ["brutal efficiency", "deadly precision", "unyielding resolve"],
                ["misjudged", "ineffective", "reckless"],
                "You attack with",
                "Your attack proves",
                "You could die!"
            ),
            new Action(
                ["movement", "move", "running", "jumping", "dodge"],
                ["agile", "graceful", "fluid"],
                ["unprepared", "reckless", "awkward"],
                "Your movement is successfully and",
                "Your attempt to move was",
                "You can't move anymore!"
            ),
            // End action change section.
        ];

        // Check if player state exists, if not, initialize
        if (!state.player) {
            state.player = {
                status: "",
                actions: ACTIONS
            }
        }
        // Ensure state.memory.authorsNote is blank and ready.
        if (!state.memory.authorsNote) {
            state.memory.authorsNote = "";
        }
        // Ensure state.message is blank and ready.
        state.message = "";
    }
    delphicBase(state, text, history, storyCards, info);

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
            state.player.actions.forEach(a => a.coolDown.failCount = 0);
            if (action.leveling.increaseEnabled) {
                action.rate = Math.min(action.rate + newRate, action.leveling.maxRate);
            }
        } else {
            if (action.coolDown.enabled) {
                action.coolDown.failureCount += 1;
                decreaseActionRate(action, calculate(isSuccess));
                if (action.coolDown.failureCount >= action.coolDown.threshold) {
                    action.coolDown.remainingTurns = action.coolDown.threshold;
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
     * The action command parse for use as command parse and entry point.
     * @param {string} text The user imputed text.
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
                action = getActionByName("charisma");
                activeTurn(false);
            } else {
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

    /**
     * Get currently active events.
    */
    const getEventSystem = () => {
        if (state.game.eventSystemEnabled) {
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

    /**
     * Gets the players status.
     * @returns The status.
     */
    const getPlayerStatus = () => {
        const status = [
            ...state.player.actions.filter(a => a.coolDown.enabled && a.coolDown.remainingTurns > 0).map(a => a.coolDownPhrase),
            state.player.status.trim(),
            suddenly().trim()]
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

    // Call and modify the front Memory so the information is only exposed to the AI for a single turn.
    actionParse(text);

    state.memory.authorsNote = [
        getPlayerStatus().trim(),
        ...(getEventSystem().map(s => s.trim())),
        state.game.authorsNote.trim()
    ].filter(e = e => e !== "").join(" ").trim();

    // Notify the player of the status.
    state.message += getPlayerStatusMessage();
    return { state, text, history, storyCards, info }
}
module.exports = oracle;