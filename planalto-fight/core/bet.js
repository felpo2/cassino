const config =
    require("./config");


class Bet {

    constructor(
        amount,
        fighter
    ) {

        this.amount = amount;

        this.fighter = fighter;

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
            !config.fighters[
                this.fighter
            ]
        ) {

            throw new Error(
                "Lutador inválido."
            );

        }

    }


    calculatePayout(
        winner
    ) {

        if (
            winner !==
            this.fighter
        ) {

            return {
                won: false,
                payout: 0,
                multiplier: 0
            };

        }


        const multiplier =
            config
                .fighters[
                    winner
                ]
                .multiplier;


        return {

            won: true,

            multiplier,

            payout:
                this.amount *
                multiplier

        };

    }

}


module.exports = Bet;