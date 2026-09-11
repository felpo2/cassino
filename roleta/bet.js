const config = require("./config");

class Bet {

    constructor(amount, color) {

        this.amount = amount;
        this.color = color;

        this.validate();
    }


    validate() {

        if (
            typeof this.amount !== "number" ||
            !Number.isFinite(this.amount) ||
            this.amount <= 0
        ) {
            throw new Error(
                "Valor da aposta inválido."
            );
        }


        if (
            !config.colors[this.color]
        ) {
            throw new Error(
                "Cor inválida."
            );
        }
    }


    calculatePayout(result) {

        if (result !== this.color) {

            return {
                won: false,
                multiplier: 0,
                payout: 0
            };
        }


        const multiplier =
            config.colors[this.color]
                .multiplier;


        const payout =
            this.amount * multiplier;


        return {
            won: true,
            multiplier,
            payout
        };
    }
}


module.exports = Bet;
