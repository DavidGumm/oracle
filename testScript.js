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
            //Second Person
            stringToFormat = stringToFormat.replace(/{playerName}/g, playerName);
            stringToFormat = stringToFormat.replace(/{playerPossessive}/g, 'your');
            stringToFormat = stringToFormat.replace(/{playerCopular}/g, 'are');
            stringToFormat = stringToFormat.replace(/{playerReferTo}/g, 'you');


        case "I":
            //First Person
            stringToFormat = stringToFormat.replace(/{playerName}/g, playerName);
            stringToFormat = stringToFormat.replace(/{playerPossessive}/g, 'my');
            stringToFormat = stringToFormat.replace(/{playerCopular}/g, 'am');
            stringToFormat = stringToFormat.replace(/{playerReferTo}/g, 'I');
        

        default:
            //Third person
            stringToFormat = stringToFormat.replace(/{playerName}/g, playerName);
            stringToFormat = stringToFormat.replace(/{playerPossessive}/g, 'their');
            stringToFormat = stringToFormat.replace(/{playerCopular}/g, 'is');
            stringToFormat = stringToFormat.replace(/{playerReferTo}/g, 'they');
    }

    return stringToFormat.replace(/(?:^|(?:[.!?]\s))(.{1})/g, char => char.toUpperCase());
}

str = "{playerReferTo} tried to pay attention,"

console.log(formatGrammar("I", str))