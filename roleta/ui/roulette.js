const CONFIG = {

    probabilities: {

        red:
            0.475,

        black:
            0.475,

        white:
            0.05

    },

    multipliers: {

        red:
            2,

        black:
            2,

        white:
            14

    },

    animation: {

        minRotations:
            8,

        maxRotations:
            12,

        duration:
            5600

    }

};



const SECTORS = {

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



/* ==========================================
   STATE
========================================== */

let balance =
    1000;


let selectedColor =
    null;


let spinning =
    false;


let currentRotation =
    0;


let spinCounter =
    0;



/* ==========================================
   DOM
========================================== */

const roulette =
    document.getElementById(
        "roulette"
    );


const roulettePanel =
    document.querySelector(
        ".roulette-panel"
    );


const balanceElement =
    document.getElementById(
        "balance"
    );


const betInput =
    document.getElementById(
        "betAmount"
    );


const spinButton =
    document.getElementById(
        "spinButton"
    );


const spinButtonText =
    document.getElementById(
        "spinButtonText"
    );


const resultElement =
    document.getElementById(
        "result"
    );


const lastResult =
    document.getElementById(
        "lastResult"
    );


const colorButtons =
    document.querySelectorAll(
        ".bet-option"
    );


const quickButtons =
    document.querySelectorAll(
        ".quick-values button"
    );


const halfButton =
    document.getElementById(
        "halfButton"
    );


const doubleButton =
    document.getElementById(
        "doubleButton"
    );


const telemetrySpin =
    document.getElementById(
        "telemetrySpin"
    );


const telemetrySpeed =
    document.getElementById(
        "telemetrySpeed"
    );


const telemetryStatus =
    document.getElementById(
        "telemetryStatus"
    );


const winOverlay =
    document.getElementById(
        "winOverlay"
    );


const winAmount =
    document.getElementById(
        "winAmount"
    );



/* ==========================================
   BET SELECTION
========================================== */

colorButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                if (
                    spinning
                ) {

                    return;

                }


                colorButtons.forEach(
                    item => {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                button.classList.add(
                    "selected"
                );


                selectedColor =
                    button.dataset.color;


                showResult(
                    `${translateColor(selectedColor)} selecionado.`
                );

            }
        );

    }
);



/* ==========================================
   QUICK BETS
========================================== */

quickButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                if (
                    spinning
                ) {

                    return;

                }


                betInput.value =
                    button.dataset.value;

            }
        );

    }
);



halfButton.addEventListener(
    "click",
    () => {

        if (
            spinning
        ) {

            return;

        }


        const value =
            Number(
                betInput.value
            );


        if (
            !value
        ) {

            return;

        }


        betInput.value =
            Math.max(
                1,
                value / 2
            );

    }
);



doubleButton.addEventListener(
    "click",
    () => {

        if (
            spinning
        ) {

            return;

        }


        const value =
            Number(
                betInput.value
            );


        if (
            !value
        ) {

            return;

        }


        betInput.value =
            Math.min(
                balance,
                value * 2
            );

    }
);



/* ==========================================
   RESULT
========================================== */

function drawResult() {

    const random =
        Math.random();


    let accumulated =
        0;


    for (
        const color
        in CONFIG.probabilities
    ) {

        accumulated +=
            CONFIG
                .probabilities[
                    color
                ];


        if (
            random <
            accumulated
        ) {

            return color;

        }

    }


    return "white";

}



/* ==========================================
   SECTOR
========================================== */

function drawSector(
    color
) {

    const sectors =
        SECTORS[
            color
        ];


    return sectors[
        Math.floor(
            Math.random()
            *
            sectors.length
        )
    ];

}



/* ==========================================
   RANDOM
========================================== */

function randomInt(
    min,
    max
) {

    return (
        Math.floor(
            Math.random()
            *
            (
                max -
                min +
                1
            )
        )
        +
        min
    );

}



/* ==========================================
   ROTATION
========================================== */

function calculateRotation(
    sector
) {

    const desired =
        (
            360 -
            sector
        )
        %
        360;


    const current =
        (
            currentRotation
            %
            360
            +
            360
        )
        %
        360;


    let distance =
        desired -
        current;


    if (
        distance < 0
    ) {

        distance +=
            360;

    }


    const rotations =
        randomInt(
            CONFIG
                .animation
                .minRotations,

            CONFIG
                .animation
                .maxRotations
        );


    return (
        currentRotation
        +
        rotations * 360
        +
        distance
    );

}



/* ==========================================
   SPIN
========================================== */

