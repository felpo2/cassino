const config = require("./config");

class Bet {

    constructor(amount) {

        this.amount = amount;

        this.validate();
    }


    validate() {

        if (
            typeof this.amount !== "number" ||
            !Number.isFinite(this.amount) ||
            this.amount <
                config.bet.min ||
            this.amount >
                config.bet.max
        ) {

            throw new Error(
                "Valor da aposta inválido."
            );

        }

    }

}

module.exports = Bet;