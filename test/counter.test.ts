import { Counter } from './../src/counter';
// const Counter = require('../src/counter');

beforeEach(() => {
})

test('test constructor', () => {
    let name = 'test counter';
    let testCounter = new Counter(name, 3, 5);
    expect(testCounter.name).toBe(name);
    expect(testCounter.value).toBe(3);
    expect(testCounter.max).toBe(5);
});

test('test constructor value higher than max', () => {
    let name = 'gabe';
    let value = 5;
    let max = 3;
    let testCounter = new Counter(name, value, max);
    expect(testCounter.value).toBe(max);
    expect(testCounter.max).toBe(max);
})

test('test change value', () => {
    let name = 'gabe';
    let value = 3;
    let max = 10;
    let testCounter = new Counter(name, value, max);
    let newValue = 5
    testCounter.value = newValue;
    expect(testCounter.value).toBe(newValue);
    newValue = 15;
    testCounter.value = newValue;
    expect(testCounter.value).toBe(max);
})

test('test change max', () => {
    let name = 'gabe';
    let value = 3;
    let max = 5;
    let testCounter = new Counter(name, value, max);
    let newMax = 10;
    testCounter.max = newMax;
    expect(testCounter.max).toBe(newMax);
    let newValue = 15;
    testCounter.value = newValue;
    expect(testCounter.value).toBe(newMax);
})