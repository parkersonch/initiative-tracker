export class Counter {
    private _value: number;
    public get value(): number {
        return this._value;
    }
    public set value(value: number) {
        this._value = value;
        if (this._value > this.max) {
            this._value = this.max;
        }
    }

    private _max: number;
    public get max(): number {
        return this._max;
    }
    public set max(value: number) {
        this._max = value;
        this.value = this._value;
    }

    private _name: string;
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    constructor(
        name: string,
        value: number,
        max: number
    ) {
        this.name = name;
        this.max = max;
        this.value = value;
    }
}