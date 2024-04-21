const tester = require("./index");



const stateInitial = {
    key: "value",
    memory: { context: "This is the memory", authorsNote: "This is the authors note" },
    message: "Hello Player"
};
const historyInitial = [
    {
        text: "A first history line",
        type: "story",
        rawText: "A first history line"
    },
    {
        text: "A second history line",
        type: "story",
        rawText: "A second history line"
    }
];
const storyCardsInitial = [{ id: "1", keys: "exampleKey", entry: "exampleEntry", type: "exampleType" }];
const infoInitial = {
    actionCount: 1,
    characters: ["character1", "character2"]
};

test("Test Fighting action", () => {
    const text = "> You try to use fighting to defend yourself.";
    expect(tester(stateInitial, text, historyInitial, storyCardsInitial, infoInitial))
    .toStrictEqual({ state: stateInitial, text: text, history: historyInitial, storyCards: storyCardsInitial, info: infoInitial });
});

test("Test Skill action", () => {
    const text = "> You try to use scavenging to find resources.";
    expect(tester(stateInitial, text, historyInitial, storyCardsInitial, infoInitial))
    .toStrictEqual({ state: stateInitial, text: text, history: historyInitial, storyCards: storyCardsInitial, info: infoInitial });
});

test("Test default action", () => {
    const text = "> You try to move the rock.";
    expect(tester(stateInitial, text, historyInitial, storyCardsInitial, infoInitial))
    .toStrictEqual({ state: stateInitial, text: text, history: historyInitial, storyCards: storyCardsInitial, info: infoInitial });
});

test("Test speech action", () => {
    const text = "> You say \"Some words you say.\"";
    expect(tester(stateInitial, text, historyInitial, storyCardsInitial, infoInitial))
    .toStrictEqual({ state: stateInitial, text: text, history: historyInitial, storyCards: storyCardsInitial, info: infoInitial });
});

