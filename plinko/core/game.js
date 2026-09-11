const Plinko =
    require("./plinko");

const Bet =
    require("./bet");

const Wallet =
    require("./wallet");


class PlinkoGame {

    constructor({
        playerBalance = 1000,
        houseBalance = 10000
    } = {}) {

        this.plinko =
            new Plinko();


        this.player =
            new Wallet(
                playerBalance
            );


        this.house =
            new Wallet(
                houseBalance
            );

    }


    play({
        amount
    }) {

        const bet =
            new Bet(
                amount
            );


        if (
            !this.player.canBet(
                amount
            )
        ) {

            throw new Error(
                "Saldo insuficiente."
            );

        }


        /*
         * Jogador paga a aposta.
         */

        this.player.debit(
            amount
        );


        this.house.credit(
            amount
        );


        /*
         * Solta a bolinha.
         */

        const drop =
            this.plinko.drop();


        /*
         * Calcula pagamento.
         */

        const payment =
            bet.calculatePayout(
                drop.multiplier
            );


        /*
         * Casa paga.
         */

        if (
            payment.payout > 0
        ) {

            this.house.debit(
                payment.payout
            );


            this.player.credit(
                payment.payout
            );

        }


        return {

            path:
                drop.path,

            bucketIndex:
                drop.bucketIndex,

            multiplier:
                drop.multiplier,

            betAmount:
                amount,

            payout:
                payment.payout,

            profit:
                payment.profit,

            balances: {

                player:
                    this.player
                        .getBalance(),

                house:
                    this.house
                        .getBalance()

            }

        };

    }

}


module.exports =
    PlinkoGame;