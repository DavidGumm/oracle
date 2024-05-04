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
            stringToFormat = stringToFormat.replace(/{player}/g, playerName);
            stringToFormat = stringToFormat.replace(/{player's}/g, 'your');
            stringToFormat = stringToFormat.replace(/{their}/g, 'your');
            stringToFormat = stringToFormat.replace(/{is}/g, 'are');
            stringToFormat = stringToFormat.replace(/{are}/g, 'are');
            stringToFormat = stringToFormat.replace(/{they}/g, 'you');
            stringToFormat = stringToFormat.replace(/{themself}/g, 'yourself');


        case "I":
            //First Person
            stringToFormat = stringToFormat.replace(/{player}/g, playerName);
            stringToFormat = stringToFormat.replace(/{player's}/g, 'my');
            stringToFormat = stringToFormat.replace(/{their}/g, 'my');
            stringToFormat = stringToFormat.replace(/{is}/g, 'am');
            stringToFormat = stringToFormat.replace(/{are}/g, 'am');
            stringToFormat = stringToFormat.replace(/{they}/g, 'I');
            stringToFormat = stringToFormat.replace(/{themself}/g, 'myself');

        

        default:
            //Third person
            stringToFormat = stringToFormat.replace(/{player}/g, playerName);
            stringToFormat = stringToFormat.replace(/{player's}/g, `${playerName}'s`);
            stringToFormat = stringToFormat.replace(/{their}/g, 'their');
            stringToFormat = stringToFormat.replace(/{is}/g, 'is');
            stringToFormat = stringToFormat.replace(/{are}/g, 'are');
            stringToFormat = stringToFormat.replace(/{they}/g, 'they');
            stringToFormat = stringToFormat.replace(/{themself}/g, 'themself');

    }

    return stringToFormat.replace(/(?:^|(?:[.!?]\s))(.{1})/g, char => char.toUpperCase());
}
playerName = "Jeffrey";
str = "{player} tried to do something. But {they} slipped and fell on {their} face. now {they} {are} on a quest for revenge against Sir Issac Newton, even though that doesn't make any sense.";

console.log(formatGrammar("I", str));