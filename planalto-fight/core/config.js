const FIGHT_CONFIG = {

    fighters: {

        bolsonaro: {
            name: "Bolsonaro",
            color: "#f4cf21",
            accent: "#149447",
            multiplier: 2.7,

            moves: [
                {
                    name: "Motociata",
                    minDamage: 9,
                    maxDamage: 18
                },
                {
                    name: "Live de Domingo",
                    minDamage: 8,
                    maxDamage: 17
                },
                {
                    name: "Zap Supremo",
                    minDamage: 11,
                    maxDamage: 20
                },
                {
                    name: "Brasil Acima de Tudo",
                    minDamage: 13,
                    maxDamage: 22
                }
            ]
        },


        lula: {
            name: "Lula",
            color: "#d93434",
            accent: "#f0c23b",
            multiplier: 2.7,

            moves: [
                {
                    name: "Companheiro!",
                    minDamage: 8,
                    maxDamage: 18
                },
                {
                    name: "Discurso Infinito",
                    minDamage: 10,
                    maxDamage: 19
                },
                {
                    name: "Carta aos Brasileiros",
                    minDamage: 12,
                    maxDamage: 21
                },
                {
                    name: "Picanha Combo",
                    minDamage: 11,
                    maxDamage: 22
                }
            ]
        },


        moraes: {
            name: "Moraes",
            color: "#21242b",
            accent: "#b9bec7",
            multiplier: 2.7,

            moves: [
                {
                    name: "Intimação",
                    minDamage: 9,
                    maxDamage: 18
                },
                {
                    name: "Canetada",
                    minDamage: 11,
                    maxDamage: 20
                },
                {
                    name: "24h Para Explicar",
                    minDamage: 12,
                    maxDamage: 21
                },
                {
                    name: "Decisão Monocrática",
                    minDamage: 13,
                    maxDamage: 22
                }
            ]
        }

    },


    health: 100,

    criticalChance: 0.12,

    criticalMultiplier: 1.5,

    bet: {
        min: 1,
        max: 1000
    }

};

module.exports = FIGHT_CONFIG;