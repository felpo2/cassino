const config =
    require("./config");


class Mines {

    constructor(
        mineCount
    ) {

        if (
            mineCount < 1 ||
            mineCount >=
                config.boardSize
        ) {

            throw new Error(
                "Quantidade de bombas inválida."
            );

        }


        this.mineCount =
            mineCount;


        this.board =
            this.generateBoard();


        this.revealed =
            new Set();


        this.finished =
            false;

    }


    generateBoard() {

        const mines =
            new Set();


        while (
            mines.size <
            this.mineCount
        ) {

            const index =
                this.randomInt(
                    0,
                    config.boardSize - 1
                );


            mines.add(
                index
            );

        }


        return mines;

    }


    reveal(
        index
    ) {

        if (
            this.finished
        ) {

            throw new Error(
                "Partida finalizada."
            );

        }


        if (
            index < 0 ||
            index >= config.boardSize
        ) {

            throw new Error(
                "Casa inválida."
            );

        }


        if (
            this.revealed.has(
                index
            )
        ) {

            throw new Error(
                "Casa já revelada."
            );

        }


        this.revealed.add(
            index
        );


        const hitMine =
            this.board.has(
                index
            );


        if (
            hitMine
        ) {

            this.finished =
                true;

        }


        return {

            index,

            mine:
                hitMine,

            safe:
                !hitMine,

            safePicks:
                hitMine
                    ? this.revealed.size - 1
                    : this.revealed.size

        };

    }


    getMinePositions() {

        return Array.from(
            this.board
        );

    }


    randomInt(
        min,
        max
    ) {

        const range =
            max - min + 1;


        if (
            typeof crypto !== "undefined" &&
            crypto.getRandomValues
        ) {

            const array =
                new Uint32Array(1);


            crypto.getRandomValues(
                array
            );


            return (
                min +
                (
                    array[0] %
                    range
                )
            );

        }


        return (
            Math.floor(
                Math.random() *
                range
            )
            +
            min
        );

    }

}


module.exports = Mines;