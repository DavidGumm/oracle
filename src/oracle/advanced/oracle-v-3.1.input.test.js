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
const authorsNoteRegEx = /(|\[Your status: (|You're too flustered to speak clearly!)] )(There are clouds outside. |It is thundering outside. |It is clear outside. |There is a thick fog outside. |There are clouds and precipitation outside. )(|Suddenly a zombie appears! )(|You feel upset. |You feel betrayed. |You feel emotional hurt. |You are sad. |You are depressed. |You feel happy. |You feel evil. |You feel generous. |You feel selfish. |You need attention from another person. |You need the comfort of home. )(|Your known to be bland, boring and run of the mill. )(|You are known to all around you. )(|The room seems to light up when you enter. )(|People fear you and your aura of violence. )(|You move with grace and style. )(|You are in good health. )Style Keywords: Light, breezy, punchy, whimsical, comedic. Structure Keywords: Rapid, dynamic, action - packed, lively interactions, visual. Bad things are allowed to happen to the protagonist and other important characters. The protagonist is allowed to struggle or even fail. It is forbidden to directly state character emotions; instead, convey them via behavior and body language. Characters are allowed to disagree with the protagonist and follow their own goals. Villains should not capitulate as soon as the protagonist uses logic.Villains have reasons for what they do, and will generally continue opposing the protagonist regardless./

const frontMemoryFightMatch = /The attack (made with deadly precision|is brutal efficiency|has unyielding resolve).|Your attack proves (misjudged|ineffective|reckless)!/;
const frontMemoryMoveMatch = /Your movement is successfully and (graceful|fluid|agile).|Your attempt to move was (awkward|unprepared|reckless)!/;
const frontMemorySpeechMatch = /You speak with (persuasive|charm|conviction).|You try to be persuasive, but your words are (awkward|unconvincing|ineffectual)!/;
const frontMemoryDefaultMatch = /Successfully, you manage to be (masterful|remarkable|flawless).|Despite your efforts, you end up being (clumsy|inept|futile)!/;

for (let index = 0; index < 100; index++) {
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
        const text = "> Magnus says \"Some words you say.\"";
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