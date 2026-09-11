const config =
    require("./config");

const Deck =
    require("./deck");

const Blackjack =
    require("./blackjack");

const Wallet =
    require("./wallet");

const Bet =
    require("./bet");


class BlackjackGame {

    constructor({
        playerBalance = 1000,
        houseBalance = 10000
    } = {}) {

        this.player =
            new Wallet(playerBalance);

        this.house =
            new Wallet(houseBalance);

        this.blackjack =
            new Blackjack();

        this.resetRound();
    }


    resetRound() {

        this.deck =
            new Deck();

        this.playerHand = [];

        this.dealerHand = [];

        this.currentBet = null;

        this.finished = true;
    }


    start(amount) {

        if (!this.finished) {

            throw new Error(
                "Já existe uma rodada ativa."
            );

        }


        const bet =
            new Bet(amount);


        if (
            !this.player.canBet(amount)
        ) {

            throw new Error(
                "Saldo insuficiente."
            );

        }


        this.resetRound();

        this.finished = false;

        this.currentBet = bet;


        this.player.debit(amount);

        this.house.credit(amount);


        this.playerHand.push(
            this.deck.draw()
        );

        this.dealerHand.push(
            this.deck.draw()
        );

        this.playerHand.push(
            this.deck.draw()
        );

        this.dealerHand.push(
            this.deck.draw()
        );


        const playerBlackjack =
            this.blackjack.isBlackjack(
                this.playerHand
            );


        const dealerBlackjack =
            this.blackjack.isBlackjack(
                this.dealerHand
            );


        if (
            playerBlackjack ||
            dealerBlackjack
        ) {

            return this.resolveNaturals(
                playerBlackjack,
                dealerBlackjack
            );

        }


        return this.getState(false);
    }


    hit() {

        this.ensureActive();


        this.playerHand.push(
            this.deck.draw()
        );


        if (
            this.blackjack.isBust(
                this.playerHand
            )
        ) {

            this.finished = true;

            return this.getState(
                true,
                "player_bust"
            );

        }


        if (
            this.blackjack
                .calculateHand(
                    this.playerHand
                ) === 21
        ) {

            return this.stand();

        }


        return this.getState(false);
    }


    stand() {

        this.ensureActive();


        while (
            this.blackjack
                .calculateHand(
                    this.dealerHand
                )
            <
            config.dealerStandValue
        ) {

            this.dealerHand.push(
                this.deck.draw()
            );

        }


        return this.resolveRound();
    }


    resolveNaturals(
        playerBlackjack,
        dealerBlackjack
    ) {

        this.finished = true;


        if (
            playerBlackjack &&
            dealerBlackjack
        ) {

            this.returnStake();

            return this.getState(
                true,
                "push"
            );

        }


        if (playerBlackjack) {

            const payout =
                this.currentBet.amount *
                (
                    1 +
                    config.blackjackPayout
                );


            this.house.debit(payout);

            this.player.credit(payout);


            return this.getState(
                true,
                "blackjack"
            );

        }


        return this.getState(
            true,
            "dealer_blackjack"
        );

    }


    resolveRound() {

        const playerValue =
            this.blackjack.calculateHand(
                this.playerHand
            );


        const dealerValue =
            this.blackjack.calculateHand(
                this.dealerHand
            );


        this.finished = true;


        if (dealerValue > 21) {

            this.payRegularWin();

            return this.getState(
                true,
                "dealer_bust"
            );

        }


        if (playerValue > dealerValue) {

            this.payRegularWin();

            return this.getState(
                true,
                "player_win"
            );

        }


        if (dealerValue > playerValue) {

            return this.getState(
                true,
                "dealer_win"
            );

        }


        this.returnStake();


        return this.getState(
            true,
            "push"
        );

    }


    payRegularWin() {

        const payout =
            this.currentBet.amount * 2;


        this.house.debit(payout);

        this.player.credit(payout);
    }


    returnStake() {

        this.house.debit(
            this.currentBet.amount
        );

        this.player.credit(
            this.currentBet.amount
        );
    }


    ensureActive() {

        if (
            this.finished ||
            !this.currentBet
        ) {

            throw new Error(
                "Não existe rodada ativa."
            );

        }

    }


    getState(
        revealDealer,
        result = null
    ) {

        return {

            playerHand:
                this.playerHand,

            dealerHand:
                revealDealer
                    ? this.dealerHand
                    : [
                        this.dealerHand[0],
                        null
                    ],

            playerValue:
                this.blackjack
                    .calculateHand(
                        this.playerHand
                    ),

            dealerValue:
                revealDealer
                    ? this.blackjack
                        .calculateHand(
                            this.dealerHand
                        )
                    : null,

            finished:
                this.finished,

            result,

            balance:
                this.player
                    .getBalance()

        };

    }

}

module.exports = BlackjackGame;