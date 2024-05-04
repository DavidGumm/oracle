/**
 * Replaces placeholder values to ensure proper grammar. Note: Placeholders reference the player. Keep phrases to third person.
 * Placeholders:
 * @param {*} playerName 
 * @param {*} stringToFormat 
 * @returns 
 */
const formatGrammar = (playerName, stringToFormat) => {
    
    stringToFormat = stringToFormat.toLowerCase();
    switch (playerName) {
        case "You":
            //Second Person
            stringToFormat = stringToFormat.replace(/{bob}/g, 'you');
            stringToFormat = stringToFormat.replace(/{bob's}/g, 'your');
            stringToFormat = stringToFormat.replace(/{is}/g, 'are');
            stringToFormat = stringToFormat.replace(/{are}/g, 'are');
            stringToFormat = stringToFormat.replace(/{was}/g, 'were');
            stringToFormat = stringToFormat.replace(/{they}/g, 'you');
            stringToFormat = stringToFormat.replace(/{their}/g, 'your');
            stringToFormat = stringToFormat.replace(/{themself}/g, 'yourself');


        case "I":
            //First Person
            stringToFormat = stringToFormat.replace(/{bob}/g, playerName);
            stringToFormat = stringToFormat.replace(/{bob's}/g, 'my');
            stringToFormat = stringToFormat.replace(/{is}/g, 'am');
            stringToFormat = stringToFormat.replace(/{are}/g, 'am');
            stringToFormat = stringToFormat.replace(/{was}/g, 'was');
            stringToFormat = stringToFormat.replace(/{they}/g, 'I');
            stringToFormat = stringToFormat.replace(/{their}/g, 'my');
            stringToFormat = stringToFormat.replace(/{themself}/g, 'myself');

        

        default:
            //Third person
            stringToFormat = stringToFormat.replace(/{bob}/g, playerName);
            stringToFormat = stringToFormat.replace(/{bob's}/g, `${playerName}'s`);
            stringToFormat = stringToFormat.replace(/{is}/g, 'is');
            stringToFormat = stringToFormat.replace(/{are}/g, 'are');
            stringToFormat = stringToFormat.replace(/{was}/g, 'was');
            stringToFormat = stringToFormat.replace(/{they}/g, 'they');
            stringToFormat = stringToFormat.replace(/{their}/g, 'their');
            stringToFormat = stringToFormat.replace(/{themself}/g, 'themself');

    }

    return stringToFormat.replace(/(?:^|(?:[.!?]\s))(.{1})/g, char => char.toUpperCase());
}
playerName = "Timothy";
str = "Once upon a time {Bob} existed as a {bob}. {bob} is a rumor, a cosmic mystery. {Bob} had many talents, like world domination. {they} tried on many occasions to not take over the world, but {Bob} {is} just too good at it.";

console.log(formatGrammar(playerName, str));