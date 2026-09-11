const Wallet =
    require("./wallet");

const Bet =
    require("./bet");

const Fight =
    require("./fight");


class FightGame {

    constructor({
        playerBalance = 1000,
        houseBalance = 10000
    } = {}) {

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
        amount,
        fighter
    }) {

        const bet =
            new Bet(
                amount,
                fighter
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


        this.player.debit(
            amount
        );


        this.house.credit(
            amount
        );


        const fight =
            new Fight();


        const fightResult =
            fight.simulate();


        const payment =
            bet.calculatePayout(
                fightResult.winner
            );


        if (
            payment.won
        ) {

            this.house.debit(
                payment.payout
            );


            this.player.credit(
                payment.payout
            );

        }


        return {

            selectedFighter:
                fighter,

            winner:
                fightResult.winner,

            events:
                fightResult.events,

            fighters:
                fightResult.fighters,

            won:
                payment.won,

            payout:
                payment.payout,

            multiplier:
                payment.multiplier,

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
    FightGame;