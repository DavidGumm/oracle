const tester = require("./oracle-v-3.1.input");

const state = {
    key: "value",
    memory: { context: "This is the memory", authorsNote: "This is the authors note" },
    message: "Hello Player"
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
const authorsNoteRegEx = /(|\[Your status: (|You're too flustered to speak clearly!)] )(There are clouds outside.|It is thundering outside.|It is clear outside.|There is a thick fog outside.|There are clouds and precipitation outside.) (|Suddenly a zombie appears! )\[Setting: Zombie post-apocalypse\] \[Tone: Grim, Dark\] \[Style: Gritty, Evocative, Fast Zombies\]/

test("Test Fighting action", () => {
    const text = "> You try to use fighting to defend yourself.";
    const results = tester(state, text, history, storyCards, info);
    expect(results.state).toMatchObject(state);
    expect(results.state.message).toMatch(/Your fighting check (succeeded|failed)./);
    expect(results.state.memory.authorsNote).toMatch(authorsNoteRegEx);
    expect(results.text).toBe(text);
    expect(results.history).toMatchObject(history);
    expect(results.storyCards).toMatchObject(storyCards);
    expect(results.info).toMatchObject(info);
});

test("Test Skill action", () => {
    const text = "> You try to use scavenging to find resources.";
    const results = tester(state, text, history, storyCards, info);
    expect(results.state).toMatchObject(state);
    expect(results.state.message).toMatch(/Your scavenging check (succeeded|failed)./);
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
    expect(results.state.message).toMatch(/Your default check (succeeded|failed)./);
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
    expect(results.state.message).toMatch(/(Your speech check (succeeded|failed).|speech is cooling down for 3 turns. Causing: \"You're too flustered to speak clearly!\")/);
    expect(results.state.memory.authorsNote).toMatch(authorsNoteRegEx);
    expect(results.text).toBe(text);
    expect(results.history).toMatchObject(history);
    expect(results.storyCards).toMatchObject(storyCards);
    expect(results.info).toMatchObject(info);
});

// Testing post init of data

test("Test Fighting action post init", () => {
    const text = "> You try to use fighting to defend yourself.";
    const results = tester(state, text, history, storyCards, info);
    //expect(results.state).toMatchObject(state);
    expect(results.state.message).toMatch(/Your fighting check (succeeded|failed)./);
    expect(results.state.memory.authorsNote).toMatch(authorsNoteRegEx);
    expect(results.history).toMatchObject(history);
    expect(results.storyCards).toMatchObject(storyCards);
    expect(results.info).toMatchObject(info);
});

test("Test Skill action post init", () => {
    const text = "> You try to use scavenging to find resources.";
    const results = tester(state, text, history, storyCards, info);
    //expect(results.state).toMatchObject(state);
    expect(results.state.message).toMatch(/Your scavenging check (succeeded|failed)./);
    expect(results.history).toMatchObject(history);
    expect(results.storyCards).toMatchObject(storyCards);
    expect(results.info).toMatchObject(info);
});

test("Test default action post init", () => {
    const text = "> You try to move the rock.";
    const results = tester(state, text, history, storyCards, info);
    //expect(results.state).toMatchObject(state);
    expect(results.state.message).toMatch(/Your default check (succeeded|failed)./);
    expect(results.state.memory.authorsNote).toMatch(authorsNoteRegEx);
    expect(results.history).toMatchObject(history);
    expect(results.storyCards).toMatchObject(storyCards);
    expect(results.info).toMatchObject(info);
});

test("Test add skill action post init", () => {
    const text = "> You try to use racing to drive the car.";
    const results = tester(state, text, history, storyCards, info);
    //expect(results.state).toMatchObject(state);
    expect(results.state.message).toMatch(/(Your racing check (succeeded|failed).|Your default check (succeeded|failed).)/);
    expect(results.state.memory.authorsNote).toMatch(authorsNoteRegEx);
    expect(results.text).toBe(text);
    expect(results.history).toMatchObject(history);
    expect(results.storyCards).toMatchObject(storyCards);
    expect(results.info).toMatchObject(info);
});

test("Test move action post init", () => {
    const text = "> You try to use jumping to drive the car.";
    const results = tester(state, text, history, storyCards, info);
    //expect(results.state).toMatchObject(state);
    expect(results.state.message).toMatch(/Your move check (succeeded|failed)./);
    expect(results.state.memory.authorsNote).toMatch(authorsNoteRegEx);
    expect(results.text).toBe(text);
    expect(results.history).toMatchObject(history);
    expect(results.storyCards).toMatchObject(storyCards);
    expect(results.info).toMatchObject(info);
});

test("Test speech action post init", () => {
    const text = "> You say \"Some words you say.\"";
    const results = tester(state, text, history, storyCards, info);
    //expect(results.state).toMatchObject(state);
    expect(results.state.message).toMatch(/(Your speech check (succeeded|failed).|speech is cooling down for 3 turns. Causing: \"You're too flustered to speak clearly!\")/);
    expect(results.state.memory.authorsNote).toMatch(authorsNoteRegEx);
    expect(results.text).toBe(text);
    expect(results.history).toMatchObject(history);
    expect(results.storyCards).toMatchObject(storyCards);
    expect(results.info).toMatchObject(info);
});