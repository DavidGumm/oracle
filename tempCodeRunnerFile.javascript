/**
 * Replaces placeholder values to ensure proper grammar
 * Placeholders:
 * @param {*} playerName 
 * @param {*} stringToFormat 
 * @returns 
 */
const formatGrammar = (playerName, stringToFormat) => {
    switch (playerName) {
        case "You":

            stringToFormat = stringToFormat.replace(/{playerName}/g, playerName);
            stringToFormat = stringToFormat.replace(/{playerNoun}/g, 'you');
            stringToFormat = stringToFormat.replace(/{playerPossessive}/g, 'your');
            stringToFormat = stringToFormat.replace(/{playerCopular}/g, 'are');


        case "I":

        stringToFormat = stringToFormat.replace(/{playerName}/g, playerName);
        stringToFormat = stringToFormat.replace(/{playerNoun}/g, 'I');
        stringToFormat = stringToFormat.replace(/{playerPossessive}/g, 'my');
        stringToFormat = stringToFormat.replace(/{playerCopular}/g, 'am');
        

        default:

        stringToFormat = stringToFormat.replace(/{playerName}/g, playerName);
        stringToFormat = stringToFormat.replace(/{playerNoun}/g, 'they');
        stringToFormat = stringToFormat.replace(/{playerPossessive}/g, 'their');
        stringToFormat = stringToFormat.replace(/{playerCopular}/g, 'is');
    }

    return stringToFormat.replace(/(?:^|(?:[.!?]\s))(\w{1})/g, m => m.toUpperCase());
}


str = "{playerName} {playerCopular} a dragon. {playerPossessive} dislike for dragonets is unrivaled, and I mean...{playerNoun} really dislike them. {playerNoun} are also very pretty.";

str = formatGrammar("Kestrel", str);

console.log(str);