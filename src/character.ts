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

    private _hp: number;
    public get hp(): number {
        return this._hp;
    }
    public set hp(value: number) {
        if (this.maxHp === null || value === null) {
            this._hp = value;
            return;
        }

        if (value > this.maxHp) {
            this._hp = this.maxHp;
        } else {
            this._hp = value;
        }
    }

    private _maxHp: number;
    public get maxHp(): number {
        return this._maxHp;
    }
    public set maxHp(value: number) {
        if (this.maxHp === null) {
            this._maxHp = value;
            this.hp = this.hp;
        } else {
            const hpMaxDiff = value - this.maxHp;
            this._maxHp = value;
            // when hpMax changes, hp goes up or down with it
            this.heal(hpMaxDiff);
        }
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

    constructor(
        name: string,
        initiative: number,
        conditions: string[] = [],
        hp: number = null,
        maxHp: number = null,
        tempHp: number = null
    ) {
        this.name = name;
        this.initiative = initiative;
        this.conditions = conditions;
        this.maxHp = maxHp;
        this.hp = hp;
        this.tempHp = tempHp;
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
}