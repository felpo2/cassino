const config = require("./config");

class Roulette {

    constructor() {
        this.lastResult = null;
    }

    spin() {

        const result = this.drawResult();

        const sector = this.drawSector(result);

        const rotations = this.randomInt(
            config.animation.minRotations,
            config.animation.maxRotations
        );

        const rotation = this.calculateRotation(
            sector,
            rotations
        );

        this.lastResult = result;

        return {
            result,
            sector,
            rotation,
            duration: config.animation.duration
        };
    }


    drawResult() {

        const random = Math.random();

        let accumulated = 0;

        for (const color in config.probabilities) {

            accumulated +=
                config.probabilities[color];

            if (random < accumulated) {
                return color;
            }
        }

        return "white";
    }


    drawSector(color) {

        /*
         * Cada cor possui setores visuais.
         *
         * Isso é independente da probabilidade.
         * Serve apenas para a animação.
         */

        const sectors = {

            red: [
                9,
                45,
                81,
                117,
                153,
                189,
                225,
                261,
                297,
                333
            ],

            black: [
                27,
                63,
                99,
                135,
                171,
                207,
                243,
                279,
                315
            ],

            white: [
                351
            ]
        };

        const available =
            sectors[color];

        const index =
            Math.floor(
                Math.random() * available.length
            );

        return available[index];
    }


    calculateRotation(
        sector,
        rotations
    ) {

        return (
            rotations * 360
            +
            (360 - sector)
        );
    }


    randomInt(min, max) {

        return Math.floor(
            Math.random() * (max - min + 1)
        ) + min;
    }
}


module.exports = Roulette;
