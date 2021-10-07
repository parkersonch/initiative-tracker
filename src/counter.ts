export class Counter {
    private _name: string;
    public get name(): string {
        return this._name;
    }
    public set name(newName: string) {
        this._name = newName;
    }
    
    private _max: number;
    public get max(): number {
        return this._max;
    }
    public set max(newMax: number) {
        if (this.max == null) {
            this._max = newMax;
            this.value = this._value;
        } else {
            const hpMaxDiff = newMax - this.max;
            this._max = newMax;
            // when hpMax changes, hp goes up or down with it
            this.add(hpMaxDiff);
        }
    }

    private _value: number;
    public get value(): number {
        return this._value;
    }
    public set value(newValue: number) {
        if (this.max == null || isNaN(this.max) || this.value == null || isNaN(this.value)) {
            console.log(`${this.name} is now ${newValue}, right?`);
            this._value = newValue;
            console.log(this.value);
            return;
        }
        console.log(`something dangerous is happening with the value ${newValue}`);

        if (newValue > this.max) {
            console.log(`max: ${this.max}`);
            this._value = this.max;
            console.log(`because previous value was higher than max (${this.max}), new value is ${this.value}`);
        } else if (newValue < 0 && !this.canBeNegative) {
            this._value = 0;
        } else {
            console.log(`ok, we are setting value to ${newValue}`);
            this._value = newValue;
            console.log(this.value);
        }
    }

    private _canBeNegative: boolean;
    public get canBeNegative(): boolean {
        return this._canBeNegative;
    }
    public set canBeNegative(newCanBeNegative: boolean) {
        this._canBeNegative = newCanBeNegative;
    }    

    constructor(
        name: string,
        value: number = null,
        max: number = null,
        canBeNegative: boolean = true
    ) {
        this.name = name;
        console.log(`counter constructor: lets set value to ${value}`);
        this.value = value;
        this.max = max;
        this.canBeNegative = canBeNegative
    }

    public add(num: number) {
        if (this.value != null) {
            this.value += num;
        }
    }

    public subtract(num: number) {
      if (this.value != null) {
          this.value -= num;
      }
    }
}