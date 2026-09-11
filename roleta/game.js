const Roulette = require("./roulette");
const Bet = require("./bet");
const Wallet = require("./wallet");


class RouletteGame {

    constructor({
        playerBalance = 1000,
        houseBalance = 10000
    } = {}) {

        this.roulette =
            new Roulette();

        this.player =
            new Wallet(playerBalance);

        this.house =
            new Wallet(houseBalance);
    }


    play({
        amount,
        color
    }) {

        /*
         * Cria a aposta.
         */

        const bet =
            new Bet(amount, color);


        /*
         * Verifica saldo.
         */

        if (
            !this.player.canBet(amount)
        ) {

            throw new Error(
                "Saldo insuficiente."
            );
        }


        /*
         * Retira a aposta do jogador
         * e coloca na casa.
         */

        this.player.debit(amount);

        this.house.credit(amount);


        /*
         * Gira a roleta.
         */

        const spin =
            this.roulette.spin();


        /*
         * Calcula o resultado
         * financeiro.
         */

        const payment =
            bet.calculatePayout(
                spin.result
            );


        /*
         * Se ganhou, paga.
         */

        if (payment.won) {

            this.house.debit(
                payment.payout
            );

            this.player.credit(
                payment.payout
            );
        }


        /*
         * Retorna um objeto limpo
         * para o front-end.
         */

        return {

            result: spin.result,

            sector: spin.sector,

            rotation: spin.rotation,

            animationDuration:
                spin.duration,

            selectedColor:
                color,

            betAmount:
                amount,

            won:
                payment.won,

            multiplier:
                payment.multiplier,

            payout:
                payment.payout,

            balances: {

                player:
                    this.player.getBalance(),

                house:
                    this.house.getBalance()
            }
        };
    }
}


module.exports = RouletteGame;
