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
            stringToFormat = stringToFormat.replace(/{playerPossessive}/g, 'your');
            stringToFormat = stringToFormat.replace(/{playerCopular}/g, 'are');


        case "I":

            stringToFormat = stringToFormat.replace(/{playerName}/g, playerName);
            stringToFormat = stringToFormat.replace(/{playerPossessive}/g, 'my');
            stringToFormat = stringToFormat.replace(/{playerCopular}/g, 'am');
        

        default:

            stringToFormat = stringToFormat.replace(/{playerName}/g, playerName);
            stringToFormat = stringToFormat.replace(/{playerPossessive}/g, 'their');
            stringToFormat = stringToFormat.replace(/{playerCopular}/g, 'is');
    }

    return stringToFormat.replace(/(?:^|(?:[.!?]\s))(\w{1})/g, char => char.toUpperCase());
}

str = "> You try to "