const tester = require("./oracle-lite.input");

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

const regExFrontMemory = / But (You|Magnus|Magnus Magnusson) fails? horrifically!| And (You|Magnus|Magnus Magnusson) succeeds?.| But (You|Magnus|Magnus Magnusson) fails?!| And (You|Magnus|Magnus Magnusson) succeeds? Flawlessly./
const regExMessage = /(You|Magnus|Magnus Magnusson) fails? horrifically|(You|Magnus|Magnus Magnusson) succeeds?.|(You|Magnus|Magnus Magnusson) fails?!|(You|Magnus|Magnus Magnusson) succeeds? Flawlessly./

const runner = () => {
    test("Test oracle action", () => {
        const text = "> You try to throw a rock.";
        const results = tester(stateInitial, text, historyInitial, storyCardsInitial, infoInitial);
        expect(results.state).toMatchObject(stateInitial);
        expect(results.state.memory.frontMemory).toMatch(regExFrontMemory);
        expect(results.state.message).toMatch(regExMessage);
        expect(results.text).toBe(text);
        expect(results.history).toMatchObject(historyInitial);
        expect(results.storyCards).toMatchObject(storyCardsInitial);
        expect(results.info).toMatchObject(infoInitial);
    });

    test("Test oracle action", () => {
        const text = "> You try @.5 to throw a rock.";
        const results = tester(stateInitial, text, historyInitial, storyCardsInitial, infoInitial);
        expect(results.state).toMatchObject(stateInitial);
        expect(results.state.memory.frontMemory).toMatch(regExFrontMemory);
        expect(results.state.message).toMatch(regExMessage);
        expect(results.text).toBe("> You try to throw a rock.");
        expect(results.history).toMatchObject(historyInitial);
        expect(results.storyCards).toMatchObject(storyCardsInitial);
        expect(results.info).toMatchObject(infoInitial);
    });

    test("Test oracle action with custom name", () => {
        const text = "> Magnus tries @0.5 to throw a rock.";
        const results = tester(stateInitial, text, historyInitial, storyCardsInitial, infoInitial);
        expect(results.state).toMatchObject(stateInitial);
        expect(results.state.memory.frontMemory).toMatch(regExFrontMemory);
        expect(results.state.message).toMatch(regExMessage);
        expect(results.text).toBe("> Magnus tries to throw a rock.");
        expect(results.history).toMatchObject(historyInitial);
        expect(results.storyCards).toMatchObject(storyCardsInitial);
        expect(results.info).toMatchObject(infoInitial);
    });

    test("Test oracle action with custom name", () => {
        const text = "> Magnus tries to throw a rock.";
        const results = tester(stateInitial, text, historyInitial, storyCardsInitial, infoInitial);
        expect(results.state).toMatchObject(stateInitial);
        expect(results.state.memory.frontMemory).toMatch(regExFrontMemory);
        expect(results.state.message).toMatch(regExMessage);
        expect(results.text).toBe(text);
        expect(results.history).toMatchObject(historyInitial);
        expect(results.storyCards).toMatchObject(storyCardsInitial);
        expect(results.info).toMatchObject(infoInitial);
    });

    test("Test oracle action with multi name.", () => {
        const text = "> Magnus Magnusson tries to throw a rock.";
        const results = tester(stateInitial, text, historyInitial, storyCardsInitial, infoInitial);
        expect(results.state).toMatchObject(stateInitial);
        expect(results.state.memory.frontMemory).toMatch(regExFrontMemory);
        expect(results.state.message).toMatch(regExMessage);
        expect(results.text).toBe(text);
        expect(results.history).toMatchObject(historyInitial);
        expect(results.storyCards).toMatchObject(storyCardsInitial);
        expect(results.info).toMatchObject(infoInitial);
    });

    test("Test non oracle action", () => {
        const text = "> You throw a rock.";
        const results = tester(stateInitial, text, historyInitial, storyCardsInitial, infoInitial);
        expect(results.state).toMatchObject(stateInitial);
        expect(results.state.memory.frontMemory).toBe("");
        expect(results.state.message).toBe(undefined);
        expect(results.text).toBe(text);
        expect(results.history).toMatchObject(historyInitial);
        expect(results.storyCards).toMatchObject(storyCardsInitial);
        expect(results.info).toMatchObject(infoInitial);
    });
}

for (let index = 0; index < 10; index++) {
    runner();
}