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
            stringToFormat = stringToFormat.replace(/{playerNamePossessive}/g, 'your');
            stringToFormat = stringToFormat.replace(/{playerPossessive}/g, 'your');
            stringToFormat = stringToFormat.replace(/{playerCopular}/g, 'are');
            stringToFormat = stringToFormat.replace(/{playerReferTo}/g, 'you');
            stringToFormat = stringToFormat.replace(/{playerReferToSelf}/g, 'yourself');


        case "I":
            //First Person
            stringToFormat = stringToFormat.replace(/{playerName}/g, playerName);
            stringToFormat = stringToFormat.replace(/{playerNamePossessive}/g, 'my');
            stringToFormat = stringToFormat.replace(/{playerPossessive}/g, 'my');
            stringToFormat = stringToFormat.replace(/{playerCopular}/g, 'am');
            stringToFormat = stringToFormat.replace(/{playerReferTo}/g, 'I');
            stringToFormat = stringToFormat.replace(/{playerReferToSelf}/g, 'myself');

        

        default:
            //Third person
            stringToFormat = stringToFormat.replace(/{playerName}/g, playerName);
            stringToFormat = stringToFormat.replace(/{playerNamePossessive}/g, `${playerName}'s`);
            stringToFormat = stringToFormat.replace(/{playerPossessive}/g, 'their');
            stringToFormat = stringToFormat.replace(/{playerCopular}/g, 'is');
            stringToFormat = stringToFormat.replace(/{playerReferTo}/g, 'they');
            stringToFormat = stringToFormat.replace(/{playerReferToSelf}/g, 'themself');

    }

    return stringToFormat.replace(/(?:^|(?:[.!?]\s))(.{1})/g, char => char.toUpperCase());
}

str = "{playerReferTo} tried to bring {playerReferToSelf} to perform. but {playerReferTo} just couldn't.";

console.log(formatGrammar("I", str));