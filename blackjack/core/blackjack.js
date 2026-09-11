class Blackjack {

    calculateHand(hand) {

        let total = 0;

        let aces = 0;


        for (const card of hand) {

            total += card.getValue();


            if (card.rank === "A") {
                aces++;
            }

        }


        while (
            total > 21 &&
            aces > 0
        ) {

            total -= 10;

            aces--;
        }


        return total;
    }


    isBlackjack(hand) {

        return (
            hand.length === 2 &&
            this.calculateHand(hand) === 21
        );

    }


    isBust(hand) {

        return (
            this.calculateHand(hand) > 21
        );

    }

}

module.exports = Blackjack;