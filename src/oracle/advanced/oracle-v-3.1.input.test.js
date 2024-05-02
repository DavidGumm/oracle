const { tester, getRandomItem, getNextItem, getCopular, checkWithinBounds, startingActionRate, Game, Player, Resource, Action, ActionHistory, EventSystem, Exhaustion, Threat, ActionRate, CoolDown, defaultGame, defaultPlayer, defaultResource, defaultAction, defaultActionHistory, defaultEventSystem, defaultExhaustion, defaultThreat, defaultActionRate, customActions } = require("./oracle-v-3.1.input");
const loops = 100;
const state = {
    memory: { context: "This is the memory", authorsNote: "This is the authors note" },
    game: new Game(defaultGame),
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
const authorsNoteRegEx = /(|\[You are, unable to make sense, a skilled fighter\.\] \[Bob is, unable to make sense, a skilled fighter\.\] )(It is thundering outside\.|There is a thick fog outside\.|It is clear outside\.|There are clouds outside\.|There are clouds and precipitation outside\.) Style Keywords: Light, breezy, punchy, whimsical, comedic\. Structure Keywords: Rapid, dynamic, action - packed, lively interactions, visual. Tone Keywords: Light, humorous, playful, fun, engaging, entertaining\./

const frontMemoryFightMatch = / And the attack is made with (deadly precision|brutal efficiency|unyielding determination).| But the attack proves (misjudged|ineffective|reckless)!/;
const frontMemoryMoveMatch = / And the movement is successfully and (graceful|fluid|agile).| But the attempt to move was (awkward|unprepared|reckless)!/;
const frontMemorySpeechMatch = / And the words are (persuasive|charming|full of conviction).| But the words are (awkward|unconvincing|ineffectual)!/;
const frontMemoryDefaultMatch = / And successfully, manage to be (masterful|remarkable|flawless).| But fail, managing to be (clumsy|inept|futile)!/;

const weatherMatch = /(It is thundering outside\.|There is a thick fog outside\.|It is clear outside\.|There are clouds outside\.|There are clouds and precipitation outside\.)/

test("Test Player Class", () => {
    expect(state.game.players[0].name).toBe("You");

    state.game.players[0].setResources(false, "fighting");
    expect(state.game.players[0].resources[0].value).toBe(7);
    expect(state.game.players[0].getResourceThresholds()).toStrictEqual(["slightly injured"]);

    state.game.players[0].setResources(true, "first-aid");
    expect(state.game.players[0].resources[0].value).toBe(10);
    expect(state.game.players[0].getResourceThresholds()).toStrictEqual(["in good health"]);
    expect(state.game.players[0].getStatus()).toBe("[You are, unable to make sense, a skilled fighter, in good health.]");
});

test("Test Action Class", () => {
    const action = state.game.players[0].actions[1];
    expect(action.name.includes("speech")).toBe(true);
    expect(action.rate).toBe(0.5);
});

test("Test CoolDown Class", () => {
    const coolDown = state.game.players[0].actions[1].coolDown;
    expect(coolDown.failureThreshold).toBe(3);
    coolDown.increase();
    coolDown.increase();
    expect(coolDown.failureCount).toBe(2);
    coolDown.decrease();
    expect(coolDown.failureCount).toBe(1);
});

test("Test Leveling Class", () => {
    const action = state.game.players[0].actions[1];
    expect(action.rate).toBe(.50);
    action.updateRate(true, true);
    expect(action.rate).toBe(.51);
    action.updateRate(false, false);
    expect(action.rate).toBe(0.5098333333333334);
    state.game.players[0].updateActions("charisma", true);
    expect(action.rate).toBe(0.5198333333333334);
});

test("Test getRandomItem", () => {
    const arr = [1, 2, 3, 4, 5];
    const item = getRandomItem(arr);
    expect(arr.includes(item)).toBe(true);
});

test("Test getNextItem", () => {
    const arr = [1, 2, 3, 4, 5];
    const currentIndex = 2;
    const nextItem = getNextItem(arr, currentIndex);
    expect(nextItem).toBe(arr[currentIndex + 1]);
});

test("Test checkWithinBounds", () => {
    const number = 10;
    const lowerBound = 5;
    const upperBound = 15;
    const adjustedNumber = checkWithinBounds(number, lowerBound, upperBound);
    expect(adjustedNumber).toBe(number);

    const number2 = 20;
    const adjustedNumber2 = checkWithinBounds(number2, lowerBound, upperBound);
    expect(adjustedNumber2).toBe(upperBound);
});

test("Test startingActionRate", () => {
    const starting = 0.4;
    const min = 0.01;
    const max = 0.2;
    const actionRate = startingActionRate(starting, min, max);
    expect(actionRate).toBeLessThan(max+starting+0.01);
    expect(actionRate).toBeGreaterThan(starting);
});

test("Test getCopular", () => {
    expect(getCopular("You")).toBe("are");
    expect(getCopular("Bob")).toBe("is");
    expect(getCopular("I")).toBe("am");
});

test("Test Change Event", () => {
    state.game.eventSystem.forEach(e => {
        e.changeEvent(.05);
        expect(e.description).toMatch(weatherMatch);
    });
});

for (let index = 0; index < loops; index++) {

    test("Test Change Event", () => {
        state.game.eventSystem.forEach(e => {
            e.changeEvent(.05);
            expect(e.description).toMatch(weatherMatch);
        });
    });

    test("Test Fighting action", () => {
        const text = "> You try to use fighting to defend yourself.";
        const results = tester(state, text, history, storyCards, info);
        expect(results.state).toMatchObject(state);
        expect(results.state.memory.frontMemory).toMatch(frontMemoryFightMatch);
        expect(results.state.memory.authorsNote).toMatch(authorsNoteRegEx);
        expect(results.text).toBe(text);
        expect(results.history).toMatchObject(history);
        expect(results.storyCards).toMatchObject(storyCards);
        expect(results.info).toMatchObject(info);
    });

    test("Test default action", () => {
        const text = "> You try to move the rock.";
        const results = tester(state, text, history, storyCards, info);
        expect(results.state).toMatchObject(state);
        expect(results.state.memory.frontMemory).toMatch(frontMemoryDefaultMatch);
        expect(results.state.memory.authorsNote).toMatch(authorsNoteRegEx);
        expect(results.text).toBe(text);
        expect(results.history).toMatchObject(history);
        expect(results.storyCards).toMatchObject(storyCards);
        expect(results.info).toMatchObject(info);
    });

    test("Test speech action", () => {
        const text = "> You say \"Some words you say.\"";
        const results = tester(state, text, history, storyCards, info);
        expect(results.state).toMatchObject(state);
        expect(results.state.memory.frontMemory).toMatch(frontMemorySpeechMatch);
        expect(results.state.memory.authorsNote).toMatch(authorsNoteRegEx);
        expect(results.text).toBe(text);
        expect(results.history).toMatchObject(history);
        expect(results.storyCards).toMatchObject(storyCards);
        expect(results.info).toMatchObject(info);
    });

    test("Test move action", () => {
        const text = "> You try to use leap to get out of the way!";
        const results = tester(state, text, history, storyCards, info);
        //expect(results.state).toMatchObject(state);
        expect(results.state.memory.frontMemory).toMatch(frontMemoryMoveMatch);
        expect(results.state.memory.authorsNote).toMatch(authorsNoteRegEx);
        expect(results.text).toBe(text);
        expect(results.history).toMatchObject(history);
        expect(results.storyCards).toMatchObject(storyCards);
        expect(results.info).toMatchObject(info);
    });

    test("Test speech action with new player", () => {
        const text = "> Bob says \"Some words you say.\"";
        const results = tester(state, text, history, storyCards, info);
        //expect(results.state).toMatchObject(state);
        expect(results.state.memory.frontMemory).toMatch(frontMemorySpeechMatch);
        expect(results.state.memory.authorsNote).toMatch(authorsNoteRegEx);
        expect(results.text).toBe(text);
        expect(results.history).toMatchObject(history);
        expect(results.storyCards).toMatchObject(storyCards);
        expect(results.info).toMatchObject(info);
    });

    test("Test none action", () => {
        const text = "I move the rock.";
        const results = tester(state, text, history, storyCards, info);
        //expect(results.state).toMatchObject(state);
        expect(results.state.memory.frontMemory).toMatch("");
        expect(results.state.memory.authorsNote).toMatch(authorsNoteRegEx);
        expect(results.text).toBe(text);
        expect(results.history).toMatchObject(history);
        expect(results.storyCards).toMatchObject(storyCards);
        expect(results.info).toMatchObject(info);
    });
}