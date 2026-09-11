const config =
    require("./config");


class Bet {

    constructor(amount, personIndex) {

        this.amount =
            amount;

        this.personIndex =
            personIndex;

        this.validate();

    }


    validate() {

        if (
            typeof this.amount !== "number" ||
            !Number.isFinite(this.amount) ||
            this.amount < config.bet.min ||
            this.amount > config.bet.max
        ) {

            throw new Error(
                "Valor da aposta inválido."
            );

        }


        if (
            !Number.isInteger(
                this.personIndex
            ) ||
            this.personIndex < 0 ||
            this.personIndex >= config.people
        ) {

            throw new Error(
                "Pessoa inválida."
            );

        }

    }


    calculatePayout(
        cesiumHolder
    ) {

        if (
            cesiumHolder !==
            this.personIndex
        ) {

            return {
                won: false,
                payout: 0,
                multiplier: 0
            };

        }


        return {

            won: true,

            multiplier:
                config.multiplier,

            payout:
                this.amount *
                config.multiplier

        };

    }

}

module.exports = Bet;