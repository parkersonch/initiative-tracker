import { Counter } from './counter';
import { HasHp } from './hasHp';
import { InitiativeItem } from './initiativeItem';
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
        return this.getCounter('hp');
    }
    public set hp(value: number) {
        this.setCounter('hp', value);
    }

    public get maxHp(): number {
        return this.getCounterMax('hp');
    }
    public set maxHp(value: number) {
        // if (this.maxHp === null) {
        //     this._maxHp = value;
        //     this.hp = this.hp;
        // } else {
        //     const hpMaxDiff = value - this.maxHp;
        //     this._maxHp = value;
        //     // when hpMax changes, hp goes up or down with it
        //     this.heal(hpMaxDiff);
        // }
        let hpMaxDiff = value - this.maxHp;
        this.setCounterMax('hp', value);
        this.increaseCounter('hp', hpMaxDiff);
    }

    private _tempHp: number;
    public get tempHp(): number {
        return this._tempHp;
    }
    private set tempHp(value: number) {
        this._tempHp = value;
        if (this.tempHp != null && this.tempHp <= 0) {
            this._tempHp = null
        }
    }

    private _counters: Counter[];
    public get counters(): Counter[] {
        return this._counters;
    }
    public set counters(value: Counter[]) {
        this._counters = value;
    }

    constructor(
        name: string,
        initiative: number = null,
        conditions: string[] = [],
        hp: number = null,
        maxHp: number = null,
        tempHp: number = null
    ) {
        this.name = name;
        this.initiative = initiative;
        this.conditions = conditions;
        this.tempHp = tempHp;

        this.counters = [];

        this.addCounter('hp', hp, maxHp);
    }

    heal(healAmount: number) {
        if (this.hp !== null) {
            this.hp+=healAmount;
        }
    }

    getInitiativeString() {
        let toReturn = `\t${this.name}: ${this.initiative}`;
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

        if (this.counters.length !== 0) {
            this.counters.forEach((counter) => {
                if (counter.name != 'hp') {
                    toReturn += `\n\t\t\t${counter.name}: ${counter.value}`;
                    if (counter.max != null) {
                        toReturn += `/${counter.max}`;
                    }
                }
            })
        }

        if (this.conditions.length !== 0) {
            toReturn += `\n\t\tConditions: ${this.conditions[0]}`;
            for (let i = 1; i < this.conditions.length; i++) {
                toReturn += `, ${this.conditions[i]}`;
            }
        }

        toReturn += '\n';

        return toReturn;
    }

    damage(damageAmount: number) {
        if (this.tempHp !== null) {
            const leftOverDamage = damageAmount - this.tempHp;
            this.tempHp-=damageAmount;
            if (leftOverDamage > 0) {
                this.hp -= leftOverDamage;
            }
        } else {
            this.hp -= damageAmount;
        }

        if (this.hp <= 0) {
            this.addConditions(['incapacitated']);
        }
    }

    addConditions(newConditions: string[]) {
        newConditions.forEach((condition)=>{
            this.conditions.push(condition.trim());
        })
    }

    removeConditions(conditions: string[]) {
        conditions.forEach((toRemove)=>{
            this.conditions = this.conditions.filter(
                (value: string) => value !== toRemove
            );
        })
    }

    removeCounter(counterName: string) {
        this.counters = this.counters.filter(
            (counter: Counter) => counter.name !== counterName
        );
    }

    addCounter(name: string, value: number, max: number) {
        if (this.getCounter(name) == null) {
            this.counters.push(new Counter(
                name,
                value,
                max
            ));
        }
    }

    private _getCounter(name: string): Counter {
        let toReturn: Counter = null;
        this.counters.forEach((counter) => {
            if (counter.name == name) {
                toReturn = counter;
            }
        })
        return toReturn;
    }

    getCounter(name: string): number {
        let myCounter = this._getCounter(name);
        if (myCounter == null) {
            return null;
        } else {
            return myCounter.value;
        }
    }

    getCounterMax(name: string): number {
        let myCounter = this._getCounter(name);
        if (myCounter == null) {
            return null;
        } else {
            return myCounter.max;
        }
    }

    setCounter(name: string, value: number) {
        let myCounter = this._getCounter(name);
        if (myCounter != null) {
            myCounter.value = value;
        }
    }

    setCounterMax(name: string, max: number) {
        let myCounter = this._getCounter(name);
        if (myCounter != null) {
            myCounter.max = max;
        }
    }

    increaseCounter(name: string, delta: number) {
        let myCounter = this._getCounter(name);
        if (myCounter != null) {
            myCounter.value += delta;
        }
    }

    increaseCounterMax(name: string, delta: number) {
        let myCounter = this._getCounter(name);
        if (myCounter != null) {
            myCounter.max += delta;
        }
    };
}