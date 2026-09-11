const config =
    require("./config");


class Bet {

    constructor(amount) {

        this.amount = amount;

        this.validate();

    }


    validate() {

        if (
            typeof this.amount !== "number" ||
            !Number.isFinite(this.amount)
        ) {

            throw new Error(
                "Valor da aposta inválido."
            );

        }


        if (
            this.amount <
            config.bet.min
        ) {

            throw new Error(
                `Aposta mínima: R$ ${config.bet.min}.`
            );

        }


        if (
            this.amount >
            config.bet.max
        ) {

            throw new Error(
                `Aposta máxima: R$ ${config.bet.max}.`
            );

        }

    }


    calculatePayout(
        multiplier
    ) {

        const payout =
            this.amount *
            multiplier;


        return {

            amount:
                this.amount,

            multiplier,

            payout,

            profit:
                payout -
                this.amount

        };

    }

}


module.exports = Bet;