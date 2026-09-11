class Card {

    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }

    getValue() {

        if (
            this.rank === "J" ||
            this.rank === "Q" ||
            this.rank === "K"
        ) {
            return 10;
        }

        if (this.rank === "A") {
            return 11;
        }

        return Number(this.rank);
    }

}

module.exports = Card;