function spin() {

    if (
        spinning
    ) {

        return;

    }


    const amount =
        Number(
            betInput.value
        );


    if (
        !selectedColor
    ) {

        showResult(
            "Escolha uma linha antes da largada.",
            "loss"
        );

        return;

    }


    if (
        !Number.isFinite(amount)
        ||
        amount <= 0
    ) {

        showResult(
            "Valor de aposta inválido.",
            "loss"
        );

        return;

    }


    if (
        amount >
        balance
    ) {

        showResult(
            "Créditos insuficientes.",
            "loss"
        );

        return;

    }


    spinning =
        true;


    spinCounter++;


    balance -=
        amount;


    updateBalance();


    lockInterface(
        true
    );


    roulettePanel
        .classList
        .add(
            "racing"
        );


    spinButtonText.textContent =
        "CORRENDO";


    telemetrySpin.textContent =
        String(
            spinCounter
        )
        .padStart(
            3,
            "0"
        );


    telemetryStatus.textContent =
        "RACING";


    showResult(
        "Largada autorizada..."
    );


    /*
     * Sorteia o resultado.
     */

    const rouletteResult =
        drawResult();


    const sector =
        drawSector(
            rouletteResult
        );


    currentRotation =
        calculateRotation(
            sector
        );


    roulette.style.transform =
        `rotate(${currentRotation}deg)`;


    startTelemetry();


    setTimeout(
        () => {

            finishSpin(
                rouletteResult,
                amount
            );

        },

        CONFIG
            .animation
            .duration
    );

}



/* ==========================================
   TELEMETRY
========================================== */

let telemetryInterval =
    null;


function startTelemetry() {

    clearInterval(
        telemetryInterval
    );


    let speed =
        120;


    telemetryInterval =
        setInterval(
            () => {

                speed +=
                    randomInt(
                        12,
                        32
                    );


                if (
                    speed > 320
                ) {

                    speed =
                        randomInt(
                            270,
                            315
                        );

                }


                telemetrySpeed.textContent =
                    String(
                        speed
                    )
                    .padStart(
                        3,
                        "0"
                    );

            },
            160
        );

}



/* ==========================================
   FINISH
========================================== */

function finishSpin(
    rouletteResult,
    amount
) {

    clearInterval(
        telemetryInterval
    );


    telemetrySpeed.textContent =
        "000";


    telemetryStatus.textContent =
        "FINISH";


    roulettePanel
        .classList
        .remove(
            "racing"
        );


    lastResult.textContent =
        translateColor(
            rouletteResult
        );


    const won =
        rouletteResult
        ===
        selectedColor;


    if (
        won
    ) {

        const multiplier =
            CONFIG
                .multipliers[
                    rouletteResult
                ];


        const payout =
            amount *
            multiplier;


        balance +=
            payout;


        showWin(
            payout
        );


        showResult(

            `Bandeirada! ${translateColor(rouletteResult)} — R$ ${payout.toFixed(2)}.`,

            "win"

        );

    }

    else {

        showResult(

            `Fim de prova: ${translateColor(rouletteResult)}. -R$ ${amount.toFixed(2)}.`,

            "loss"

        );

    }


    updateBalance();


    spinning =
        false;


    spinButtonText.textContent =
        "GIRAR";


    setTimeout(
        () => {

            telemetryStatus.textContent =
                "READY";

        },
        900
    );


    lockInterface(
        false
    );

}



/* ==========================================
   WIN
========================================== */

function showWin(
    payout
) {

    winAmount.textContent =
        `+ R$ ${payout.toFixed(2)}`;


    winOverlay
        .classList
        .remove(
            "active"
        );


    void winOverlay.offsetWidth;


    winOverlay
        .classList
        .add(
            "active"
        );

}



/* ==========================================
   RESULT UI
========================================== */

function showResult(
    message,
    type = ""
) {

    resultElement.textContent =
        message;


    resultElement.className =
        "result";


    if (
        type
    ) {

        resultElement
            .classList
            .add(
                type
            );

    }

}



/* ==========================================
   BALANCE
========================================== */

function updateBalance() {

    balanceElement.textContent =
        balance.toFixed(2);

}



/* ==========================================
   LOCK
========================================== */

function lockInterface(
    state
) {

    spinButton.disabled =
        state;


    betInput.disabled =
        state;


    halfButton.disabled =
        state;


    doubleButton.disabled =
        state;


    colorButtons.forEach(
        button => {

            button.disabled =
                state;

        }
    );


    quickButtons.forEach(
        button => {

            button.disabled =
                state;

        }
    );

}



/* ==========================================
   TRANSLATE
========================================== */

function translateColor(
    color
) {

    return {

        red:
            "VERMELHO",

        black:
            "PRETO",

        white:
            "BRANCO"

    }[
        color
    ];

}



/* ==========================================
   EVENT
========================================== */

spinButton.addEventListener(
    "click",
    spin
);



/* ==========================================
   INIT
========================================== */

updateBalance();