const state = {
    key: "value",
    memory: { context: "This is the memory", authorsNote: "" },
    message: "",
    player: {
        "status": "",
        "actions": [
            {
                "name": [
                    "default"
                ],
                "successEndings": [
                    "masterful",
                    "remarkable",
                    "flawless"
                ],
                "failureEndings": [
                    "clumsy",
                    "inept",
                    "futile"
                ],
                "successStart": "Successfully, you manage to be",
                "failureStart": "Despite your efforts, you end up being",
                "coolDownPhrase": "You are unable to!",
                "note": "",
                "rate": 0.4,
                "leveling": {
                    "increaseEnabled": false,
                    "decreaseEnabled": false,
                    "maxRate": 0.4,
                    "minRate": 0.4,
                    "rateOfChange": 0,
                    "rateOfChangeFailureMultiplier": 1,
                    "decreaseRate": 0
                },
                "coolDown": {
                    "enabled": false,
                    "decreaseRatePerAction": 1,
                    "failureThreshold": 3,
                    "failureCount": 0,
                    "remainingTurns": 0
                }
            },
            {
                "name": [
                    "speech",
                    "charisma",
                    "speechcraft",
                    "diplomacy"
                ],
                "successEndings": [
                    "persuasive",
                    "charming",
                    "convincing"
                ],
                "failureEndings": [
                    "awkward",
                    "unconvincing",
                    "ineffectual"
                ],
                "successStart": "You speak with",
                "failureStart": "You try to be persuasive, but your words are",
                "coolDownPhrase": "You're too flustered to speak clearly!",
                "note": "",
                "rate": 0.37083262334018435,
                "leveling": {
                    "increaseEnabled": true,
                    "decreaseEnabled": true,
                    "maxRate": 0.95,
                    "minRate": 0.3,
                    "rateOfChange": 0.001,
                    "rateOfChangeFailureMultiplier": 10,
                    "decreaseRate": 0.00016666666666666666
                },
                "coolDown": {
                    "enabled": true,
                    "decreaseRatePerAction": 1,
                    "failureThreshold": 3,
                    "failureCount": 0,
                    "remainingTurns": 0
                }
            },
            {
                "name": [
                    "fighting",
                    "combat",
                    "weapon"
                ],
                "successEndings": [
                    "brutal efficiency",
                    "deadly precision",
                    "unyielding resolve"
                ],
                "failureEndings": [
                    "misjudged",
                    "ineffective",
                    "reckless"
                ],
                "successStart": "You attack with",
                "failureStart": "Your attack proves",
                "coolDownPhrase": "You have no fight left in you!",
                "note": "",
                "rate": 0.3139615763170717,
                "leveling": {
                    "increaseEnabled": true,
                    "decreaseEnabled": true,
                    "maxRate": 0.95,
                    "minRate": 0.3,
                    "rateOfChange": 0.001,
                    "rateOfChangeFailureMultiplier": 10,
                    "decreaseRate": 0.00016666666666666666
                },
                "coolDown": {
                    "enabled": true,
                    "decreaseRatePerAction": 1,
                    "failureThreshold": 3,
                    "failureCount": 0,
                    "remainingTurns": 0
                }
            },
            {
                "name": [
                    "scavenging"
                ],
                "successEndings": [
                    "find valuable resources",
                    "uncover useful supplies",
                    "discover essential items"
                ],
                "failureEndings": [
                    "unprepared",
                    "inadequate",
                    "perilous"
                ],
                "successStart": "You scavenge successfully and",
                "failureStart": "Your attempt to scavenge is deemed",
                "coolDownPhrase": "You can't locate things to scavenge.",
                "note": "",
                "rate": 0.3187843927191857,
                "leveling": {
                    "increaseEnabled": true,
                    "decreaseEnabled": true,
                    "maxRate": 0.95,
                    "minRate": 0.3,
                    "rateOfChange": 0.001,
                    "rateOfChangeFailureMultiplier": 10,
                    "decreaseRate": 0.00016666666666666666
                },
                "coolDown": {
                    "enabled": true,
                    "decreaseRatePerAction": 1,
                    "failureThreshold": 3,
                    "failureCount": 0,
                    "remainingTurns": 0
                }
            },
            {
                "name": [
                    "stealth"
                ],
                "successEndings": [
                    "silent steps",
                    "ghost-like silence",
                    "undetectable movements"
                ],
                "failureEndings": [
                    "clumsy",
                    "exposed",
                    "detected"
                ],
                "successStart": "You move with",
                "failureStart": "Your attempt to move stealthily fails; you are",
                "coolDownPhrase": "You are being conspicuous.",
                "note": "",
                "rate": 0.3168057513610101,
                "leveling": {
                    "increaseEnabled": true,
                    "decreaseEnabled": true,
                    "maxRate": 0.95,
                    "minRate": 0.3,
                    "rateOfChange": 0.001,
                    "rateOfChangeFailureMultiplier": 10,
                    "decreaseRate": 0.00016666666666666666
                },
                "coolDown": {
                    "enabled": true,
                    "decreaseRatePerAction": 1,
                    "failureThreshold": 3,
                    "failureCount": 0,
                    "remainingTurns": 0
                }
            },
            {
                "name": [
                    "resistance"
                ],
                "successEndings": [
                    "hardening your resolve",
                    "precise control over your abilities",
                    "effective use of your powers"
                ],
                "failureEndings": [
                    "disgusting",
                    "vile",
                    "corrupted"
                ],
                "successStart": "You fight off the mutation with",
                "failureStart": "Your resistance falters, becoming more",
                "coolDownPhrase": "Something inside feels terribly wrong.",
                "note": "is a mutant power.",
                "rate": 0.3152173688307154,
                "leveling": {
                    "increaseEnabled": true,
                    "decreaseEnabled": true,
                    "maxRate": 0.95,
                    "minRate": 0.3,
                    "rateOfChange": 0.001,
                    "rateOfChangeFailureMultiplier": 10,
                    "decreaseRate": 0.00016666666666666666
                },
                "coolDown": {
                    "enabled": true,
                    "decreaseRatePerAction": 1,
                    "failureThreshold": 3,
                    "failureCount": 0,
                    "remainingTurns": 0
                }
            },
            {
                "name": [
                    "first aid"
                ],
                "successEndings": [
                    "lifesaving actions",
                    "precise techniques",
                    "effective treatments"
                ],
                "failureEndings": [
                    "ineffective",
                    "clumsy",
                    "detrimental"
                ],
                "successStart": "You administer first aid with",
                "failureStart": "Your attempt at first aid is",
                "coolDownPhrase": "Your medical supplies are running dangerously low.",
                "note": "You used vital supplies for your first-aid attempt.",
                "rate": 0.32471882800966506,
                "leveling": {
                    "increaseEnabled": true,
                    "decreaseEnabled": true,
                    "maxRate": 0.95,
                    "minRate": 0.3,
                    "rateOfChange": 0.001,
                    "rateOfChangeFailureMultiplier": 10,
                    "decreaseRate": 0.00016666666666666666
                },
                "coolDown": {
                    "enabled": true,
                    "decreaseRatePerAction": 1,
                    "failureThreshold": 3,
                    "failureCount": 0,
                    "remainingTurns": 0
                }
            }
        ]
    }
};
const history = [
    {
        text: "A first history line",
        type: "story",
        rawText: "A first history line"
    },
    {
        text: "A second history line",
        type: "story",
        rawText: "A second history line"
    }
];
const storyCards = [{ id: "1", keys: "exampleKey", entry: "exampleEntry", type: "exampleType" }];
const info = {
    actionCount: 1,
    characters: ["character1", "character2"]
};

test("Test Fighting action", () => {
    const text = "> You try to use fighting to defend yourself.";
    const results = tester(state, text, history, storyCards, info);
    expect(results).toStrictEqual({ state: state, text: text, history: history, storyCards: storyCards, info: info });
});

test("Test Skill action", () => {
    const text = "> You try to use scavenging to find resources.";
    expect(tester(state, text, history, storyCards, info)).toStrictEqual({ state: state, text: text, history: history, storyCards: storyCards, info: info });
});

test("Test default action", () => {
    const text = "> You try to move the rock.";
    expect(tester(state, text, history, storyCards, info)).toStrictEqual({ state: state, text: text, history: history, storyCards: storyCards, info: info });
});

test("Test speech action", () => {
    const text = "> You say \"Some words you say.\"";
    expect(tester(state, text, history, storyCards, info)).toStrictEqual({ state: state, text: text, history: history, storyCards: storyCards, info: info });
});