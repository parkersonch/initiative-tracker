import { Counter } from './counter';
import { InitiativeItem } from './initiativeItem';
import * as fs from 'fs';
import * as readline from 'readline';
import { getNum, printOptions, prompt, promptNumber, getIndexOfCharacter, getHoardStart, pickACharacter, trimStringArray, parseValueMax } from './utility';
import { Hoard } from './hoard';
import { Character } from './character';

let inputFileName = 'D:\\Users\\egost\\Documents\\ttrpg\\initiative-tracker\\input.txt';
let outputFileName = 'D:\\Users\\egost\\Documents\\ttrpg\\initiative-tracker\\initiative.txt';
let p = '$: ';

function main() {
    const file = fs.readFileSync(inputFileName, 'utf-8');
    const characters = [];

    const lines = file.split('\n');

    // initialize characters
    lines.forEach((line)=>{
        // don't process comments
        if (line.charAt(0) === '#') {
            return;
        }

        const stringArray = line.split(': ');
        // stringArray[0] = name
        // stringArray[1] = initiative count; hp/hp max; condition1, condition2, etc.; is hoard; counter 1 name, value/max [] counter 2 name, value/max
        
        // handle wrong number of colons
        if (stringArray.length !== 2) {
            console.log('error: did not understand input; one line had not the right number of colons')
            return;
        }

        const name = stringArray[0];
        const values = stringArray[1].split(';');
        // values[0] = initiative count
        // values[1] = hp/hp max (or -)
        // values[2] = condition1, condition2, etc
        // values[3] = hoard, numCharacters
        // values[4] = counter 1 name, value/max [] counter 2 name, value/max
        for (let i=0; i<values.length; i++) {
            values[i] = values[i].trim();
        }

        const initiative = parseInt(values[0]);
        const conditions = [];
        let hp = null;
        let maxHp = null;
        let hoard = false;
        let numCharacters = 1;
        let counters: {
            name: string,
            value: number,
            max: number
        }[] = null;

        // hp
        if (values.length > 1) {
            // print(values[1])
            // handle hp
            let hpObject = parseHp(values[1], name);
            hp = hpObject.hp;
            maxHp = hpObject.maxHp;
        }
        // conditions
        if (values.length >= 3) {
            values[2].split(', ').forEach((condition)=>{
                if (condition !== '') {
                    conditions.push(condition.trim());
                }
            })
        }

        // hoards
        if (values.length >= 4) {
            const hoardValue = values[3].split(', ');
            if (hoardValue[0].trim().toLowerCase() === 'hoard') {
                hoard = true;
                try {
                    numCharacters = parseInt(hoardValue[1].trim());
                } catch {
                    console.log('you tried to make a hoard, but didn\'t give a number for hoard size');
                    return;
                }
            }
        }

        // counters
        if (values.length >= 5) {
            const counterStrings = values[4].split('[]');
            trimStringArray(counterStrings);

            counters = [];
            
            counterStrings.forEach((counterString) => {
                const counterValues = counterString.split(',');
                trimStringArray(counterValues);

                //counterValues[0] = counter name
                // counterValues[1] = value/max
                let counterName = counterValues[0];
                let nums = parseValueMax(counterValues[1]);

                counters.push({
                    name: counterName,
                    value: nums.value,
                    max: nums.max
                });
                
            })
            // console.log(counterStrings);
        }

        let newItem: InitiativeItem = null;
        if (hoard) {
            newItem = new Hoard(
                name,
                initiative,
                conditions,
                hp,
                maxHp,
                null,
                numCharacters
            )
        } else {
            newItem = new Character(
                name,
                initiative,
                conditions,
                hp,
                maxHp
            )
        }

        if (counters != null) {
            counters.forEach((counter) => {
                if (newItem instanceof Character) {
                    newItem.addCounter(counter.name, counter.value, counter.max);
                }
            })
        }

        if (newItem !== null) {
            characters.push(newItem);
        }
    });

    sortItems(characters);
    // console.log(characters);

    // loop setup
    let currentCharacter=0;
    let round = 1;
    writeInitiative(characters, currentCharacter, round);

    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    inputLoop(rl, currentCharacter, characters, round);
}

