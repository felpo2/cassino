const MINES_CONFIG = {

    boardSize: 25,

    houseEdge: 0.03,

    difficulties: {

        easy: {
            label: "Fácil",
            mines: 3
        },

        normal: {
            label: "Normal",
            mines: 5
        },

        medium: {
            label: "Médio",
            mines: 8
        },

        hard: {
            label: "Difícil",
            mines: 12
        },

        extreme: {
            label: "Extremo",
            mines: 18
        },

        insane: {
            label: "Insano",
            mines: 24
        }

    },

    bet: {
        min: 1,
        max: 1000
    }

};

module.exports = MINES_CONFIG;