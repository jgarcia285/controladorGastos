import { getRandomId } from "./utils.js";

export interface Entry {
    id: number;
    concept: string;
    amount: number;
    category: CategoryEnum;
}

export enum CategoryEnum {
    expense = 'Expense',
    income = 'Income'
}

export interface Account {
    id: number;
    name: string;

    addEntry(entry: Entry): boolean;
    delentEntryById(id: number): boolean;
    getBalance(): string;
    getEntries(): Entry[];
}

export class Account implements Account {
    private entries: Entry[];
    private balance: number;

    constructor(account: Account = {} as Account) {
        this.id = account.id || getRandomId();
        this.name = account.name || 'Nueva Cuenta';
        this.entries = account.entries || [];
        this.balance = account.balance || 0
    }

    private convertAmountByCategory(entry: Entry): number {
        let {category, amount} = entry;
        if (category === CategoryEnum.expense) {
            return -amount;
        } else {
            return amount;
        }
    }

    private updateBalance(): void {
        let balance = this.entries.reduce((previousValue, currentEntry) => {
            return previousValue + this.convertAmountByCategory(currentEntry);
        }, 0)
        this.balance = balance;
    }

    addEntry(entry: Entry): boolean {
        this.entries.push(entry);
        this.updateBalance();

        return true;
    }

    delentEntryById(id: number): boolean {
        let entriesFiltered = this.entries.filter(entry => entry.id !== id);
        this.entries = entriesFiltered;
        this.updateBalance();

        return true;
    }

    getBalance(): string{
        return `$${this.balance}`;
    }

    getEntries(): Entry[] {
        return this.entries;
    }
}

export class Entry implements Entry{
    public id: number;

    constructor(
        public concept: string,
        public amount: number,
        public category: CategoryEnum
    ){
        this.id = getRandomId();
    }
}