async function inputLoop(rl: readline.Interface, currentCharacter: number, characters: InitiativeItem[], round: number) {
    rl.question(p, async (input) => {
        input = input.trim().toLowerCase();
        let inputString = input.split(';');

        for (let i=0; i<inputString.length; i++) {
            inputString[i] = inputString[i].trim().toLowerCase();
        }

        switch(inputString[0]) {
            case 'e':
            case 'exit':
            case 'end':
            case 'quit':
            case 'wq':
            case 'q':
                rl.close();
                return;
            case 'n':
            case 'next':
                currentCharacter = getNextIndex(currentCharacter, characters);
                if (currentCharacter === 0) {
                    round++;
                }
                break;
            case 'ac':
            case 'c':
            case 'condition':
            case 'conditions':
            case 'add condition':
            case 'add conditions': {
                // inputString[1] = character name
                // inputString[2, 3, etc.] = condition(s)

                // get character
                let character = await pickACharacter('Pick a character to add conditions to', inputString, characters, rl);
                if (character !== null &&
                    (character instanceof Hoard || character instanceof Character)
                    ) {
                    let conditions: string[] = null;
                    if (inputString.length > 2) {
                        conditions = inputString.slice(2);
                    } else {
                        let conditionsString = await prompt(
                            'enter conditions to add; separate conditions with a comma: ',
                            rl
                            );
                        conditions = conditionsString.split(',');
                    }

                    if (conditions !== null) {
                        conditions.forEach((condition) => {
                            condition = condition.trim();
                        });
                        // handle hoards and characters differently
                        if (character instanceof Hoard) {
                            let num = await getNum(character, rl);
                            let start = await getHoardStart(num, character, rl)

                            if (num != null && start != null) {
                                character.charactersAddConditions(conditions, num, start);
                            }
                        } else {
                            character.addConditions(conditions);
                        }
                    }
                }
                break;
            }

            case 'rc':
            case 'remove conditions':
            case 'remove condition': {
                // inputString[1] = character name
                // inputString[2, 3, etc.] = condition(s)

                // get the character we will be modifying
                let character = await pickACharacter('Pick a character to remove conditions from', inputString, characters, rl);

                // character will still be none at this point if the user
                // inputed a name that doesn't belong to any character
                if (character !== null &&
                    (character instanceof Hoard || character instanceof Character)
                    ) {
                    // get list of conditions to remove
                    let toRemove = null;
                    if (inputString.length > 2) {
                        toRemove = inputString.slice(2);
                    } else {
                        // handle hoards and other initiative items differently
                        if (character instanceof Hoard) {
                            toRemove = [await printOptions('what condition do you want to remove from members of the hoard?', character.charactersGetConditions(), (condition) => condition, rl)];
                        } else {
                            toRemove = [await printOptions(`what condition do you want to remove from ${character.name}`, character.conditions, (condition) => condition, rl)]
                        }
                    }

                    if (toRemove !== null) {
                        // handle hoards and other initiative items differently
                        if (character instanceof Hoard) {
                            let num = await getNum(character, rl);

                            character.charactersRemoveConditions(toRemove, num);
                        } else {
                            // normal initiative item
                            character.removeConditions(toRemove);
                        }
                    }
                
                
                }
                break;
            }

            case 'r':
            case 'remove':
            case 'remove character': {
                // inputString[1] = character name
                let character = await pickACharacter('Pick a character to remove', inputString, characters, rl);
                if (character != null) {
                    characters = characters.filter((char) => char.name !== character.name);
                }
                
                break;
            }

            case 'a':
            case 'add':
            case 'add character': {
                // inputString[1] = character name
                // inputString[2] = initiative
                // inputString[3] = hp
                // inputString[4, 5, etc.] = conditions

                // get name
                let name: string = null;
                if (inputString.length >= 2) {
                    name = inputString[1];
                } else {
                    name = await prompt('enter character name: ', rl);
                }

                // get initiative
                let initiative: number = null;
                if (inputString.length >= 3) {
                    try {
                        initiative = parseInt(inputString[2]);
                    } catch {
                        console.log('initiative isn\'t a number');
                    }
                } else {
                    initiative = await promptNumber('enter initiative: ', rl);
                }

                // get hp
                let hp: number = null;
                let maxHp: number = null;
                if (inputString.length >= 4) {
                    let hpObject = parseHp(inputString[3], name);
                    hp = hpObject.hp;
                    maxHp = hpObject.maxHp;
                } else {
                    hp = await promptNumber('enter hp: ', rl);
                    maxHp = await promptNumber('enter maxHp: ', rl);
                }

                // get conditions
                let conditions = [];
                if (inputString.length >= 5) {
                    conditions = inputString.slice(4);
                }

                if (name != null && initiative != null) {
                    let newCharacter = new Character(
                        name,
                        initiative,
                        conditions,
                        hp,
                        maxHp,
                        null
                    );
                    characters.push(newCharacter);
                    sortItems(characters);
                } else {
                    console.log('couldn\'t create character bc you either fucked up the name or the initiative');
                }

                break;
            }

            case 'h':
            case 'heal': {            
                // inputString[1] = character name
                // inputString[2] = heal amount
                let character = await pickACharacter('Pick a character to heal', inputString, characters, rl);
                if (character != null) {
                    if (character instanceof Character) {
                        await modifyCharacterByValue(
                            inputString,
                            character,
                            async (char: Character, healAmount: number) => {
                                char.heal(healAmount);
                            },
                            `enter amount to heal ${character.name}: `,
                            'heal amount was not a number',
                            rl
                        );
                    } else if (character instanceof Hoard) {
                        await modifyHoardByValue(
                            inputString,
                            character,
                            async (hoard, healAmount) => {
                                let num = await getNum(hoard, rl);
                                let start = await getHoardStart(num, hoard, rl);
                                if (num != null && !isNaN(num)) {
                                    hoard.heal(healAmount, num, start);
                                } else {
                                    console.log('that\'s not a number');
                                }
                            },
                            `enter amount to heal ${character.name}: `,
                            'heal amount was not a number',
                            rl
                        )
                    }
                } else {
                    console.log('ayo that\'s not a character');
                }

                break;
            }

            case 'd':
            case 'damage': {
                // inputString[1] = character name
                // inputString[2] = damage amount
                let character = await pickACharacter('Pick a character to damage', inputString, characters, rl);
                if (character != null) {
                    if (character instanceof Character) {
                        await modifyCharacterByValue(
                            inputString,
                            character,
                            async (char: Character, damageAmount: number) => {
                                char.damage(damageAmount);
                            },
                            `enter amount to damage ${character.name}: `,
                            'damage amount was not a number',
                            rl
                        );
                    } else if (character instanceof Hoard) {
                        await modifyHoardByValue(
                            inputString,
                            character,
                            async (hoard, damageAmount) => {
                                let num = await getNum(hoard, rl);
                                if (num == null || isNaN(num)) {
                                    console.log('that\'s not a number');
                                    return;
                                }
                                let start = await getHoardStart(num, hoard, rl);
                                if (start != null && !isNaN(start)) {
                                    hoard.damage(damageAmount, num, start);
                                } else {
                                    console.log('that\'s not a number');
                                }
                            },
                            `enter amount to damage ${character.name}: `,
                            'damage amount was not a number',
                            rl
                        )
                    }
                } else {
                    console.log('that\'s not a character');
                }

                break;
            }

            case 'hp':
            case 'set hp': {
                // inputString[1] = character name
                // inputString[2] = new hp
                let character = await pickACharacter('Pick a character whose hp you want to change', inputString, characters, rl);
                if (character != null) {
                    if (character instanceof Character) {
                        await modifyCharacterByValue(
                            inputString,
                            character,
                            async (char: Character, newHp: number) => {
                                char.hp = newHp;
                            },
                            `enter new hp for ${character.name}: `,
                            'hp was not a number',
                            rl
                        );
                    } else if (character instanceof Hoard) {
                        await modifyHoardByValue(
                            inputString,
                            character,
                            async(hoard, newHp) => {
                                let num = await getNum(hoard, rl);
                                let start = await getHoardStart(num, hoard, rl);
                                if (num != null && !isNaN(num)) {
                                    hoard.setHp(newHp, num, start);
                                } else {
                                    console.log('that\'s not a number');
                                }
                            },
                            `enter new hp for ${character.name}: `,
                            'hp was not a number',
                            rl
                        );
                    }
                    
                } else {
                    console.log('no such character');
                }

                break;            
            }

            case 'mhp':
            case 'maxhp':
            case 'set maxhp': {
                // inputString[1] = character name
                // inputString[2] = new max hp
                let character = await pickACharacter('Pick a character whose max hp you want to change', inputString, characters, rl);
                if (character != null) {
                    if (character instanceof Character) {
                        await modifyCharacterByValue(
                            inputString,
                            character,
                            async (char, newMaxHp) => {
                                char.maxHp = newMaxHp;
                            },
                            `enter new max hp for ${character.name}: `,
                            'max hp was not a number',
                            rl
                        )
                    } else if (character instanceof Hoard) {
                        await modifyHoardByValue(
                            inputString,
                            character,
                            async (hoard: Hoard, newMaxHp: number) => {
                                let num = await getNum(hoard, rl);
                                let start = await getHoardStart(num, hoard, rl);
                                if (num != null && !isNaN(num)) {
                                    hoard.setMaxHp(newMaxHp, num, start);
                                }
                            },
                            `enter new max hp for ${character.name}: `,
                            'max hp was not a number',
                            rl
                        );
                    }                    
                } else {
                    console.log('no such character');
                }

                break;
            }

            case 'ai':
            case 'add counter':
            case 'add i':
            case 'addi': {
                // inputString[1] = character name
                // inputString[2] = counter name
                // inputString[3] = value
                // inputString[4] = max
                let character: InitiativeItem = await pickACharacter('which character do you want to add a counter to?', inputString, characters, rl);
                if (character != null && character instanceof Character || character instanceof Hoard) {
                    let name: string = null;
                    let value: number = null;
                    let max: number = null;
                    
                    if (inputString.length > 2) {
                        name = inputString[2];
                    } else {
                        name = await prompt('what counter do you want to add? ', rl);
                    }

                    if (inputString.length > 3) {
                        value = parseInt(inputString[3]);
                    } else {
                        value = await promptNumber('what will the counter\'s value be? ', rl);
                    }

                    if (inputString.length > 4) {
                        max = parseInt(inputString[4]);
                    } else {
                        max = await promptNumber('what will the counter\'s max be? ', rl);
                    }

                    if (character instanceof Character) {
                        character.addCounter(name, value, max);
                    } else {
                        let num = await getNum(character, rl);
                        let start = await getHoardStart(num, character, rl);

                        if (num != null && start != null) {
                            character.addCounter(name, value, max, num, start);
                        }
                    }
                }

                break;
            }

            case 'ii': {
                // inputString[1] = character name
                let character = await pickACharacter('Which character do you want to increase a counter for?', inputString, characters, rl);
                if (character != null && character instanceof Character) {
                    let counter: Counter = await printOptions(
                        'what counter do you want to increase?',
                        character.counters,
                        (counter) => {
                            return counter.name;
                        },
                        rl
                    );
                    if (counter != null) {
                        let valueToIncreaseBy = await promptNumber('what do you want the counter to increase by? ', rl);
                        if (valueToIncreaseBy != null) {
                            character.increaseCounter(counter.name, valueToIncreaseBy);
                        }
                    }
                }

                break;
            }

            case 'iim': {
                let character = await pickACharacter('Which character do you want to increase a counter\'s max for?', inputString, characters, rl);
                if (character != null && character instanceof Character) {
                    let counter: Counter = await printOptions(
                        'what counter do you want to increase the max for?',
                        character.counters,
                        (counter) => {
                            return counter.name;
                        },
                        rl
                    );
                    if (counter != null) {
                        let valueToIncreaseBy = await promptNumber('what do you want the counter\'s max to increase by? ', rl);
                        if (valueToIncreaseBy != null) {
                            character.increaseCounterMax(counter.name, valueToIncreaseBy);
                        }
                    }
                }

                break;
            }

            case 'si': {
                let character = await pickACharacter('Which character do you want to set a counter for?', inputString, characters, rl);
                if (character != null && character instanceof Character) {
                    let counter: Counter = await printOptions(
                        'what counter do you want to set?',
                        character.counters,
                        (counter) => {
                            return counter.name;
                        },
                        rl
                    );
                    if (counter != null) {
                        let newValue = await promptNumber('what new value do you want for this counter?', rl);
                        if (newValue != null) {
                            character.setCounter(counter.name, newValue);
                        }
                    }
                }

                break;
            }

            case 'ri': {
                let character = await pickACharacter('Which character do you want to remove a counter for?', inputString, characters, rl);
                if (character != null && character instanceof Character) {
                    let counter: Counter = await printOptions(
                        'which counter do you want to remove?',
                        character.counters,
                        (counter) => {
                            return counter.name;
                        },
                        rl
                    );
                    if (counter != null) {
                        character.removeCounter(counter.name);
                    }
                }
            }

        }

        writeInitiative(characters, currentCharacter, round);
        inputLoop(rl, currentCharacter, characters, round);
    });
}

