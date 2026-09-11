const Wallet =
    require("./wallet");

const Bet =
    require("./bet");

const Cesium =
    require("./cesium");


class CesiumGame {

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
        person
    }) {

        const bet =
            new Bet(
                amount,
                person
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


        const cesium =
            new Cesium();


        const result =
            cesium.check(
                person
            );


        const payout =
            bet.calculatePayout(
                result.holder
            );


        if (
            payout.won
        ) {

            this.house.debit(
                payout.payout
            );

            this.player.credit(
                payout.payout
            );

        }


        return {

            selectedPerson:
                person,

            cesiumHolder:
                result.holder,

            won:
                payout.won,

            multiplier:
                payout.multiplier,

            payout:
                payout.payout,

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
    CesiumGame;