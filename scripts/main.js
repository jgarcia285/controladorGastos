import { Account, Entry, CategoryEnum } from "./account.js";
var account;
var initialAccount = getAccountFromStorage();
if (initialAccount) {
    account = new Account(initialAccount);
    updateBalanceAmount(account);
}
else {
    account = createInitialAccount();
    updateBalanceAmount(account);
}
function createInitialAccount() {
    var setupAccount = new Account();
    var setupExample = new Entry('Ejemplo de gasto', 30, CategoryEnum.expense);
    var setupIncome = new Entry('Ejemplo de ingreso', 10, CategoryEnum.income);
    setupAccount.addEntry(setupExample);
    setupAccount.addEntry(setupIncome);
    return setupAccount;
}
function getAccountFromStorage() {
    var accountFromStorage = localStorage.getItem('account');
    return accountFromStorage ? JSON.parse(accountFromStorage) : false;
}
function setupAccountToStorage(account) {
    localStorage.setItem('account', JSON.stringify(account));
}
function updateBalanceAmount(account) {
    var balanceAmountHtmlElement = document.querySelector('#balanceAmount');
    var balanceAccount = account.getBalance();
    balanceAmountHtmlElement.textContent = "".concat(balanceAccount);
}
var entryTemplate = document.querySelector('#entryTemplate');
var fragment = document.createDocumentFragment();
var recordsContainer = document.querySelector('#recordsContainer');
var deleteBtn = entryTemplate.content.querySelector('.deleteButton');
var entries = account.getEntries();
entries.forEach(function (entry) { return printEntry(entry); });
recordsContainer.addEventListener('click', function (event) {
    if (event.target instanceof HTMLButtonElement && event.target.dataset.id) {
        var elementId = event.target.dataset.id;
        var entryElement = document.querySelector("[data-id=\"".concat(elementId, "\"]"));
        deleteElement(elementId, entryElement);
    }
});
function printEntry(entry) {
    var concept = entry.concept, amount = entry.amount, category = entry.category, id = entry.id;
    var entryConceptTemplate = entryTemplate.content.querySelector('.entryConcept');
    var entryAmountTemplate = entryTemplate.content.querySelector('.entryAmount');
    var entryContainerTemplate = entryTemplate.content.querySelector('div');
    if (!entryConceptTemplate || !entryAmountTemplate || !entryContainerTemplate || !deleteBtn) {
        return;
    }
    entryConceptTemplate.textContent = concept;
    entryContainerTemplate.setAttribute('data-id', String(id));
    deleteBtn.setAttribute('data-id', String(id));
    if (category === CategoryEnum.expense) {
        entryAmountTemplate.textContent = "-".concat(amount, " $");
    }
    else {
        entryAmountTemplate.textContent = "".concat(amount, " $");
    }
    var clone = entryTemplate.content.cloneNode(true);
    fragment.appendChild(clone);
    recordsContainer.appendChild(fragment);
}
var entryConceptInput = document.querySelector('#entryName');
var entryAmountInput = document.querySelector('#entryAmount');
var addIncomeButton = document.querySelector('#addIncomeButton');
var addExpenseButton = document.querySelector('#addExpenseButton');
addIncomeButton.addEventListener('click', addEntryFromTemplate.bind(this, CategoryEnum.income));
addExpenseButton.addEventListener('click', addEntryFromTemplate.bind(this, CategoryEnum.expense));
function addEntryFromTemplate(category) {
    var conceptValue = entryConceptInput.value;
    var amountValue = entryAmountInput.value;
    if (conceptValue && amountValue) {
        var entryFromValues = new Entry(conceptValue, Number(amountValue), category);
        account.addEntry(entryFromValues);
        setupAccountToStorage(account);
        printEntry(entryFromValues);
        updateBalanceAmount(account);
    }
}
function deleteElement(id, entryElement) {
    account.delentEntryById(Number(id));
    setupAccountToStorage(account);
    entryElement.remove();
    updateBalanceAmount(account);
}