function writeInitiative(characters: InitiativeItem[], currentCharacter: number, round: number) {
    // empty array
    let finishWrite = (toWrite: string) => {
        fs.writeFile(outputFileName, toWrite, (err) => {
            if (err) {
                return console.log('error');
            }
        });
    }

    if (characters.length === 0) {
        let toWrite = 'no characters in combat';
        finishWrite(toWrite);
        return;
    }

    // problems with i
    if (currentCharacter >= characters.length) {
        throw new Error('write initiatvie: i is too big');
    }
    if (currentCharacter < 0) {
        throw new Error('write initiative: i is too small');
    }

    let toWrite = 'Current Turn:\n';
    toWrite += getCharacterInitiativeString(characters, currentCharacter);
    toWrite += '\nNext in order:\n';

    let index = getNextIndex(currentCharacter, characters);

    while (index != currentCharacter) {
        toWrite += getCharacterInitiativeString(characters, index);

        index = getNextIndex(index, characters);
    }

    toWrite += `\nRound: ${round}\n\n\nbrought to you by DM Bowtie TM`;

    finishWrite(toWrite);
}

function getCharacterInitiativeString(characters: InitiativeItem[], i) {
    let toReturn = characters[i].getInitiativeString();
    if (i === characters.length-1) {
        toReturn += '--END OF ROUND--\n';
    }
    return toReturn;
}
function sortItems(items: InitiativeItem[]): void {
    items.sort((a, b) => b.initiative - a.initiative);
}

