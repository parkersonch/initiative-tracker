import { Counter } from "./counter";

export interface InitiativeItem {
    name: string;
    initiative: number;
    conditions: string[];

    getInitiativeString(): string;
}