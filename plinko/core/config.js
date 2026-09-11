const PLINKO_CONFIG = {

    rows: 8,

    multipliers: [
        5.3,
        1.9,
        1.1,
        1,
        0.5,
        1,
        1.1,
        1.9,
        5.3
    ],

    animation: {
        stepDuration: 220,
        finalDropDuration: 350
    },

    bet: {
        min: 1,
        max: 1000
    }

};

module.exports = PLINKO_CONFIG;