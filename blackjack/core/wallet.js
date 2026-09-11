class Wallet {

    constructor(initialBalance = 0) {
        this.balance = initialBalance;
    }


    canBet(amount) {

        return (
            Number.isFinite(amount) &&
            amount > 0 &&
            amount <= this.balance
        );

    }


    debit(amount) {

        if (!this.canBet(amount)) {

            throw new Error(
                "Saldo insuficiente."
            );

        }

        this.balance -= amount;
    }


    credit(amount) {

        if (
            !Number.isFinite(amount) ||
            amount < 0
        ) {

            throw new Error(
                "Valor inválido."
            );

        }

        this.balance += amount;
    }


    getBalance() {
        return this.balance;
    }

}

module.exports = Wallet;