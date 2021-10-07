export interface InitiativeItem {
    name: string;
    initiative: number;
    conditions: string[];

    getInitiativeString(): string;
}