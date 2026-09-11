const config =
    require("./config");


class Plinko {

    drop() {

        const path = [];

        let position = 0;


        for (
            let row = 0;
            row < config.rows;
            row++
        ) {

            const direction =
                Math.random() < 0.5
                    ? "left"
                    : "right";


            path.push(
                direction
            );


            if (
                direction === "right"
            ) {

                position++;

            }

        }


        const bucketIndex =
            position;


        const multiplier =
            config.multipliers[
                bucketIndex
            ];


        return {

            path,

            bucketIndex,

            multiplier

        };

    }

}


module.exports = Plinko;