const ROULETTE_CONFIG = {
    colors: {
        red: {
            multiplier: 2
        },

        black: {
            multiplier: 2
        },

        white: {
            multiplier: 14
        }
    },

    /*
     * Probabilidades do resultado.
     *
     * IMPORTANTE:
     * Estas probabilidades são configuráveis.
     * A matemática final deve ser definida
     * de acordo com a regra do jogo.
     */
    probabilities: {
        red: 0.475,
        black: 0.475,
        white: 0.05
    },

    animation: {
        minRotations: 5,
        maxRotations: 8,
        duration: 5000
    }
};

module.exports = ROULETTE_CONFIG;
