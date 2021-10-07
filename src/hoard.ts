import { Character } from "./character";
import { InitiativeItem } from "./initiativeItem";

export class Hoard implements InitiativeItem {
    private _initiative: number;
    public get initiative(): number {
        return this._initiative;
    }
    public set initiative(value: number) {
        this._initiative = value;
    }
    
    private _name: string;
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    
    
    private _conditions: string[];
    public get conditions(): string[] {
        return this._conditions;
    }
    private set conditions(value: string[]) {
        this._conditions = value;
    }

    private _characters: Character[];
    public get characters(): Character[] {
        return this._characters;
    }
    private set characters(value: Character[]) {
        this._characters = value;
    }

    constructor(
        name: string,
        initiative: number,
        conditions: string[] = [],
        hp: number = null,
        maxHp: number = null,
        tempHp: number = null,
        numCharacters: number = 1
    ) {
        this.name = name;
        this.initiative = initiative;
        this.characters = [];
        for (let i=0; i<numCharacters; i++) {
            let newName = name.concat(' ', i.toString());
            this.characters.push(new Character(
                newName,
                initiative,
                conditions.slice(),
                hp,
                maxHp,
                tempHp
            ));
        }
    }

    getInitiativeString(): string {
        let toReturn = `\t${this.name}: ${this.initiative}`;
        toReturn += `\n\t\t${this.characters.length}`;
        this.characters.forEach((character) => {
            toReturn+=`\n\t\t\t${character.name}: `;
            
            if (character.hp !== null) {
                if (character.tempHp !== null) {
                    toReturn += `${character.tempHp} temp hp -- `;
                }

                toReturn += character.hp.toString();

                if (character.maxHp !== null) {
                    toReturn += `/${character.maxHp}`
                }

                toReturn += ' hp';
            }
            if (character.conditions.length > 0) {
                if (character.hp !== null) {
                    toReturn += '; ';
                }

                toReturn += `Conditions: ${character.conditions[0]}`;
                character.conditions.slice(1).forEach((condition)=> {
                    toReturn += `, ${condition}`
                });
            }
        })

        toReturn += '\n'
        return toReturn;
    }
    addConditions(newConditions: string[]): void {
        newConditions.forEach((condition) => {
            this.conditions.push(condition);
        })
    }
    removeConditions(conditions: string[]): void {
        conditions.forEach((toRemove)=>{
            this.conditions = this.conditions.filter(
                (value: string) => value !== toRemove
                );
        })
    }
    charactersAddConditions(newConditions: string[], num: number, start: number) {
        this.performFunctionOnPortionOfWholeHoard((char: Character) => {
            char.addConditions(newConditions);
        }, num, start);
    }

    charactersRemoveConditions(conditionsToRemove: string[], num: number) {

        conditionsToRemove.forEach((toRemove) => {
            this.performFunctionOnPortionOfHoard(
                this.characters.filter((value) => value.conditions.includes(toRemove)),
                (char) => {char.removeConditions([toRemove])},
                num, 0
            )
        })
    }

    charactersGetConditions(): string[] {
        let toReturn = [];
        this.characters.forEach((char) => {
            char.conditions.forEach((condition) => {
                if (!(toReturn.includes(condition))) {
                    toReturn.push(condition);
                }
            });
        });

        return toReturn;
    }
    
    heal(healAmount: number, num: number, start: number) {
        this.performFunctionOnPortionOfWholeHoard((char: Character) => {
            char.hp+=healAmount;
        }, num, start);
    }

    damage(damageAmount: number, num: number, start: number) {
        this.performFunctionOnPortionOfWholeHoard((char: Character) => {
            char.hp-=damageAmount;
            this.characters = this.characters.filter((char) => !char.conditions.includes('incapacitated'));
        }, num, start);
    }

    setHp(newHp: number, num: number, start: number) {
        this.performFunctionOnPortionOfWholeHoard((char: Character) => {
            char.hp = newHp;
        }, num, start);
    }

    setMaxHp(newMaxHp: number, num: number, start: number) {
        this.performFunctionOnPortionOfWholeHoard((char: Character) => {
            char.maxHp = newMaxHp;
        }, num, start)
    }

    performFunctionOnPortionOfHoard(portionOfHoard: Character[], myFunc: (char: Character) => void, num: number, start: number) {
        if (num > this.characters.length) {
            console.log('number was too big in heal for a hoard');
            return;
        }

        let index = start
        for (let i=0; i<num && i<portionOfHoard.length; i++) {
            myFunc(portionOfHoard[index]);
            index++;
            if (index >= portionOfHoard.length) {
                index = 0;
            }
        }
    }

    performFunctionOnPortionOfWholeHoard(myFunc: (char: Character) => void, num: number, start: number) {
        this.performFunctionOnPortionOfHoard(this.characters, myFunc, num, start);
    }

    getActiveCharacters(): number {
        return this.characters.filter((char) => !char.conditions.includes('incapacitated')).length;
    }
}