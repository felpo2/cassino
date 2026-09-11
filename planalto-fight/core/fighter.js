const config =
    require("./config");


class Fighter {

    constructor(id) {

        const fighterConfig =
            config.fighters[id];


        if (!fighterConfig) {

            throw new Error(
                "Lutador inexistente."
            );

        }


        this.id = id;

        this.name =
            fighterConfig.name;

        this.maxHealth =
            config.health;

        this.health =
            this.maxHealth;

        this.moves =
            fighterConfig.moves;

        this.eliminated =
            false;

    }


    takeDamage(amount) {

        this.health =
            Math.max(
                0,
                this.health - amount
            );


        if (
            this.health === 0
        ) {

            this.eliminated =
                true;

        }

    }


    getRandomMove() {

        return this.moves[
            Math.floor(
                Math.random() *
                this.moves.length
            )
        ];

    }


    getState() {

        return {

            id:
                this.id,

            name:
                this.name,

            health:
                this.health,

            maxHealth:
                this.maxHealth,

            eliminated:
                this.eliminated

        };

    }

}


module.exports = Fighter;