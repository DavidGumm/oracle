// ++++++++++++++++++++++++
// ++++++++++++++++++++++++
// DO NOT EDIT THIS SECTION
// ++++++++++++++++++++++++
// ++++++++++++++++++++++++

// This is the default rate for a new action.
// Do not change this function, change the values in defaultActionRate.
// Helper functions
const getRandomItem = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)] || arr[0];
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

const startingActionRate = (starting, min, max) => {
    return starting + (Math.random() * (min - max) + max)
}

const getIsOrAre = (who) => {
    switch (who) {
        case "You":
            return "are";
        case "I":
            return "am";
        default:
            return "is";
    }
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
 * Represents an event system.
 * @class
 */
class EventSystem {
    /**
     * Represents a constructor for the event system.
     * @param {Object} eventSystem - The event system object.
     * @param {string} eventSystem.name - The name of the event system.
     * @param {Array} eventSystem.events - The events associated with the event system.
     * @param {number} eventSystem.chance - The chance of an event changing.
     * @param {number} eventSystem.current - The current event.
     * @param {string} eventSystem.description - The description of the event system.
     * @param {boolean} eventSystem.isRandom - Indicates if events are chosen randomly or in sequence.
     */
    constructor(eventSystem) {
        this.name = eventSystem.name;
        this.events = eventSystem.events.map(e => new EventType(e));
        this.chance = eventSystem.chance;
        this.current = eventSystem.current;
        this.description = eventSystem.description;
        this.isRandom = eventSystem.isRandom;
    }
    changeEvent() {
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
    increase() {
        if (this.enabled) {
            this.remainingTurns = Math.max(this.failureThreshold, this.remainingTurns + 1);
            if (this.failureCount >= this.failureThreshold) {
                this.remainingTurns = this.failureThreshold;
            }
        }
    }
    decrease() {
        if (this.enabled) {
            this.remainingTurns = Math.max(0, this.remainingTurns - this.decreaseRatePerAction);
        }
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
        this.thresholds = resource.thresholds.map(t => new ResourceThreshold(t));
    }
}

class ActionResource {
    constructor(actionResource) {
        this.type = actionResource.type;
        this.isIncreasing = actionResource.isIncreasing;
        this.onSuccess = actionResource.onSuccess;
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
        this.rate = parseFloat(action.rate);
        this.leveling = new Leveling(action.leveling);
        this.coolDown = new CoolDown(action.coolDown);
        this.memorable = action.memorable;
        this.knownFor = action.knownFor;
        this.memorableThreshold = action.memorableThreshold;
        this.isResource = action.isResource;
        this.resource = new ActionResource(action.resource);
        this.preventAction = [];
    }

    /**
     * Gets the phrase for the action.
     * For example, "You try to move the rock. and You successfully, manage to be masterful."
     * @param {Boolean} isSuccess
     * @returns {String} The phrase for the action.
     */
    getPhrase(isSuccess) {
        const note = this.note !== "" ? ` [${this.name[0]} Action Note: ${this.note}]` : "";
        const adjective = getRandomItem(isSuccess ? this.successEndings : this.failureEndings);
        const message = `${isSuccess ? this.successStart : this.failureStart} ${adjective}${note}${isSuccess ? "." : "!"}`;
        return (isSuccess ? " And " : " But ") + message;
    }

    updateRate(isSuccess, isIncrease) {
        if (this.leveling.increaseEnabled && isIncrease) {
            const newRate = this.rate + (this.leveling.rateOfChange * (isSuccess ? 1 : this.leveling.rateOfChangeFailureMultiplier));
            this.rate = Math.max(this.leveling.maxRate, newRate);
        }
        if (this.leveling.decreaseEnabled && !isIncrease) {
            this.rate = Math.min(this.leveling.minRate, this.rate - this.leveling.decreaseRate);
        }
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
        this.resources = player.resources.map(r => new Resource(r));
        this.actions = player.actions.map(a => new Action(a));
        this.actionHistory = player.actionHistory.map(a => new ActionHistory(a));
        this.eventSystem = player.eventSystem.map(e => new EventSystem(e));
        this.exhaustion = new Exhaustion(player.exhaustion);
        this.threat = new Threat(player.threat);
    }

    updateActions(isActiveTurn, action, isSuccess) {
        if (action) {
            this.actions.forEach(currentAction => {
                currentAction.updateRate(isSuccess, currentAction.name.includes(action.name[0]));
            });
        }
    }

    getCoolDownPhrase() {
        return this.actions.filter(a => a.coolDown.remainingTurns > 0 && a.coolDown.enabled).map(a => a.coolDownPhrase).filter(e =>e!="");
    }

    getStatus() {
        const exhaustion = this.exhaustion.enabled && this.exhaustion.active > this.exhaustion.threshold ? this.exhaustion.message : "";
        const status = [
            exhaustion,
            ...this.getCoolDownPhrase(),
            ...this.getReputation(),
            ...this.getResourceThresholds()
        ].filter(e => e !== "").join(", ").trim()


        return status.length > 0 ? `[${this.name} ${getIsOrAre(this.name)}, ${status}.]` : "";
    }

    getReputation() {
        let rep = [];
        this.actions.forEach(a => {
            const triggeredRep = this.actionHistory.filter(ah => ah.name === a.name[0]);
            if (triggeredRep.length > a.memorableThreshold) {
                rep.push(a.knownFor);
            }
        });
        return rep;
    }

    getResourceThresholds() {
        return this.resources.map(r => r.thresholds.find(t => r.value <= t.threshold)).filter(e => e).map(e => e.message);
    }

    setResources(isActiveTurn, action, isSuccess) {
        if (action && action.isResource) {
            const resource = this.resources.find(r => r.type === action.resource.type);
            if (action.resource.isIncreasing && action.resource.onSuccess && isSuccess) {
                resource.value = Math.min(resource.max, resource.value + action.resource.modify);
            }
            if (!action.resource.isIncreasing && (action.resource.onSuccess && isSuccess)) {
                resource.value = Math.max(resource.min, resource.value - action.resource.modify);
            }
            if (action.resource.isIncreasing && !action.resource.onSuccess && !isSuccess) {
                resource.value = Math.min(resource.max, resource.value + action.resource.modify);
            }
            if (!action.resource.isIncreasing && !action.resource.onSuccess && !isSuccess) {
                resource.value = Math.max(resource.min, resource.value - action.resource.modify);
            }
        }
    }
}

class Game {
    constructor(game) {
        this.dynamicActions = game.dynamicActions;
        this.enableReputationSystem = game.enableReputationSystem;
        this.enableSayCharismaCheck = game.enableSayCharismaCheck;
        this.isDynamicPlayersEnabled = game.isDynamicPlayersEnabled;
        this.eventSystem = game.eventSystem.map(e => new EventSystem(e));
        this.eventSystemEnabled = game.eventSystemEnabled;
        this.authorsNote = game.authorsNote;
        this.actionRate = new ActionRate(game.actionRate);
        this.players = game.players.map(p => new Player(p));
        this.resources = game.resources.map(r => new Resource(r));
        this.enablePlayerMessage = game.enablePlayerMessage;
        this.messages = game.messages;
        this.actionHistorySize = game.actionHistorySize;
    }
}
// ++++++++++++++++++++++++
// ++++++++++++++++++++++++
// END DO NOT EDIT SECTION
// ++++++++++++++++++++++++
// ++++++++++++++++++++++++


// ++++++++++++++++++++++++
// ++++++++++++++++++++++++
// START EDIT SECTION
// ++++++++++++++++++++++++
// ++++++++++++++++++++++++

// Notes: The more you add the larger the game state will be. Keep that in mind when adding new actions.
// I have not tested the system with more than 5 actions. If you add more, you may need to adjust the decrease rate in the leveling object to match the number of actions.
// Testing is recommended after adding new actions to ensure the system is working as expected.
// The system is designed to be flexible and allow for a wide range of actions and systems to be added.

// This section can be customized to fit the need of the game.
// Change the values below to fractions of a whole number to affect the script.
const defaultActionRate = {
    starting: .3, // I recommend this be set to .5 for easy and .2 for hard.
    MaxBonusRate: .2,
    MinBonusRate: .01
}

// Feel free to change the values below to customize the default action but only the text values except for the name default.
const defaultAction = {
    // The name of the action, this is default name and should not be changed.
    name: ["default"],
    // The success endings for the action.
    // Add as many as you like but keep one in the array.
    // The system randomly selects one of the endings for the action.
    successEndings: ["masterful", "remarkable", "flawless"],
    // Add as many as you like but keep one in the array.
    // The system randomly selects one of the endings for the action.
    failureEndings: ["clumsy", "inept", "futile"],
    // The start of the success message as seen by the AI.
    // The message is combined with the success ending to form the full message.
    // Example: "You try to move the rock. and You successfully, manage to be masterful."
    // Example: "Bob tries to move the rock. and Bob successfully, manage to be masterful."
    successStart: "successfully, manage to be",
    // The start of the failure message as seen by the AI.
    // The message is combined with the failure ending to form the full message.
    // Example: "You try to move the rock. and You failing, it ends up being clumsy."
    // Example: "Bob tries to move the rock. and Bob failing, it ends up being futile."
    failureStart: "fail, managing to be",
    // The message to display when the action is on cool down.
    coolDownPhrase: "unable to act",
    // The note for the action, that are added to author notes for special actions.
    // This is a good place to add special rules for the action.
    note: "",
    // The rate of success for the action.
    // For both success and failure, the rate should be between the min and max for action rate.
    rate: defaultActionRate.starting + defaultActionRate.MaxBonusRate,
    leveling: {
        // Allow the action to increase in rate.
        // This is disabled for the default action.
        increaseEnabled: false,
        // Allow the action to decrease in rate.
        // This is disabled for the default action.
        decreaseEnabled: false,
        // The max rate for the action.
        maxRate: defaultActionRate.starting + defaultActionRate.MaxBonusRate,
        // The min rate for the action.
        minRate: defaultActionRate.starting + defaultActionRate.MaxBonusRate,
        // The rate of change for the action.
        // IE how much the action rate changes per leveling event.
        rateOfChange: 0,
        // The rate of change multiplier for failure.
        // This is used to increase the rate of change for failure action.
        // This should be a positive number or fraction.
        rateOfChangeFailureMultiplier: 1,
        // The rate of decrease for the action.
        // This is used to decrease the rate of the action over time due to inactivity.
        decreaseRate: 0
    },
    coolDown: {
        // Enable the cool down system for the action.
        // This is disabled for the default action.
        enabled: false,
        // The rate at which the cool down decreases.
        decreaseRatePerAction: 1,
        // The failure threshold for the cool down system.
        failureThreshold: 3,
        // The current count of failures.
        failureCount: 0,
        // How many turns the action is on cool down.
        remainingTurns: 0
    },
    // Is the action memorable.
    // This is used to track the actions that are memorable.
    memorable: true,
    // What the player is known for.
    // This is used to track the actions that are memorable.
    // This is added to player status if the action is memorable and the player has triggered the memorable threshold.
    knownFor: "being average",
    // The threshold for the action to be memorable.
    memorableThreshold: 3,
    // Is the action a resource action.
    isResource: false,
    // The resource the action affects.
    resource: {},
    preventAction: [],
};

// Feel free to change the values below to customize the default charisma action but only the text values except for the name charisma.
const defaultCharismaAction = {
    name: ["charisma", "speech", "diplomacy", "words", "speak", "converse", "influence", "charm", "convene", "convince", "coax", "reason", "persuade", "persuasion", "encourage", "encouragement", "win over", "assure", "reassure", "reassurance", "comfort", "intimidate"],
    successEndings: ["persuasive", "charming", "full of conviction"],
    failureEndings: ["awkward", "unconvincing", "ineffectual"],
    successStart: "the words are",
    failureStart: "the words are",
    coolDownPhrase: "unable to make sense",
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
        remainingTurns: 3
    },
    memorable: true,
    knownFor: "a skilled linguist",
    memorableThreshold: 3,
    isResource: false,
    resource: {},
    preventAction: [],
};

// Custom actions is an array of actions that can be added to the game. Define as many as you like, but make sure to lower the decreaseRate in the leveling object to match the number of actions including the charisma action but not the default action.
const customActions = [
    {
        // This is an example of a custom action.
        // The name of the action, this is what will trigger the system to use this action.
        // Add as many names as you like, but the first name should be the primary name.
        name: ["fighting", "combat", "weapon", "hit", "strike", "attack", "counter", "counterattack", "assault", "ambush"],
        successEndings: ["brutal efficiency", "deadly precision", "unyielding determination"],
        failureEndings: ["misjudged", "ineffective", "reckless"],
        successStart: "the attack is make with ",
        failureStart: "the attack proves",
        coolDownPhrase: "venerable to attack",
        note: "",
        rate: startingActionRate(defaultActionRate.starting, defaultActionRate.min, defaultActionRate.max),
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
            remainingTurns: 3
        },
        memorable: true,
        knownFor: "a skilled fighter",
        memorableThreshold: 3,
        isResource: true,
        resource: {
            type: "health",
            isIncreasing: false,
            modify: 3,
            onSuccess: false
        },
        preventAction: [],
    },
    {
        name: ["movement", "move", "running", "jumping", "dodge", "agility", "muscle memory", "leap", "leaping", "sneak", "stealth", "climb", "climbing", "parry", "escape", "free yourself", "maneuver", "duck"],
        successEndings: ["agile", "graceful", "fluid"],
        failureEndings: ["unprepared", "reckless", "awkward"],
        successStart: "Your movement is successfully and",
        failureStart: "Your attempt to move was",
        coolDownPhrase: "barely able to move",
        note: "",
        rate: startingActionRate(defaultActionRate.starting, defaultActionRate.min, defaultActionRate.max),
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
        memorable: true,
        knownFor: "a skilled mover",
        memorableThreshold: 3,
        isResource: false,
        resource: {},
        preventAction: [],
    },
    {
        name: ["observe", "look", "watch", "inspect", "investigate", "examine", "listening", "hearing", "smell", "intuition", "analyze", "analysis", "deduce", "deduction", "decode", "assess", "sniff", "scent"],
        successEndings: ["perceptive", "attentive", "detailed"],
        failureEndings: ["overlooked", "distracted", "cursory"],
        successStart: "You observe carefully and",
        failureStart: "Despite your efforts to notice details, you are",
        coolDownPhrase: "unable to focus",
        note: "",
        rate: startingActionRate(defaultActionRate.starting, defaultActionRate.min, defaultActionRate.max),
        leveling: {
            increaseEnabled: true,
            decreaseEnabled: true,
            maxRate: defaultActionRate.max,
            minRate: defaultActionRate.min,
            rateOfChange: 0.01,
            rateOfChangeFailureMultiplier: .5,
            decreaseRate: 0.001 / 6
        },
        coolDown: {
            enabled: true,
            decreaseRatePerAction: 1,
            failureThreshold: 3,
            failureCount: 0,
            remainingTurns: 0
        },
        memorable: true,
        knownFor: "a keen observer",
        memorableThreshold: 3,
        isResource: false,
        resource: {},
        preventAction: [],
    },
    {
        name: ["performance", "dancing", "singing", "jokes"],
        successEndings: ["perceptive", "engaging", "lively"],
        failureEndings: ["overlooked", "distracted", "bland"],
        successStart: "The preform performance is ",
        failureStart: "Despite your efforts, you are",
        coolDownPhrase: "preforming poorly",
        note: "",
        rate: startingActionRate(defaultActionRate.starting, defaultActionRate.min, defaultActionRate.max),
        leveling: {
            increaseEnabled: true,
            decreaseEnabled: true,
            maxRate: defaultActionRate.max,
            minRate: defaultActionRate.min,
            rateOfChange: 0.01,
            rateOfChangeFailureMultiplier: 3,
            decreaseRate: 0.001 / 6
        },
        coolDown: {
            enabled: true,
            decreaseRatePerAction: 1,
            failureThreshold: 3,
            failureCount: 0,
            remainingTurns: 0
        },
        memorable: true,
        knownFor: "a skilled performer",
        memorableThreshold: 3,
        isResource: false,
        resource: {},
        preventAction: [],
    },
    {
        name: ["first-aid", "medicine", "medical"],
        successEndings: ["life saving", "skillful", "precise"],
        failureEndings: ["misjudged", "ineffective", "reckless"],
        successStart: "The first-aid",
        failureStart: "Your first-aid proves",
        coolDownPhrase: "are out of first-aid supplies",
        note: "",
        rate: startingActionRate(defaultActionRate.starting, defaultActionRate.min, defaultActionRate.max),
        leveling: {
            increaseEnabled: true,
            decreaseEnabled: true,
            maxRate: defaultActionRate.max,
            minRate: defaultActionRate.min,
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
        memorable: true,
        knownFor: "a skilled healer",
        memorableThreshold: 3,
        isResource: true,
        resource: {
            type: "health",
            isIncreasing: true,
            modify: 3,
            onSuccess: true
        },
        preventAction: [],
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

const defaultPlayerYou = {
    // The name of the player.
    name: "You",
    // The status of the player.
    status: "",
    // The size of the Action history.
    // The more actions the player can take the larger this number should be, or the longer the history.
    // A long history is best used with lots of actions or high thresholds for memorable actions.
    actionHistorySize: 10,
    // The actions the player can take.
    actions: defaultActions(),
    // The action history of the player. Used for tracking memorable actions and player reputation.
    actionHistory: [
        { actionCount: 1, name: "default" },
        { actionCount: 1, name: "charisma" },
        { actionCount: 1, name: "fighting" },
        { actionCount: 1, name: "fighting" },
        { actionCount: 1, name: "fighting" },
        { actionCount: 1, name: "fighting" },
        { actionCount: 1, name: "movement" },
        { actionCount: 1, name: "movement" },
        { actionCount: 1, name: "movement" },
        { actionCount: 1, name: "observe" },
        { actionCount: 1, name: "performance" },
        { actionCount: 1, name: "first-aid" },
        { actionCount: 1, name: "fighting" },
    ],
    // The exhaustion system for the player.
    exhaustion: {
        // Enable the exhaustion system.
        enabled: false,
        // The threshold for the exhaustion system.
        // This is the number of actions before the system activates.
        threshold: 5,
        // The number of inactive turns.
        inactive: 0,
        // The number of active turns.
        active: 0,
        // The message to display when the player is exhausted. This is added to the player status.
        message: "exhausted"
    },
    // The threat system for the player.
    threat: {
        // Enable the threat system.
        enabled: false,
        // The threshold for the threat system.
        threshold: 5,
        // The number of active turns.
        active: 0,
        // The number of inactive turns.
        inactive: 0,
        // The outcomes for the threat system when the player is inactive.
        // Add as many as you like but keep one in the array.
        // The system randomly selects one of the outcomes for the player inaction.
        array: ["A standee noise can he heard.", "There is a strange smell in the air.", "There is sudden silence."],
    },
    // The event system for the player.
    // This is used to add random events to the player.
    // They can be used to add flavor to the game and are for things that change randomly.
    // They can be customized the same as game level event systems.
    // Use this to track changes in player.
    // Could be used to track player mood, powers or other changes that occur over time.
    // They can be cyclic or random. Cyclic events are in sequence and random events are chosen randomly.
    eventSystem: [],
    // The resources for the player.
    resources: [
        {
            // The type of resource.
            type: "health",
            // Is the resource increasing or decreasing naturally over time?
            isIncreased: false,
            // The current value of the resource.
            value: 10,
            // The maximum value of the resource.
            max: 10,
            // The minimum value of the resource.
            min: 0,
            // The rate of change for the resource.
            rate: 1,
            // Is the resource critical?
            isCritical: true,
            // Is the resource consumable?
            isConsumable: false,
            // Is the resource renewable?
            isRenewable: true,
            // The thresholds for the resource.
            // Thresholds are used to track the state of the resource.
            // For example, health might have thresholds for critical, injured, and good health.
            // The thresholds are used to track the state of the resource.
            // The message is displayed when the resource reaches the threshold and is added to the player status.
            // The thresholds are checked in order from top to bottom.
            // The threshold number should be between the min and max values of the resource.
            thresholds: [
                { threshold: 1, message: "critically injured" },
                { threshold: 4, message: "injured" },
                { threshold: 7, message: "slightly injured" },
                { threshold: 99, message: "in good health" },
            ],
        },
    ],
};

const defaultGame = {
    // Enable dynamically added actions.
    dynamicActions: false,
    // The action rate configuration.
    actionRate: defaultActionRate,
    // Enable the reputation system.
    enableReputationSystem: true,
    // Enable the charisma check.
    enableSayCharismaCheck: true,
    // The event system for the game.
    // This is used to add random events to the game.
    // They can be used to add flavor to the game and are for things that change randomly.
    // They can be customized the same as player level event systems.
    // Use this to track changes in the game.
    // Could be used to track weather, time of day, or other changes that occur over time.
    // They can be cyclic or random. Cyclic events are in sequence and random events are chosen randomly.
    eventSystem: [
        {
            // The name of the event system.
            name: "Natural Weather",
            // The events within the event system.
            // Add as many as you like but keep one in the array.
            // The system randomly selects one of the events for the event system if isRandom is true.
            // Else the system goes in order from bottom to top.
            // The chance is a fraction of a whole number.
            // The description is the text that is displayed when the event occurs.
            events: [
                { chance: .05, description: "It is thundering outside." },
                { chance: .1, description: "There are clouds and precipitation outside." },
                { chance: .15, description: "There are clouds outside." },
                { chance: .25, description: "There is a thick fog outside." },
                { chance: 1, description: "It is clear outside." }
            ],
            // The chance of the event system changing events.
            chance: 0.1,
            // The current event within the event system.
            current: { chance: .05, description: "It is thundering outside." },
            // the description of the current event.
            description: "It is thundering outside.",
            // Indicates whether the event is random.
            isRandom: true
        },
    ],
    // Enable the event systems.
    eventSystemEnabled: true,
    // The default author's note for the game.
    authorsNote: "Style Keywords: Light, breezy, punchy, whimsical, comedic. Structure Keywords: Rapid, dynamic, action - packed, lively interactions, visual. Tone Keywords: Light, humorous, playful, fun, engaging, entertaining.",
    // The players in the game.
    players: [defaultPlayerYou],
    // Enable dynamically added players.
    isDynamicPlayersEnabled: true,
    // The resources in the game.
    // This is dynamic and can have any custom resources.
    // The resources are used to track the state of the outside world.
    resources: [],
    // Enable player messages.
    // This is used to display messages to the player.
    // This is disabled by default due to a bug in the UI.
    enablePlayerMessage: false,
    // The messages for the game.
    messages: []
};
// ++++++++++++++++++++++++
// ++++++++++++++++++++++++
// END EDIT SECTION
// ++++++++++++++++++++++++
// ++++++++++++++++++++++++

const tester = (state, text, history, storyCards, info) => {
    // The Oracle of Delphi is a game engine that adds a new level of depth to AI Dungeon.
    // DO NOT CHANGE ANYTHING BELOW THIS LINE!
    const oracle = () => {
        const getPlayerByName = name => {
            if (game.isDynamicPlayersEnabled && name !== "" && name !== null) {
                let player = game.players.find(p => p.name === name);
                if (!player) {

                    player = new Player(defaultPlayerYou);
                    player.name = name;
                    game.players.push(player); // Add the new player to the players array
                }
                return player;
            }
            return game.players.find(p => p.name === name) || game.players[0];
        }

        const delphicBase = () => {
            // Set the default game state
            if (!state.game) {
                state.game = new Game(defaultGame);
            }
            // Ensure state.memory.authorsNote is blank and ready.
            state.memory.authorsNote = "";
            // Ensure state.memory.frontMemory is blank and ready.
            state.memory.frontMemory = "";
        }

        delphicBase(false);

        const game = new Game(state.game);

        const actionMatch = text.match(/> (.*) ((?:try|tries|attempt|attempts) (?:to use (.*) to |to )|(?:say|says) ("(?:[^"]+)"))/i);

        let activePlayerName = actionMatch ? actionMatch[1] : null;
        const isDoAction = actionMatch ? actionMatch[3] || (!actionMatch[4] && actionMatch) : null;
        const isSpeechAction = actionMatch ? actionMatch[4] !== undefined : null;

        const activePlayer = getPlayerByName(activePlayerName);

        const getActionByName = name => {
            if (game.dynamicActions && name !== "default" && name !== "charisma" && name !== "") {
                let action = activePlayer.actions.find(a => a.name.includes(name.toLowerCase()));
                if (!action) {
                    // If skill does not exist, create it with default attributes.
                    let names = [];
                    names.push(name.toLowerCase());
                    activePlayerName = name;
                    action = new Action(names);
                    activePlayer.actions.push(action); // Add the new action to the actions array
                }
                return action;
            }
            return activePlayer.actions.find(a => a.name.includes(name.toLowerCase())) || activePlayer.actions[0];
        }

        // Adjust a action's success rate dynamically based on outcome
        const setActionState = (isActiveTurn, action, isSuccess) => {
            if (action) {
                // Increase the action rate more significantly the lower the current action level is.
                const calculateNewRate = isSuccess => {
                    return action.leveling.rateOfChange * (1 + ((action.rate * isSuccess ? 1 : action.leveling.rateOfChangeFailureMultiplier) / action.leveling.maxRate));
                }
                adjustActionLevel(action, calculateNewRate(isSuccess), isSuccess);
            } 
        }

        const adjustActionLevel = (action, newRate, isSuccess) => {
            if (newRate >= action.rate && action.leveling.increaseEnabled) {
                checkWithinBounds(newRate, action.leveling.maxRate);
            }
            else if (action.leveling.decreaseEnabled) {
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
            const message = success ? `${action.name[0]} check succeeded.` : `${action.name[0]} check failed.`
            game.messages = [message];
            return success;
        }

        /**
         * Process all the actions providing an update to each non active action. Should be called before determining fate.
         * @param {string} name The Name of the action being used actively and action being ignored for updates.
         */
        const processActionsCoolDown = (isActiveTurn, action) => {
            game.players.filter(p => p.name !== activePlayerName).map(p => p.actions.forEach(a => a.coolDown.decrease()));
            //If an action was supplied
            if (action) {
                activePlayer.actions.forEach(currentAction => {
                    if (currentAction.name[0] !== action.name[0] && currentAction.coolDown > 0) {
                        currentAction.coolDown += -a.coolDown.decreaseRatePerAction;
                    }
                });
            }
            //If an action was not supplied
            else {
                activePlayer.actions.forEach(currentAction => {
                    if (currentAction.coolDown > 0) {
                        currentAction.coolDown += -a.coolDown.decreaseRatePerAction;
                    }
                });
            }
        }

        const processActionResource = (isActiveTurn, action) => {
            if (action) {
                if (isActiveTurn && action.isResource && action.resource.type !== "") {
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
        }

        /**
         * Logic for handling the player exhaustion.
         * @param {boolean} active If the player turn is an active one.
         */
        const processPlayerActivity = (isActiveTurn) => {
            if (!activePlayer.exhaustion.enabled) return;
            if (isActiveTurn) {
                activePlayer.exhaustion.inactive = 0;
                activePlayer.exhaustion.active = checkWithinBounds(activePlayer.exhaustion.active + 1, 0, Number.MAX_SAFE_INTEGER);
                activePlayer.threat.active = checkWithinBounds(activePlayer.threat.active + 1, 0, Number.MAX_SAFE_INTEGER);
                activePlayer.threat.inactive = checkWithinBounds(activePlayer.threat.inactive - 1, 0, Number.MAX_SAFE_INTEGER);
            } else {
                activePlayer.exhaustion.active = 0;
                activePlayer.exhaustion.inactive = checkWithinBounds(activePlayer.exhaustion.inactive + 1, 0, Number.MAX_SAFE_INTEGER);
                activePlayer.threat.active = checkWithinBounds(activePlayer.threat.active - 1, 0, Number.MAX_SAFE_INTEGER);
            }
        }

        const processReputation = (isActiveTurn, action, isSuccess) => {
            if (action) {
                if (isSuccess && game.enableReputationSystem && (Math.random() < action.memorable)) {
                    activePlayer.actionHistory.push(new ActionHistory(action.name[0], info.actionCount));
                    activePlayer.actionHistory = activePlayer.actionHistory.filter(ah => ah.actionCount > Math.max(0, info.actionCount - 50))
                }
            }
        }

//////// Module processing swap ///////////////////////////////////////////////////////////////////

        //Please note: all these functions must pass arguments in order. If a function doesn't need a parameter, it will simply be ignored when the function is called.
        //This moduleProcessing function is only for testing purposes, and will be replaced with an array.
        //Arguments go as: (isActiveTurn, action, isSuccess)
        //All processing functions must account for a case where (action === undefined)
        

        const setCurrentPlayerResources = (isActiveTurn, action, isSuccess) => {
            activePlayer.setResources(isActiveTurn, action, isSuccess);
        }
        const updateCurrentPlayerActions = (isActiveTurn, action, isSuccess) => {
            activePlayer.updateActions(isActiveTurn, action, isSuccess);
        } 
        
        /**
         * list of functions to call for processing
         */
        let moduleProcessingArray = [

            processActionResource,
            processPlayerActivity,
            processActionsCoolDown,
            processReputation,
            setCurrentPlayerResources,
            updateCurrentPlayerActions,
        ];

        /**
         * Handles the processing for game subsystems.
         * @param {*} isActiveTurn 
         * @param {*} action 
         * @param {*} isSuccess 
         */
        const callModuleProcessing = (isActiveTurn, action, isSuccess) => {
            moduleProcessingArray.forEach(currentFunction => {currentFunction.apply(null, [isActiveTurn, action, isSuccess])});
        }
        

        /**
         * The action command parse for use as command parse and entry point.
         * @param {string} text The user imputed text.
         */
        const actionParse = () => {
            let isActiveTurn;
            if (isDoAction && !isSpeechAction) {
                const action = getActionByName((actionMatch[3] || "default"));
                isActiveTurn = true;
                const isSuccess = determineFate(action);
                callModuleProcessing(isActiveTurn, action, isSuccess);
                //moduleProcessing[0](isActiveTurn, action, isSuccess);
                //processActionResource(isActiveTurn, action);
                //processPlayerActivity(isActiveTurn);
                //processActionsCoolDown(isActiveTurn, action);
                //setActionState(isSuccess, action, isSuccess);
                //processReputation(isActiveTurn, action, isSuccess);
                //activePlayer.setResources(isActiveTurn, action, isSuccess);
                //moduleProcessingArray[5](isActiveTurn, action, isSuccess);
                activePlayer.updateActions(isActiveTurn, action, isSuccess);
                return action.getPhrase(isSuccess, activePlayerName);
            } else if (isSpeechAction && game.enableSayCharismaCheck) {
                // If speech is captured
                const action = getActionByName("charisma");
                isActiveTurn = false;
                const isSuccess = determineFate(action);
                callModuleProcessing(isActiveTurn, action, isSuccess);
                //processActionResource(isActiveTurn, action);
                //processPlayerActivity(isActiveTurn);
                //processActionsCoolDown(isActiveTurn, action);
                //setActionState(isActiveTurn, action, isSuccess);
                //processReputation(isActiveTurn, action, isSuccess);
                //activePlayer.setResources(isActiveTurn, action, isSuccess);
                //activePlayer.updateActions(isActiveTurn, action, isSuccess);
                return action.getPhrase(isSuccess, activePlayerName);
            } else {
                isActiveTurn = false;
                callModuleProcessing(isActiveTurn);
                return "";  // No relevant action found
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
        const getPlayersStatus = () => {
            const status = [...game.players.map(p => p.getStatus())].filter(e => e !== "")
                .join(" ")
                .trim();
            return status.length > 0 ? status : "";
        }

        // /**
        //  * Gets the players status for the message.
        //  * @returns The status.
        //  */
        // const getPlayerStatusMessage = (who) => {
        //     const status = game.players.map(p => p.actions).filter(a => a.coolDown.enabled && a.coolDown.remainingTurns > 0)
        //         .map(a => `${a.name[0]} is cooling down for ${a.coolDown.remainingTurns} turns. Causing: "${a.coolDownPhrase}"`);
        //     if (status.length > 0) {
        //         return status;
        //     }
        //     return "";
        // }

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
        game.eventSystem.forEach(e => e.changeEvent());
        state.memory.frontMemory = actionParse();

        state.memory.authorsNote = [
            getPlayersStatus(),
            suddenly(),
            ...getEventSystem(),
            ...getResourceThresholds(),
            game.authorsNote,
        ].filter(e = e => e !== "").join(" ").trim();

        // // Notify the player of the status.
        // if (game.enablePlayerMessage) {
        //     state.message = "This is not enabled yet as the message system is not fully implemented on AI Dungeon.";
        //     game.messages = [];
        // }
        state.game = game;
    }
    oracle();

    return { state, text, history, storyCards, info }
}
module.exports = { tester, getRandomItem, getNextItem, getIsOrAre, checkWithinBounds, startingActionRate, Game, Player, Resource, Action, ActionHistory, EventSystem, Exhaustion, Threat, ActionRate, defaultActions, defaultPlayerYou, defaultGame, defaultAction, defaultCharismaAction, customActions};