function getNextIndex(i: number, characters: InitiativeItem[]) {
    return (i+1) % characters.length;
}





function parseHp(hpString: string, characterName: string): {
    hp: number,
    maxHp: number
} {
    let toReturn = {
        hp: null,
        maxHp: null
    }
    if (hpString === '-' || hpString === '') {
        return toReturn;
    }

    const hpValues = hpString.split('/');
    // hpValues[0] = hp
    // hpValues[1] = hpMax
    if (hpValues.length > 2) {
        console.log(`hp was inputed incorrectly for ${characterName}`)
        return toReturn;
    }
    try {
        toReturn.hp = parseInt(hpValues[0].trim());
        if (hpValues.length === 2) {
            toReturn.maxHp = parseInt(hpValues[1].trim());
        }
    } catch {
        console.log(`hp was inputed incorrectly for ${characterName}`);
    }

    return toReturn;
}

async function modifyCharacterByValue(inputString: string[], character: Character, myFunc: (char: Character, amount: number) => Promise<void>, p: string, e: string, rl: readline.Interface) {
    let amount: number = null;
    if (inputString.length >= 3) {
        amount = parseInt(inputString[2]);
    } else {
        amount = await promptNumber(p, rl);
    }

    if (!isNaN(amount)) {
        await myFunc(character, amount);
    } else {
        console.log(e);
    }
}

async function modifyHoardByValue(inputString: string[], hoard: Hoard, myFunc: (hoard: Hoard, amount: number) => Promise<void>, p: string, e: string, rl: readline.Interface) {
    let amount: number = null;
    if (inputString.length >= 3) {
        amount = parseInt(inputString[2]);
    } else {
        amount = await promptNumber(p, rl);
    }

    if (!isNaN(amount)) {
        await myFunc(hoard, amount);
    } else {
        console.log(e);
    }
}

main();