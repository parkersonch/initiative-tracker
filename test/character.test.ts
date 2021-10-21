import { Character } from '../src/character';

let defaultName: string = 'gabe';
let defaultInitiative: number = 15;
let defaultConditions: string[] = [];
let defaultHp: number = 3;
let defaultMaxHp: number = 5;
let defaultTempHp: number = null;

test('test constructor basic', () => {
    let testCharacter = initializeCharacter();

    testCharacterValues(
        testCharacter
    );
});

test('test constructor only pass name', () => {
    let testCharacter = new Character(
        defaultName
    );

    testCharacterValues(
        testCharacter,
        defaultName,
        null,
        [],
        null,
        null
    );
});

test('test change hp', () => {
    let testCharacter = initializeCharacter();
    let newHp = 1;
    testCharacter.hp = 1;
    expect(testCharacter.hp).toBe(newHp);
    newHp = defaultMaxHp + 2;
    testCharacter.hp = newHp;
    expect(testCharacter.hp).toBe(defaultMaxHp);
});

test('test add/remove conditions', () => {
    let testCharacter = initializeCharacter();
    let newConditions = [
        'pos',
        'sit'
    ]
    testCharacter.addConditions(newConditions);
    testCharacterConditions(testCharacter, newConditions);
    let moreNewConditions = [
        'pee',
        'poonis'
    ]
    testCharacter.addConditions(moreNewConditions);
    testCharacterConditions(testCharacter, newConditions.concat(moreNewConditions));
    testCharacter.removeConditions([
        'sit',
        'pee'
    ]);
    testCharacterConditions(testCharacter, [
        'pos',
        'poonis'
    ]);
});

test('test add/set/incriment counter', () => {
    let testCharacter = initializeCharacter();
    let counterName = 'test';
    let counterValue = 5;
    let counterMax = 12;
    testCharacter.addCounter(
        counterName,
        counterValue,
        counterMax
    );
    expect(testCharacter.getCounter(counterName)).toBe(counterValue);
    expect(testCharacter.getCounterMax(counterName)).toBe(counterMax);
    
    counterValue = 9;
    testCharacter.setCounter(counterName, counterValue);
    expect(testCharacter.getCounter(counterName)).toBe(counterValue);

    testCharacter.setCounter(counterName, counterMax + 5);
    expect(testCharacter.getCounter(counterName)).toBe(counterMax);

    testCharacter.setCounter(counterName, counterValue);
    testCharacter.increaseCounter(counterName, 1);
    expect(testCharacter.getCounter(counterName)).toBe(counterValue+1);
    testCharacter.increaseCounter(counterName, 100);
    expect(testCharacter.getCounter(counterName)).toBe(counterMax);
    testCharacter.increaseCounter(counterName, -3);
    expect(testCharacter.getCounter(counterName)).toBe(counterMax-3);

    testCharacter.addCounter(
        'new counter',
        8,
        17
    );

    counterValue = 9;
    testCharacter.setCounter(counterName, counterValue);
    expect(testCharacter.getCounter(counterName)).toBe(counterValue);

    testCharacter.setCounter(counterName, counterMax + 5);
    expect(testCharacter.getCounter(counterName)).toBe(counterMax);

    testCharacter.setCounter(counterName, counterValue);
    testCharacter.increaseCounter(counterName, 1);
    expect(testCharacter.getCounter(counterName)).toBe(counterValue+1);
    testCharacter.increaseCounter(counterName, 100);
    expect(testCharacter.getCounter(counterName)).toBe(counterMax);
    testCharacter.increaseCounter(counterName, -3);
    expect(testCharacter.getCounter(counterName)).toBe(counterMax-3);

    counterName = 'new counter';
    counterMax = 17;

    counterValue = 9;
    testCharacter.setCounter(counterName, counterValue);
    expect(testCharacter.getCounter(counterName)).toBe(counterValue);

    testCharacter.setCounter(counterName, counterMax + 5);
    expect(testCharacter.getCounter(counterName)).toBe(counterMax);

    testCharacter.setCounter(counterName, counterValue);
    testCharacter.increaseCounter(counterName, 1);
    expect(testCharacter.getCounter(counterName)).toBe(counterValue+1);
    testCharacter.increaseCounter(counterName, 100);
    expect(testCharacter.getCounter(counterName)).toBe(counterMax);
    testCharacter.increaseCounter(counterName, -3);
    expect(testCharacter.getCounter(counterName)).toBe(counterMax-3);
});

function initializeCharacter(
    name: string = defaultName,
    initiative: number = defaultInitiative,
    conditions: string[] = defaultConditions,
    hp: number = defaultHp,
    maxHp: number = defaultMaxHp,
    tempHp: number = defaultTempHp
): Character {
    let testCharacter = new Character(
        name,
        initiative,
        conditions,
        hp,
        maxHp
    );
    return testCharacter;
}

function testCharacterValues(
    character: Character,
    name: string = defaultName,
    initiative: number = defaultInitiative,
    conditions: string[] = defaultConditions,
    hp: number = defaultHp,
    maxHp: number = defaultMaxHp,
    tempHp: number = defaultTempHp
) {
    expect(character.name).toBe(name);
    expect(character.initiative).toBe(initiative);
    testCharacterConditions(character, conditions);
    expect(character.hp).toBe(hp);
    expect(character.maxHp).toBe(maxHp);
}

function testCharacterConditions(
    character: Character,
    expectedConditions: string[]
) {
    expect(character.conditions.length).toBe(expectedConditions.length);
    for (let i = 1; i < character.conditions.length; i++) {
        expect(character.conditions[i]).toBe(expectedConditions[i]);
    }
}