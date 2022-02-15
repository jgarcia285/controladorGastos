import { Account, Entry, CategoryEnum } from "./account.js";

let account: Account;
let initialAccount = getAccountFromStorage();

if (initialAccount) {
    account = new Account(initialAccount as Account);
    updateBalanceAmount(account);
} else {
    account = createInitialAccount();
    updateBalanceAmount(account);
}

function createInitialAccount(): Account {
    let setupAccount = new Account();
    let setupExample = new Entry('Ejemplo de gasto', 30, CategoryEnum.expense);
    let setupIncome = new Entry('Ejemplo de ingreso', 10, CategoryEnum.income);

    setupAccount.addEntry(setupExample);
    setupAccount.addEntry(setupIncome);

    return setupAccount;
}

function getAccountFromStorage(): Account | boolean {
    let accountFromStorage = localStorage.getItem('account');

    return accountFromStorage ? JSON.parse(accountFromStorage) : false;
}

function setupAccountToStorage(account: Account): void {
    localStorage.setItem('account', JSON.stringify(account));
}

function updateBalanceAmount(account: Account) {
    let balanceAmountHtmlElement = document.querySelector('#balanceAmount')
    let balanceAccount = account.getBalance();

    balanceAmountHtmlElement!.textContent = `${balanceAccount}`;

}

let entryTemplate = document.querySelector('#entryTemplate') as HTMLTemplateElement;
let fragment = document.createDocumentFragment();
let recordsContainer = document.querySelector('#recordsContainer') as HTMLElement;
let deleteBtn = entryTemplate.content.querySelector('.deleteButton') as HTMLElement;
let entries = account.getEntries();

entries.forEach(entry => printEntry(entry));

recordsContainer.addEventListener('click', event => {
    if (event.target instanceof HTMLButtonElement && event.target.dataset.id) {
        let elementId = event.target.dataset.id;
        let entryElement = document.querySelector(`[data-id="${elementId}"]`);

        deleteElement(elementId as string, entryElement as HTMLElement);
    }
})



function printEntry(entry: Entry): void {
    let { concept, amount, category, id } = entry;
    let entryConceptTemplate = entryTemplate.content.querySelector('.entryConcept');
    let entryAmountTemplate = entryTemplate.content.querySelector('.entryAmount');
    let entryContainerTemplate = entryTemplate.content.querySelector('div');


    if (!entryConceptTemplate || !entryAmountTemplate || !entryContainerTemplate || !deleteBtn) {
        return;
    }

    entryConceptTemplate.textContent = concept;
    entryContainerTemplate.setAttribute('data-id', String(id));
    deleteBtn.setAttribute('data-id', String(id));

    if (category === CategoryEnum.expense) {
        entryAmountTemplate.textContent = `-${amount} $`
    } else {
        entryAmountTemplate.textContent = `${amount} $`
    }

    let clone = entryTemplate.content.cloneNode(true);
    fragment.appendChild(clone);
    recordsContainer.appendChild(fragment);


}

let entryConceptInput = document.querySelector('#entryName') as HTMLInputElement;
let entryAmountInput = document.querySelector('#entryAmount') as HTMLInputElement;
let addIncomeButton = document.querySelector('#addIncomeButton') as HTMLButtonElement;
let addExpenseButton = document.querySelector('#addExpenseButton') as HTMLButtonElement;

addIncomeButton.addEventListener('click', addEntryFromTemplate.bind(this, CategoryEnum.income));

addExpenseButton.addEventListener('click', addEntryFromTemplate.bind(this, CategoryEnum.expense));

function addEntryFromTemplate(category: CategoryEnum) {
    let conceptValue = entryConceptInput.value;
    let amountValue = entryAmountInput.value;

    if (conceptValue && amountValue) {
        let entryFromValues = new Entry(conceptValue, Number(amountValue), category);

        account.addEntry(entryFromValues);
        setupAccountToStorage(account);
        printEntry(entryFromValues);
        updateBalanceAmount(account);
    }
}

function deleteElement(id: string, entryElement: HTMLElement) {
    account.delentEntryById(Number(id));
    setupAccountToStorage(account);
    entryElement!.remove();
    updateBalanceAmount(account);
}