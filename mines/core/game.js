const config =
    require("./config");

const Wallet =
    require("./wallet");

const Bet =
    require("./bet");

const Mines =
    require("./mines");


class MinesGame {

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


        this.currentGame =
            null;


        this.currentBet =
            null;

    }


    start({
        amount,
        difficulty
    }) {

        if (
            this.currentGame &&
            !this.currentGame.finished
        ) {

            throw new Error(
                "Já existe uma partida em andamento."
            );

        }


        const difficultyConfig =
            config
                .difficulties[
                    difficulty
                ];


        if (
            !difficultyConfig
        ) {

            throw new Error(
                "Dificuldade inválida."
            );

        }


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


        this.player.debit(
            amount
        );


        this.house.credit(
            amount
        );


        this.currentBet =
            bet;


        this.currentGame =
            new Mines(
                difficultyConfig.mines
            );


        return {

            difficulty,

            mines:
                difficultyConfig.mines,

            betAmount:
                amount,

            multiplier:
                1,

            playerBalance:
                this.player
                    .getBalance()

        };

    }


    reveal(
        index
    ) {

        if (
            !this.currentGame
        ) {

            throw new Error(
                "Nenhuma partida ativa."
            );

        }


        const result =
            this.currentGame
                .reveal(
                    index
                );


        if (
            result.mine
        ) {

            return {

                ...result,

                lost:
                    true,

                multiplier:
                    0,

                payout:
                    0,

                mines:
                    this.currentGame
                        .getMinePositions(),

                playerBalance:
                    this.player
                        .getBalance()

            };

        }


        const multiplier =
            this.calculateMultiplier(
                result.safePicks,
                this.currentGame
                    .mineCount
            );


        const payout =
            this.currentBet.amount *
            multiplier;


        return {

            ...result,

            lost:
                false,

            multiplier,

            payout,

            playerBalance:
                this.player
                    .getBalance()

        };

    }


    cashOut() {

        if (
            !this.currentGame ||
            this.currentGame.finished
        ) {

            throw new Error(
                "Não existe partida ativa."
            );

        }


        const safePicks =
            this.currentGame
                .revealed.size;


        if (
            safePicks === 0
        ) {

            throw new Error(
                "Revele pelo menos uma casa."
            );

        }


        const multiplier =
            this.calculateMultiplier(
                safePicks,
                this.currentGame
                    .mineCount
            );


        const payout =
            this.currentBet.amount *
            multiplier;


        this.house.debit(
            payout
        );


        this.player.credit(
            payout
        );


        this.currentGame.finished =
            true;


        return {

            payout,

            multiplier,

            mines:
                this.currentGame
                    .getMinePositions(),

            playerBalance:
                this.player
                    .getBalance()

        };

    }


    calculateMultiplier(
        safePicks,
        mines
    ) {

        const total =
            config.boardSize;


        let probability =
            1;


        for (
            let i = 0;
            i < safePicks;
            i++
        ) {

            probability *=
                (
                    total -
                    mines -
                    i
                )
                /
                (
                    total -
                    i
                );

        }


        const fairMultiplier =
            1 /
            probability;


        const multiplier =
            fairMultiplier *
            (
                1 -
                config.houseEdge
            );


        return Number(
            multiplier.toFixed(2)
        );

    }

}


module.exports =
    MinesGame;