const tester = (state, text, history, storyCards, info) => {
        const actionMatch = /> (.*) ((?:try|tries|attempt|attempts) (?:to use (.*) to |to )|(?:say|says) ("(?:[^"]+)"))/i.test(text);

        if (!actionMatch) {
            return { state, text, history, storyCards, info }
        }
        const activePlayerName = actionMatch[1];
        const isDoAction = actionMatch[3] !== undefined && actionMatch === undefined;
        const isSpeechAction = actionMatch[4] !== undefined;

        const defaultActionRate = {
            starting: .4,
            MaxBonusRate: .2,
            MinBonusRate: .01,
            max: .95,
            min: .05
        }

        // This is the default rate for a new action.
        // Do not change this function.
        const startingActionRate = () => {
            return defaultActionRate.starting + (Math.random() * (defaultActionRate.MinBonusRate - defaultActionRate.MaxBonusRate) + defaultActionRate.MaxBonusRate)
        }

        const defaultAction = {
            name: ["default"],
            successEndings: ["masterful", "remarkable", "flawless"],
            failureEndings: ["clumsy", "inept", "futile"],
            successStart: "Successfully, you manage to be",
            failureStart: "Despite your efforts, you end up being",
            coolDownPhrase: "You are unable to!",
            note: "",
            rate: defaultActionRate.starting + defaultActionRate.MaxBonusRate,
            leveling: {
                increaseEnabled: false,
                decreaseEnabled: false,
                maxRate: defaultActionRate.starting + defaultActionRate.MaxBonusRate,
                minRate: defaultActionRate.starting + defaultActionRate.MaxBonusRate,
                rateOfChange: 0,
                rateOfChangeFailureMultiplier: 1,
                decreaseRate: 0
            },
            coolDown: {
                enabled: false,
                decreaseRatePerAction: 1,
                failureThreshold: 3,
                failureCount: 0,
                remainingTurns: 0
            },
            isResource: false,
            resource: null,
        };

        const defaultCharismaAction = {
            name: ["charisma", "speech", "diplomacy", "words", "speak", "converse", "influence", "charm", "convene", "convince", "coax", "reason", "persuade", "persuasion", "encourage", "encouragement", "win over", "assure", "reassure", "reassurance", "comfort", "intimidate"],
            successEndings: ["persuasive", "charm", "conviction"],
            failureEndings: ["awkward", "unconvincing", "ineffectual"],
            successStart: "You speak with",
            failureStart: "You try to be persuasive, but your words are",
            coolDownPhrase: "You're too flustered to speak clearly!",
            note: "",
            rate: .5,
            leveling: {
                increaseEnabled: true,
                decreaseEnabled: true,
                maxRate: .5,
                minRate: .5,
                rateOfChange: 0.01,
                rateOfChangeFailureMultiplier: 10,
                decreaseRate: 0.001 / 6
            },
            coolDown: {
                enabled: true,
                decreaseRatePerAction: 1,
                failureThreshold: 3,
                failureCount: 0,
                remainingTurns: 0
            },
            isResource: false,
            resource: null,

        };

        // Custom actions is an array of actions that can be added to the game. Define as many as you like, but make sure to lower the decreaseRate in the leveling object to match the number of actions including the charisma action but not the default action.
        const customActions = [
            {
                name: ["fighting", "combat", "weapon", "hit", "strike", "attack", "counter", "counterattack", "assault", "ambush"],
                successEndings: ["is brutal efficiency", "made with deadly precision", "has unyielding resolve"],
                failureEndings: ["misjudged", "ineffective", "reckless"],
                successStart: "The attack",
                failureStart: "Your attack proves",
                coolDownPhrase: "You could die!",
                note: "",
                rate: startingActionRate(),
                leveling: {
                    increaseEnabled: false,
                    decreaseEnabled: false,
                    maxRate: defaultActionRate.max,
                    minRate: defaultActionRate.min,
                    rateOfChange: 0.01,
                    rateOfChangeFailureMultiplier: 10,
                    decreaseRate: 0.001 / 6
                },
                coolDown: {
                    enabled: false,
                    decreaseRatePerAction: 1,
                    failureThreshold: 3,
                    failureCount: 0,
                    remainingTurns: 0
                },
                isResource: false,
                resource: null,
            },
            {
                name: ["movement", "move", "running", "jumping", "dodge", "agility", "muscle memory", "leap", "leaping", "sneak", "stealth", "climb", "climbing", "parry", "escape", "free yourself", "maneuver", "duck"],
                successEndings: ["agile", "graceful", "fluid"],
                failureEndings: ["unprepared", "reckless", "awkward"],
                successStart: "Your movement is successfully and",
                failureStart: "Your attempt to move was",
                coolDownPhrase: "You can't move anymore!",
                note: "",
                rate: startingActionRate(),
                leveling: {
                    increaseEnabled: false,
                    decreaseEnabled: false,
                    maxRate: defaultActionRate.max,
                    minRate: defaultActionRate.min,
                    rateOfChange: 0.01,
                    rateOfChangeFailureMultiplier: 10,
                    decreaseRate: 0.001 / 6
                },
                coolDown: {
                    enabled: false,
                    decreaseRatePerAction: 1,
                    failureThreshold: 3,
                    failureCount: 0,
                    remainingTurns: 0
                },
                isResource: false,
                resource: null,
            },
            {
                name: ["observe", "look", "watch", "inspect", "investigate", "examine", "listening", "hearing", "smell", "intuition", "analyze", "analysis", "deduce", "deduction", "decode", "assess", "sniff", "scent"],
                successEndings: ["perceptive", "attentive", "detailed"],
                failureEndings: ["overlooked", "distracted", "cursory"],
                successStart: "You observe carefully and",
                failureStart: "Despite your efforts to notice details, you are",
                coolDownPhrase: "Focus breaks and you miss crucial details!",
                note: "",
                rate: startingActionRate(),
                leveling: {
                    increaseEnabled: false,
                    decreaseEnabled: false,
                    maxRate: defaultActionRate.max,
                    minRate: defaultActionRate.min,
                    rateOfChange: 0.01,
                    rateOfChangeFailureMultiplier: 10,
                    decreaseRate: 0.001 / 6
                },
                coolDown: {
                    enabled: false,
                    decreaseRatePerAction: 1,
                    failureThreshold: 3,
                    failureCount: 0,
                    remainingTurns: 0
                },
                isResource: false,
                resource: null,
            },
            {
                name: ["performance", "dancing", "singing", "jokes"],
                successEndings: ["perceptive", "engaging", "lively"],
                failureEndings: ["overlooked", "distracted", "bland"],
                successStart: "The preform performance is ",
                failureStart: "Despite your efforts, you are",
                coolDownPhrase: "Focus breaks and your performance falls flat.",
                note: "",
                rate: startingActionRate(),
                leveling: {
                    increaseEnabled: false,
                    decreaseEnabled: false,
                    maxRate: defaultActionRate.max,
                    minRate: defaultActionRate.min,
                    rateOfChange: 0.01,
                    rateOfChangeFailureMultiplier: 10,
                    decreaseRate: 0.001 / 6
                },
                coolDown: {
                    enabled: false,
                    decreaseRatePerAction: 1,
                    failureThreshold: 3,
                    failureCount: 0,
                    remainingTurns: 0
                },
                isResource: false,
                resource: null,
            }
        ]

        // DO NOT CHANGE THIS FUNCTION!
        const defaultActions = () => {
            return [
                defaultAction,
                defaultCharismaAction,
                ...customActions
            ];
        }

        // DO NOT CHANGE THIS FUNCTION!
        const defaultPlayer = (name = "You") => {
            return {
                name: name,
                status: "",
                actions: defaultActions(),
                actionHistory: [],
                exhaustion: {
                    enabled: false,
                    threshold: 5,
                    inactive: 0,
                    active: 0,
                    message: "You are exhausted."
                },
                threat: {
                    enabled: false,
                    threshold: 5,
                    active: 0,
                    inactive: 0,
                    array: ["You feel a sense of dread."]
                }
            }
        }

        // This section can be customized to fit the needs of the game.

        /**
         * Represents the default game configuration.
         *
         * @typedef {Object} defaultGame
         * @property {boolean} dynamicActions - Indicates whether dynamic actions are enabled.
         * @property {boolean} enableReputationSystem - Indicates whether the reputation system is enabled.
         * @property {boolean} enableSayCharismaCheck - Indicates whether the charisma check is enabled.
         * @property {Object[]} eventSystem - An array of event systems.
         * @property {string} eventSystem.name - The name of the event system.
         * @property {Object[]} eventSystem.events - An array of events within the event system.
         * @property {number} eventSystem.events.chance - The chance of the event occurring.
         * @property {string} eventSystem.events.description - The description of the event.
         * @property {number} eventSystem.chance - The chance of the event system occurring.
         * @property {Object} eventSystem.current - The current event within the event system.
         * @property {number} eventSystem.current.chance - The chance of the current event occurring.
         * @property {string} eventSystem.current.description - The description of the current event.
         * @property {boolean} eventSystem.isRandom - Indicates whether the event is random.
         * @property {boolean} eventSystemEnabled - Indicates whether the event system is enabled.
         * @property {string} authorsNote - The author's note for the game. Do not use Author's Note in the UI interface as this overrides the author's notes seen in the UI.
         * @property {Object} actionRate - The action rate configuration.
         * @property {number} actionRate.starting - The starting base action rate for new actions.
         * @property {number} actionRate.MaxBonusRate - The maximum bonus rate for new actions.
         * @property {number} actionRate.MinBonusRate - The minimum bonus rate for new action.
         * @property {Object[]} players - An array of players. Leave blank unless you are setting up for a dynamic player system, or you have a specific player in mind. This is also for setting up for multiplayer games.
         * @property {boolean} isDynamicPlayersEnabled - Indicates whether dynamic players are enabled.
         * @property {Object[]} resources - An array of resources. This is dynamic and can have any custom resources.
         * @property {boolean} enablePlayerMessage - Indicates whether player messages are enabled.
         * @property {Object[]} messages - An array of messages, this is for game state management and to be left as a empty array.
         */
        const defaultGame = {
            dynamicActions: false,
            enableReputationSystem: true,
            enableSayCharismaCheck: true,
            eventSystem: [
                {
                    name: "Natural Weather",
                    events: [
                        { chance: .05, description: "It is thundering outside." },
                        { chance: .1, description: "There are clouds and precipitation outside." },
                        { chance: .15, description: "There are clouds outside." },
                        { chance: .25, description: "There is a thick fog outside." },
                        { chance: 1, description: "It is clear outside." }
                    ],
                    chance: 0.1,
                    current: { chance: .05, description: "It is thundering outside." },
                    description: "It is thundering outside.",
                    isRandom: true
                },
            ],
            eventSystemEnabled: true,
            authorsNote: "Style Keywords: Light, breezy, punchy, whimsical, comedic. Structure Keywords: Rapid, dynamic, action - packed, lively interactions, visual. Bad things are allowed to happen to the protagonist and other important characters. The protagonist is allowed to struggle or even fail. It is forbidden to directly state character emotions; instead, convey them via behavior and body language. Characters are allowed to disagree with the protagonist and follow their own goals. Villains should not capitulate as soon as the protagonist uses logic.Villains have reasons for what they do, and will generally continue opposing the protagonist regardless.",
            players: [defaultPlayer()],
            isDynamicPlayersEnabled: true,
            resources: [],
            enablePlayerMessage: false,
            messages: []
        };

        // DO NOT CHANGE ANYTHING BELOW THIS LINE!
        // Helper functions
        function getRandomItem(arr) {
            return arr[Math.floor(Math.random() * arr.length)] || arr[0];
        }

        const changeEvent = (eventSystem) => {
            if (Math.random() < eventSystem.chance) {
                if (eventSystem.isRandom) {
                    const random = Math.random();
                    eventSystem.events.every(e => {
                        if (random < e.chance) {
                            eventSystem.current = e;
                            eventSystem.description = e.description;
                            return false;
                        }
                    });
                } else {
                    eventSystem.current = getNextItem(eventSystem.events, eventSystem.events.indexOf(e => e.description === eventSystem.current.description));
                }
            }
        }

        const getNextItem = (arr, currentIndex) => {
            if (!arr.length) {
                throw new Error('Array cannot be empty.');
            }
            // Ensure the currentIndex is within the array bounds
            currentIndex = currentIndex % arr.length;
            return arr[(currentIndex + 1) % arr.length];
        }

        /**
         * The starting action rates.
         * @param {number} starting The minimum value for an action.
         * @param {number} MaxBonusRate The max starting bonus rate.
         * @param {number} MinBonusRate The min starting bonus rate.
         */
        class ActionRate {
            constructor(actionRate) {
                this.starting = actionRate.starting;
                this.MaxBonusRate = actionRate.MaxBonusRate;
                this.MinBonusRate = actionRate.MinBonusRate;
            }
        }

        /**
         * The event for the event system.
         * @param {number} chance The chance this can be the event
         * @param {string} description The description of the event to be presented to the AI
         */
        class EventType {
            constructor(eventType) {
                this.chance = eventType.chance;
                this.description = eventType.description;
            }
        }

        /**
         * An event system.
         * @param {string} name The name of id to find the event.
         * @param {EventType} events An array of events posable in this scenario.
         * @param {*} chance The likelihood of the event changing.
         */
        class EventSystem {
            constructor(eventSystem) {
                this.name = eventSystem.name;
                this.events = eventSystem.events;
                this.chance = eventSystem.chance;
                this.current = eventSystem.current;
                this.description = eventSystem.description;
                this.isRandom = eventSystem.isRandom;
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
            constructor(exhaustion) {
                this.enabled = exhaustion.enabled;
                this.threshold = exhaustion.threshold;
                this.inactive = exhaustion.inactive;
                this.active = exhaustion.active;
                this.message = exhaustion.message;
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
            constructor(threat) {
                this.enabled = threat.enabled;
                this.threshold = threat.threshold;
                this.active = threat.active;
                this.inactive = threat.inactive;
                this.array = threat.array;
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
            constructor(leveling) {
                this.increaseEnabled = leveling.increaseEnabled;
                this.decreaseEnabled = leveling.decreaseEnabled;
                this.maxRate = leveling.maxRate;
                this.minRate = leveling.minRate;
                this.rateOfChange = leveling.rateOfChange;
                this.rateOfChangeFailureMultiplier = leveling.rateOfChangeFailureMultiplier;
                this.decreaseRate = leveling.decreaseRate;
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
            constructor(coolDown) {
                this.enabled = coolDown.enabled;
                this.decreaseRatePerAction = coolDown.decreaseRatePerAction;
                this.failureThreshold = coolDown.failureThreshold;
                this.failureCount = coolDown.failureCount;
                this.remainingTurns = coolDown.remainingTurns;
            }
        }

        class ActionHistory {
            constructor(actionHistory) {
                this.actionCount = actionHistory.actionCount;
                this.name = actionHistory.name;
            }
        }

        class ResourceThreshold {
            constructor(resourceThreshold) {
                this.threshold = resourceThreshold.threshold;
                this.message = resourceThreshold.message;
            }
        }

        class Resource {
            constructor(resource) {
                this.type = resource.type;
                this.isIncreased = resource.isIncreased;
                this.value = resource.value;
                this.max = resource.max;
                this.min = resource.min;
                this.rate = resource.rate;
                this.isCritical = resource.isCritical;
                this.isConsumable = resource.isConsumable;
                this.isRenewable = resource.isRenewable;
                this.thresholds = resource.thresholds;
            }
        }

        class ActionResource {
            constructor(actionResource) {
                this.type = actionResource.type;
                this.isIncreasing = actionResource.isIncreasing;
                this.modify = actionResource.modify;
            }
        }

        class Action {
            constructor(action) {
                this.name = action.name;
                this.successEndings = action.successEndings;
                this.failureEndings = action.failureEndings;
                this.successStart = action.successStart;
                this.failureStart = action.failureStart;
                this.coolDownPhrase = action.coolDownPhrase;
                this.note = action.note;
                this.rate = action.rate;
                this.leveling = action.leveling;
                this.coolDown = action.coolDown;
                this.memorable = action.memorable;
                this.knownFor = action.knownFor;
                this.memorableThreshold = action.memorableThreshold;
                this.isResource = action.isResource;
                this.resource = action.resource;
            }
        }

        class PlayerActivity {
            constructor(playerActivity) {
                this.exhaustion = playerActivity.exhaustion;
                this.threat = playerActivity.threat;
            }
        }

        /**
         * Represents a player in the game.
         * @class
         */
        class Player {
            constructor(player) {
                this.name = player.name;
                this.status = player.status;
                this.actions = player.actions;
                this.actionHistory = player.actionHistory;
                this.exhaustion = player.exhaustion;
                this.threat = player.threat;
            }
        }

        class Game {
            constructor(game) {
                this.dynamicActions = game.dynamicActions;
                this.enableReputationSystem = game.enableReputationSystem;
                this.enableSayCharismaCheck = game.enableSayCharismaCheck;
                this.eventSystem = game.eventSystem;
                this.eventSystemEnabled = game.eventSystemEnabled;
                this.authorsNote = game.authorsNote;
                this.actionRate = game.actionRate;
                this.players = game.players;
                this.resources = game.resources;
                this.enablePlayerMessage = game.enablePlayerMessage;
                this.messages = game.messages;
            }
        }

        const delphicBase = () => {
            // Set the default game state
            if (!state.game) {
                state.game = defaultGame;
            }
            // Ensure state.memory.authorsNote is blank and ready.
            state.memory.authorsNote = "";
            // Ensure state.memory.frontMemory is blank and ready.
            state.memory.frontMemory = "";
            // Ensure state.message is blank and ready.
            state.message = undefined;
        }

        delphicBase();

        const game = new Game(state.game);

        const getActionByName = name => {
            if (game.dynamicActions && name !== "default" && name !== "charisma" && name !== "") {
                let action = activePlayer.actions.find(action => action.name.includes(name.toLowerCase()));
                if (!action) {
                    // If skill does not exist, create it with default attributes.
                    let names = [];
                    names.push(name.toLowerCase());
                    action = new Action(names);
                    activePlayer.actions.push(action); // Add the new action to the actions array
                }
                return action;
            }
            return activePlayer.actions.find(action => action.name.includes(name.toLowerCase())) || activePlayer.actions[0];
        }

        // Adjust a action's success rate dynamically based on outcome
        const setActionState = (action, isSuccess) => {
            // Increase the action rate more significantly the lower the current action level is.
            const calculateNewRate = isSuccess => {
                return action.leveling.rateOfChange * (1 + ((action.rate * isSuccess ? 1 : action.leveling.rateOfChangeFailureMultiplier) / action.leveling.maxRate));
            }
            adjustActionLevel(action, calculateNewRate(isSuccess), isSuccess);
            adjustActionCoolDown(action, isSuccess);
        }

        const adjustActionCoolDown = (action, isSuccess) => {
            if (action.coolDown.enabled) {
                if (isSuccess) {
                    activePlayer.actions.forEach(a => a.coolDown.failCount = 0);
                } else {
                    action.coolDown.failureCount += 1;
                    if (action.coolDown.failureCount >= action.coolDown.threshold) {
                        action.coolDown.remainingTurns = action.coolDown.threshold;
                    }
                }
            }
        }

        const adjustActionLevel = (action, newRate, isSuccess) => {
            if (isSuccess && action.leveling.increaseEnabled) {
                checkWithinBounds(newRate, action.leveling.maxRate);
            }
            if (!isSuccess && action.leveling.decreaseEnabled) {
                checkWithinBounds(newRate, action.leveling.minRate);
            }
        }

        /**
         * Determine success or failure of a action
         * @param {action} action The action to check.
         * @returns {boolean} The success or failure of the action check.
         */
        const determineFate = (action) => {
            if (action.coolDown.enabled && (action.coolDown.remainingTurns > 0)) {
                return false;
            }
            const success = Math.random() < action.rate;
            if (success) {
                processReputation(action);
            }
            setActionState(action, success);
            const message = success ? `${action.name[0]} check succeeded.` : `${action.name[0]} check failed.`
            game.messages = [message];
            return success;
        }

        /**
         * Gets the phrase
         * @param {action} action The action to get the phrase from.
         * @returns The phrase relent to the actions success or failure.
         */
        const getPhrase = (action, isSuccess) => {
            const note = action.note !== "" ? ` [${action.name[0]} Action Note: ${action.note}]` : "";
            return note + (isSuccess
                ? `${action.successStart} ${getRandomItem(action.successEndings)}.` : `${action.failureStart} ${getRandomItem(action.failureEndings)}!`);
        }

        /**
         * Process all the actions providing an update to each non active action.
         * @param {string} name The Name of the action being used actively and action being ignored for updates.
         */
        const processActionsCoolDown = (name) => {
            activePlayer.actions.forEach(a => {
                if (a.name !== name && a.coolDown > 0) {
                    a.coolDown += -a.coolDown.decreaseRatePerAction;
                }
            });
        }

        const processActionResource = (action) => {
            if (action.isResource && action.resource.type !== "") {
                const resource = activePlayer.resources.find(r => r.type === action.resource.type);
                if (resource) {
                    if (action.resource.isIncreasing) {
                        resource.value += action.resource.modify;
                    } else {
                        resource.value -= action.resource.modify;
                    }
                    resource.value = Math.min(resource.max, Math.max(resource.min, resource.value));
                    resource.thresholds.forEach(t => {
                        if (resource.value >= t.threshold) {
                            game.messages.push(t.message);
                        }
                    });
                }
            }
        }

        const getPlayerByName = name => {
            if (game.isDynamicPlayersEnabled) {
                let player = game.players.find(p => p.name.includes(name));
                if (!player) {
                    // If skill does not exist, create it with default attributes.
                    let names = [];
                    names.push(name);
                    player = new Player(defaultPlayer());
                    game.players.push(player); // Add the new action to the actions array
                }
                return player;
            }
            return game.players.find(p => p.name.includes(name)) || game.players[0];
        }

        /**
         * Logic for handling the player exhaustion.
         * @param {boolean} active If the player turn is an active one.
         */
        const processPlayerActivity = (active) => {
            if (!activePlayer.exhaustion.enabled) return;
            if (active) {
                activePlayer.exhaustion.inactive = 0;
                activePlayer.exhaustion.active = checkWithinBounds(activePlayer.exhaustion.active + 1, 0, Number.MAX_SAFE_INTEGER);
                activePlayer.threat.active = checkWithinBounds(activePlayer.threat.active + 1, 0, Number.MAX_SAFE_INTEGER);
                activePlayer.threat.inactive = checkWithinBounds(activePlayer.threat.inactive - 1, 0, Number.MAX_SAFE_INTEGER);
            } else {
                activePlayer.exhaustion.active = 0;
                activePlayer.exhaustion.inactive = checkWithinBounds(activePlayer.exhaustion.inactive + 1, 0, Number.MAX_SAFE_INTEGER);
                activePlayer.threat.active = checkWithinBounds(activePlayer.threat.active - 1, 0, Number.MAX_SAFE_INTEGER);
            }

            if (activePlayer.inactive > activePlayer.exhaustion.threshold) {
                activePlayer.status = "";
            } else if (activePlayer.exhaustion.active > activePlayer.exhaustion.threshold) {
                activePlayer.status = `[${activePlayer.exhaustion.message}]`;
            } else {
                activePlayer.status = "";
            }
        }

        /**
         * The action command parse for use as command parse and entry point.
         * @param {string} text The user imputed text.
         */
        const actionParse = () => {
            if (isDoAction && !isSpeechAction) {ß
                const action = getActionByName((actionMatch[3] || "default"));
                processActionResource(action);
                processActionsCoolDown(action.name[0]);
                return getPhrase(action, determineFate(action));
            } else if (isSpeechAction && game.enableSayCharismaCheck) {
                // If speech is captured
                const action = getActionByName("charisma");
                processPlayerActivity(false);
                processActionsCoolDown(action.name[0]);
                return getPhrase(action, determineFate(action));
            } else {
                processPlayerActivity(false);
                return "";  // No relevant action found
            }
            return "";
        }

        const processReputation = (action) => {
            if (game.enableReputationSystem && (Math.random() < action.memorable)) {
                activePlayer.actionHistory.push(new ActionHistory(action.name[0], info.actionCount));
                activePlayer.actionHistory = activePlayer.actionHistory.filter(ah => ah.actionCount > Math.max(0, info.actionCount - 50))
            }
        }

        /**
         * Accounts for both an upper and lower bound
         *
         * @param {number} number number to check
         * @param {number} lowerBound
         * @param {number} upperBound
         * @returns Adjusted number
         *  ----------------------------------
         * Accounts only for the lower bound
         * @param {number} number number to check
         * @param {number} lowerBound required
         * @returns Adjusted number
         */
        const checkWithinBounds = (number, lowerBound, upperBound) => {
            if (upperBound === undefined) {
                return Math.max(number, lowerBound);
            } else {
                return Math.min(Math.max(number, lowerBound), upperBound);
            }
        }

        /**
         * Get currently active events.
        */
        const getEventSystem = () => {
            if (game.eventSystemEnabled) {
                return game.eventSystem.map(e => e.description);
            }
            return [];
        }

        const suddenly = () => {
            if (!activePlayer.threat.enabled) return "";
            const activity = Math.max(activePlayer.threat.active, activePlayer.threat.inactive);
            if (activity < activePlayer.threat.threshold) {
                // add to authors notes
                return getRandomItem(activePlayer.threat.array);
            }
            return "";
        }

        /**
         * Gets the players status.
         * @returns The status.
         */
        const getPlayerStatus = () => {
            const status = [
                ...activePlayer.actions.filter(a => a.coolDown.enabled && a.coolDown.remainingTurns > 0).map(a => a.coolDownPhrase),
                ...game.players.map(a => a.status.trim()),
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
            const status = activePlayer.actions.filter(a => a.coolDown.enabled && a.coolDown.remainingTurns > 0)
                .map(a => `${a.name[0]} is cooling down for ${a.coolDown.remainingTurns} turns. Causing: "${a.coolDownPhrase}"`);
            if (status.length > 0) {
                return status;
            }
            return "";
        }

        const getReputation = () => {
            let rep = [];
            activePlayer.actions.forEach(action => {
                const triggeredRep = activePlayer.actionHistory.filter(ah => ah.name === action.name[0]);
                if (triggeredRep.length > action.memorableThreshold) {
                    rep.push(action.knownFor);
                }
            });
            return rep;
        }

        const getResourceThresholds = () => {
            let thresholds = [];
            game.resources.forEach(r => {
                let lastThresholdMessage = null;
                r.thresholds.forEach(t => {
                    if (r.value >= t.threshold) {
                        lastThresholdMessage = t.message;
                    }
                });
                if (lastThresholdMessage !== null) {
                    thresholds.push(lastThresholdMessage);
                }
            });
            return thresholds;
        }

        // Call and modify the front Memory so the information is only exposed to the AI for a single turn.
        const activePlayer = getPlayerByName(activePlayerName);
        game.eventSystem.forEach(e => changeEvent(e));
        state.memory.frontMemory = actionParse();
        console.log(state.memory.frontMemory);

        state.memory.authorsNote = [
            getPlayerStatus(),
            ...getEventSystem(),
            ...getReputation(),
            ...getResourceThresholds(),
            game.authorsNote,
        ].filter(e = e => e !== "").join(" ").trim();

        // Notify the player of the status.
        if (game.enablePlayerMessage) {
            state.message = [game.messages, ...getPlayerStatusMessage()].filter(m => m !== "").join("\n").trim();
            game.messages = [];
        }
        state.game = game;

    return { state, text, history, storyCards, info }
}
module.exports = tester;