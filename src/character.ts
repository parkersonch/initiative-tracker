import { HasHp } from './hasHp';
import { InitiativeItem } from './initiativeItem';
import { Counter } from './counter';
export class Character implements InitiativeItem, HasHp {
    private _name: string;
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    
    private _initiative: number;
    public get initiative(): number {
        return this._initiative;
    }
    public set initiative(value: number) {
        this._initiative = value;
    }

    private _conditions: string[];
    public get conditions(): string[] {
        return this._conditions;
    }
    private set conditions(value: string[]) {
        this._conditions = value;
    }

    public get hp(): number {
        console.log('here\'s what i\'m about to get:')
        console.log(this.getCounter('hp'));
        let hpCounter: Counter = this.getCounter('hp');
        console.log('oh boy, here it comes!');
        console.log(hpCounter);
        if (hpCounter != null) {
            return hpCounter.value;
        } else {
            return null;
        }
    }
    public set hp(value: number) {
        this.setCounter('hp', value);
        console.log(`${this.name}'s hp should now be ${value}. it is actually ${this.hp}`);
        if (this.hp <= 0) {
            this.addConditions([this.nohpCondition]);
        }
    }
    public get maxHp(): number {
        return this.getCounter('hp').max;
    }
    public set maxHp(value: number) {
        this.setCounterMax('hp', value);
    }
    public get tempHp(): number {
        return this.getCounter('temp hp').value;
    }
    public set tempHp(value: number) {
        this.setCounter('temp hp', value);
    }

    private counters: Counter[] = [];

    private _nohpCondition = "incapacitated";
    public get nohpCondition() {
        return this._nohpCondition;
    }
    public set nohpCondition(value) {
        this._nohpCondition = value;
    }

    constructor(
        name: string,
        initiative: number = null,
        conditions: string[] = [],
        hp: number = null,
        maxHp: number = null
    ) {
        this.name = name;
        this.initiative = initiative;
        this.conditions = conditions;

        this.addCounter(
            'hp',
            hp,
            maxHp
        )
        console.log(`${this.name} has ${this.hp} hp, but they should have ${hp} hp`);
    }
    
    getInitiativeString(): string {
        let toReturn = `\t${this.name}`
        if (this.initiative != null && !isNaN(this.initiative)) {
            toReturn += `: ${this.initiative}`;
        }

        if (this.hp != null && !isNaN(this.hp)) {
            toReturn+='\n\t\t';
            if (this.tempHp != null && !isNaN(this.tempHp)) {
                toReturn += `${this.tempHp} temp hp -- `;
            }
            toReturn += `${this.hp}`
            if (this.maxHp != null && !isNaN(this.maxHp)) {
                toReturn += `/${this.maxHp}`;
            }
            toReturn += ' hp';
        }

        this.counters.forEach((counter) => {
            if (counter.name !== 'hp' && counter.name !== 'temp hp') {
                toReturn += '\n\t\t';
                toReturn += `${counter.value}`;
                if (counter.max != null && !isNaN(counter.max)) {
                    toReturn += `/${counter.max}`;
                }
                toReturn += ` ${counter.name}`
            }
        });

        if (this.conditions.length !== 0) {
            toReturn += `\n\t\tConditions: ${this.conditions[0]}`;
            for (let i = 1; i < this.conditions.length; i++) {
                toReturn += `, ${this.conditions[i]}`;
            }
        }

        toReturn += '\n';

        return toReturn;
    }

    addConditions(newConditions: string[]) {
        newConditions.forEach((condition)=>{
            this.conditions.push(condition);
        })
    }

    removeConditions(conditions: string[]) {
        conditions.forEach((toRemove)=>{
            this.conditions = this.conditions.filter(
                (value: string) => value !== toRemove
                );
        })
    }

    addCounter(name: string, value: number, max: number) {
        console.log(`addCounter(): value is ${value}`);
        if (this.getCounter(name) == null) {
            this.counters.push(new Counter(
                name,
                value,
                max
            ));
            console.log(this.counters);
        } else {
            console.log('there\'s already a counter with that name');
        }

        
        
    }

    getCounter(name: string): Counter {
        console.log(this.counters);
        this.counters.forEach((counter) => {
            console.log(`does ${counter.name} == ${name}?`)
            if (counter.name === name) {
                console.log('yes, so here\'s the counter');
                console.log(counter);
                return counter;
            } else {
                console.log('no');
            }
        });
        return null;
    }

    setCounter(name: string, num: number) {
        this.performOperationOnCounter(
            name,
            (counter: Counter) => {
                counter.value = num;
            }
        )
    }

    increaseCounter(name: string, num: number) {
        this.performOperationOnCounter(
            name,
            (counter: Counter) => {
                counter.add(num);
            }
        )
    }

    decreaseCounter(name: string, num: number) {
        this.performOperationOnCounter(
            name,
            (counter: Counter) => {
                counter.subtract(num);
            }
        )
    }

    setCounterMax(name: string, num: number) {
        this.performOperationOnCounter(
            name,
            (counter: Counter) => {
                counter.max = num;
            }
        )
    }

    increaseCounterMax(name: string, num: number) {
        this.performOperationOnCounter(
            name,
            (counter: Counter) => {
                counter.max += num;
            }
        )
    }

    decreaseCounterMax(name: string, num: number) {
        this.increaseCounter(name, -num);
    }

    performOperationOnCounter(name: string, operation: (counter: Counter) => any) {
        let counter: Counter = this.getCounter(name);
        if (counter != null) {
            operation(counter);
        } else {
            console.log('no counter with that name');
        }
    }

    getNullCounter(): Counter {
        return new Counter(
            null
        );
    }
}