import { Hoard } from './hoard';
import { InitiativeItem } from './initiativeItem';
import * as readline from 'readline';

export async function printOptions<E>(p: string, aList: E[], aFunc: (e:E) => string, rl: readline.Interface): Promise<E> {
    if (aList == null || aList.length == 0) {
        console.log('list is empty');
        return null;
    }

    console.log(p);

    let i = null;
    while (i === null || i >= aList.length || i < 0) {
        i = await promptNumber(myPrintFunction<E>(aList, aFunc), rl);
        if (i == null) {
            return null;
        }
        if (i >= aList.length || i < 0) {
            console.log('that was a bad number');
        }
    }

    return aList[i];
}

export async function prompt(p: string, rl: readline.Interface) {
    return new Promise<string>((resolve, reject) => {
        rl.question(p, (input) => {
            resolve(input);
        });
    });
}

export async function promptNumber(p: string, rl: readline.Interface) {
    return new Promise<number>((resolve, reject) => {
        rl.question(p, async (input) => {
            let toReturn: number = null;
            toReturn = parseInt(input);
            if (toReturn == null || isNaN(toReturn)) {
                if (!(input === 'e' || input === 'exit' || input === 'q' || input === 'quit')) {
                    console.log('that\'s not a number, dipshit');
                    toReturn = await promptNumber(p, rl);
                } else {
                    resolve(null);
                }
            }
            resolve(toReturn);
        })
    })
}

export async function getNum(character: Hoard, rl: readline.Interface) {
    let options: any = ['all'];
    for (let i=1; i<=character.characters.length; i++) {
        options.push(i);
    }

    let num = await printOptions<any>('how many members of this hoard will be affected?', options, (x) => x, rl);
    if (num === 'all') {
        num = character.characters.length;
    } // else, num is a number

    return num;
}

export async function getHoardStart(num: number, character: Hoard, rl: readline.Interface): Promise<number> {
    if (num != null) {
        if (num !== character.characters.length) {
            // ask user to pick a character to start with
            return getIndexOfCharacter(
                // (await printOptions(
                //     num == 1 ? 'who will be affected?' : 'who will be the first member to be affected?',
                //     character.characters,
                //     (char) => char.name,
                //     rl
                // )).name,
                await new Promise<string>(async (resolve, reject) => {
                    let myCharForName = await printOptions(
                        num == 1 ? 'who will be affected?' : 'who will be the first member to be affected?',
                        character.characters,
                        (char) => char.name,
                        rl
                    );
                    if (myCharForName != null) {
                        resolve(myCharForName.name);
                    } else {
                        resolve(null);
                    }
                }),
                character.characters
            );
        } else {
            // return the beginning of the characters
            return 0;
        }
    } else {
        return null;
    }
}

export async function pickACharacter(p: string, inputString: string[], characters: InitiativeItem[], rl: readline.Interface): Promise<InitiativeItem> {
    let character: InitiativeItem = null;
    if (inputString.length == 1) {
        character = await printOptions<InitiativeItem>(p, characters, (char) => char.name, rl);
    } else {
        let j = getIndexOfCharacter(inputString[1], characters);
        if (j === null) {
            console.log(`no character with name ${inputString[1]}`);
        } else {
            character = characters[j];
        }
    }

    return character;
}

export function getIndexOfCharacter(name: string, characters: InitiativeItem[]): number {
    if (name === null) {
        return null;
    }

    for (let i=0; i<characters.length; i++) {
        if (characters[i].name.toLowerCase() === name.toLowerCase()) {
            return i;
        }
    }

    return null;
}

export function trimStringArray(array: string[]) {
    for (let i=0; i<array.length; i++) {
        array[i] = array[i].trim();
    }
}

export function parseValueMax(valueMaxString: string): {
    value: number,
    max: number
} {
    let toReturn = {
        value: null,
        max: null
    };

    if (valueMaxString == null || valueMaxString === '-' || valueMaxString === '') {
        return toReturn;
    }

    const nums = valueMaxString.split('/');
    trimStringArray(nums);
    // nums[0] = value
    // nums[1] = max
    if (nums.length > 2) {
        console.log('incorrect input for counter');
        return toReturn;
    }
    try {
        toReturn.value = parseInt(nums[0]);
        if (nums.length === 2) {
            toReturn.max = parseInt(nums[1]);
        }
    } catch {
        console.log('incorrect input for counter');
    }

    return toReturn;
}

function myPrintFunction<E>(aList: E[], aFunc: (e:E) => string): string {
    let toReturn = '';
    for (let i=0; i<aList.length; i++) {
        toReturn += `[${i}] ${aFunc(aList[i])}\n`;
    }
    toReturn += 'pick one of the options\n';

    return toReturn;
}

