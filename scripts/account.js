import { getRandomId } from "./utils.js";
export var CategoryEnum;
(function (CategoryEnum) {
    CategoryEnum["expense"] = "Expense";
    CategoryEnum["income"] = "Income";
})(CategoryEnum || (CategoryEnum = {}));
var Account = /** @class */ (function () {
    function Account(account) {
        if (account === void 0) { account = {}; }
        this.id = account.id || getRandomId();
        this.name = account.name || 'Nueva Cuenta';
        this.entries = account.entries || [];
        this.balance = account.balance || 0;
    }
    Account.prototype.convertAmountByCategory = function (entry) {
        var category = entry.category, amount = entry.amount;
        if (category === CategoryEnum.expense) {
            return -amount;
        }
        else {
            return amount;
        }
    };
    Account.prototype.updateBalance = function () {
        var _this = this;
        var balance = this.entries.reduce(function (previousValue, currentEntry) {
            return previousValue + _this.convertAmountByCategory(currentEntry);
        }, 0);
        this.balance = balance;
    };
    Account.prototype.addEntry = function (entry) {
        this.entries.push(entry);
        this.updateBalance();
        return true;
    };
    Account.prototype.delentEntryById = function (id) {
        var entriesFiltered = this.entries.filter(function (entry) { return entry.id !== id; });
        this.entries = entriesFiltered;
        this.updateBalance();
        return true;
    };
    Account.prototype.getBalance = function () {
        return "$".concat(this.balance);
    };
    Account.prototype.getEntries = function () {
        return this.entries;
    };
    return Account;
}());
export { Account };
var Entry = /** @class */ (function () {
    function Entry(concept, amount, category) {
        this.concept = concept;
        this.amount = amount;
        this.category = category;
        this.id = getRandomId();
    }
    return Entry;
}());
export { Entry };
