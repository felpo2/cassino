const config =
    require("./config");

const Fighter =
    require("./fighter");


class Fight {

    constructor() {

        this.fighters = {

            bolsonaro:
                new Fighter(
                    "bolsonaro"
                ),

            lula:
                new Fighter(
                    "lula"
                ),

            moraes:
                new Fighter(
                    "moraes"
                )

        };


        this.events = [];

    }


    simulate() {

        while (
            this.getAliveFighters()
                .length > 1
        ) {

            this.playTurn();

        }


        const winner =
            this.getAliveFighters()[0];


        return {

            winner:
                winner.id,

            events:
                this.events,

            fighters:
                this.getState()

        };

    }


    playTurn() {

        const alive =
            this.getAliveFighters();


        const attacker =
            alive[
                this.randomInt(
                    0,
                    alive.length - 1
                )
            ];


        const possibleTargets =
            alive.filter(
                fighter =>
                    fighter.id !==
                    attacker.id
            );


        const target =
            possibleTargets[
                this.randomInt(
                    0,
                    possibleTargets.length - 1
                )
            ];


        const move =
            attacker
                .getRandomMove();


        let damage =
            this.randomInt(
                move.minDamage,
                move.maxDamage
            );


        const critical =
            Math.random() <
            config.criticalChance;


        if (
            critical
        ) {

            damage =
                Math.round(
                    damage *
                    config
                        .criticalMultiplier
                );

        }


        target.takeDamage(
            damage
        );


        this.events.push({

            type:
                target.eliminated
                    ? "elimination"
                    : "attack",

            attacker:
                attacker.id,

            target:
                target.id,

            move:
                move.name,

            damage,

            critical,

            targetHealth:
                target.health

        });

    }


    getAliveFighters() {

        return Object
            .values(
                this.fighters
            )
            .filter(
                fighter =>
                    !fighter.eliminated
            );

    }


    getState() {

        const state = {};


        for (
            const id
            in this.fighters
        ) {

            state[id] =
                this.fighters[id]
                    .getState();

        }


        return state;

    }


    randomInt(
        min,
        max
    ) {

        return Math.floor(
            Math.random() *
            (
                max -
                min +
                1
            )
        ) + min;

    }

}


module.exports = Fight;