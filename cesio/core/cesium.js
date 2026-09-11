const config =
    require("./config");


class Cesium {

    constructor() {

        this.holder =
            this.generateHolder();

    }


    generateHolder() {

        return Math.floor(
            Math.random() *
            config.people
        );

    }


    check(index) {

        return {

            selected:
                index,

            holder:
                this.holder,

            correct:
                index ===
                this.holder

        };

    }

}

module.exports = Cesium;