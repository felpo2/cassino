const CONFIG = {

    fighters: {

        bolsonaro: {

            name:
                "Bolsonaro",

            multiplier:
                2.7,

            moves: [
                "Motociata",
                "Live de Domingo",
                "Zap Supremo",
                "Brasil Acima de Tudo"
            ]

        },


        lula: {

            name:
                "Lula",

            multiplier:
                2.7,

            moves: [
                "Companheiro!",
                "Discurso Infinito",
                "Carta aos Brasileiros",
                "Picanha Combo"
            ]

        },


        moraes: {

            name:
                "Moraes",

            multiplier:
                2.7,

            moves: [
                "Intimação",
                "Canetada",
                "24h Para Explicar",
                "Decisão Monocrática"
            ]

        }

    }

};


let balance =
    1000;


let selectedFighter =
    null;


let fighting =
    false;


let health = {

    bolsonaro: 100,

    lula: 100,

    moraes: 100

};



const balanceElement =
    document.getElementById(
        "balance"
    );


const betAmount =
    document.getElementById(
        "betAmount"
    );


const fightButton =
    document.getElementById(
        "fightButton"
    );


const fightButtonText =
    document.getElementById(
        "fightButtonText"
    );


const fighterOptions =
    document.querySelectorAll(
        ".fighter-option"
    );


const announcer =
    document.getElementById(
        "announcerText"
    );


const result =
    document.getElementById(
        "result"
    );


const winnerOverlay =
    document.getElementById(
        "winnerOverlay"
    );


const winnerName =
    document.getElementById(
        "winnerName"
    );


const winnerReward =
    document.getElementById(
        "winnerReward"
    );


const halfButton =
    document.getElementById(
        "halfButton"
    );


const doubleButton =
    document.getElementById(
        "doubleButton"
    );


const quickValues =
    document.querySelectorAll(
        ".quick-values button"
    );



/* ==========================================
   SELECT
========================================== */

fighterOptions.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                if (fighting) {
                    return;
                }


                fighterOptions.forEach(
                    item => {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                button.classList.add(
                    "selected"
                );


                selectedFighter =
                    button.dataset
                        .fighter;


                showResult(

                    `Aposta em ${fighterName(selectedFighter)}.`

                );

            }
        );

    }
);



/* ==========================================
   START
========================================== */

async function startFight() {

    if (fighting) {
        return;
    }


    const amount =
        Number(
            betAmount.value
        );


    if (
        !selectedFighter
    ) {

        showResult(
            "Escolha um competidor.",
            "loss"
        );

        return;

    }


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        showResult(
            "Aposta inválida.",
            "loss"
        );

        return;

    }


    if (
        amount > balance
    ) {

        showResult(
            "Saldo insuficiente.",
            "loss"
        );

        return;

    }


    fighting =
        true;


    balance -=
        amount;


    updateBalance();


    lockInterface(
        true
    );


    resetArena();


    fightButtonText.textContent =
        "COMBATE EM ANDAMENTO";


    announcer.textContent =
        "Senhoras e senhores... começou!";


    await delay(
        800
    );


    const events =
        generateFight();


    for (
        const event of events
    ) {

        await animateEvent(
            event
        );

    }


    const winner =
        Object
            .keys(health)
            .find(
                id =>
                    health[id] > 0
            );


    finishFight(
        winner,
        amount
    );

}



/* ==========================================
   SIMULATION
========================================== */

function generateFight() {

    const simulationHealth = {

        bolsonaro: 100,

        lula: 100,

        moraes: 100

    };


    const events = [];


    while (
        Object
            .values(
                simulationHealth
            )
            .filter(
                hp => hp > 0
            )
            .length > 1
    ) {

        const alive =
            Object
                .keys(
                    simulationHealth
                )
                .filter(
                    id =>
                        simulationHealth[id] >
                        0
                );


        const attacker =
            randomFrom(
                alive
            );


        const target =
            randomFrom(
                alive.filter(
                    id =>
                        id !== attacker
                )
            );


        let damage =
            randomInt(
                9,
                21
            );


        const critical =
            Math.random() <
            .12;


        if (
            critical
        ) {

            damage =
                Math.round(
                    damage * 1.5
                );

        }


        simulationHealth[target] =
            Math.max(
                0,
                simulationHealth[target]
                -
                damage
            );


        events.push({

            attacker,

            target,

            move:
                randomFrom(
                    CONFIG
                        .fighters[
                            attacker
                        ]
                        .moves
                ),

            damage,

            critical,

            resultingHealth:
                simulationHealth[
                    target
                ]

        });

    }


    return events;

}



/* ==========================================
   EVENT ANIMATION
========================================== */

async function animateEvent(
    event
) {

    const attacker =
        getFighterElement(
            event.attacker
        );


    const target =
        getFighterElement(
            event.target
        );


    attacker.classList.add(
        "attacking"
    );


    announcer.textContent =
        `${fighterName(event.attacker).toUpperCase()} USA ${event.move.toUpperCase()}!`;


    await delay(
        250
    );


    attacker.classList.remove(
        "attacking"
    );


    target.classList.add(
        "hit"
    );


    health[
        event.target
    ] =
        event.resultingHealth;


    updateHealth(
        event.target
    );


    if (
        event.critical
    ) {

        announcer.textContent =
            `CRÍTICO! ${event.damage} DE DANO!`;

    }

    else {

        announcer.textContent =
            `${event.move}: -${event.damage} HP`;

    }


    await delay(
        520
    );


    target.classList.remove(
        "hit"
    );


    if (
        event.resultingHealth === 0
    ) {

        eliminateFighter(
            event.target
        );


        announcer.textContent =
            `${fighterName(event.target).toUpperCase()} FOI ELIMINADO!`;


        await delay(
            850
        );

    }

}



/* ==========================================
   HEALTH
========================================== */

function updateHealth(
    fighter
) {

    const id =
        capitalize(
            fighter
        );


    const bar =
        document.getElementById(
            `hp${id}`
        );


    const text =
        document.getElementById(
            `hpText${id}`
        );


    bar.style.width =
        `${health[fighter]}%`;


    text.textContent =
        `${health[fighter]} HP`;

}



/* ==========================================
   ELIMINATE
========================================== */

function eliminateFighter(
    fighter
) {

    getFighterElement(
        fighter
    )
    .classList
    .add(
        "eliminated"
    );


    document
        .querySelector(
            `.fighter-hud[data-fighter="${fighter}"]`
        )
        .classList
        .add(
            "eliminated"
        );

}



/* ==========================================
   FINISH
========================================== */

function finishFight(
    winner,
    amount
) {

    announcer.textContent =
        `${fighterName(winner).toUpperCase()} LEVA A FAIXA!`;


    const won =
        winner ===
        selectedFighter;


    let payout = 0;


    if (
        won
    ) {

        payout =
            amount *
            CONFIG
                .fighters[
                    winner
                ]
                .multiplier;


        balance +=
            payout;


        showResult(

            `${fighterName(winner)} venceu! +R$ ${payout.toFixed(2)}`,

            "win"

        );

    }

    else {

        showResult(

            `${fighterName(winner)} venceu. Você perdeu R$ ${amount.toFixed(2)}.`,

            "loss"

        );

    }


    updateBalance();


    showWinner(
        winner,
        won,
        payout
    );


    fighting =
        false;


    fightButtonText.textContent =
        "INICIAR COMBATE";


    lockInterface(
        false
    );

}



/* ==========================================
   WINNER UI
========================================== */

function showWinner(
    winner,
    won,
    payout
) {

    winnerName.textContent =
        fighterName(winner)
            .toUpperCase();


    winnerReward.textContent =
        won
            ? `VOCÊ GANHOU R$ ${payout.toFixed(2)}`
            : "FIM DO COMBATE";


    winnerOverlay
        .classList
        .remove(
            "active"
        );


    void winnerOverlay.offsetWidth;


    winnerOverlay
        .classList
        .add(
            "active"
        );

}



/* ==========================================
   RESET
========================================== */

function resetArena() {

    health = {

        bolsonaro: 100,

        lula: 100,

        moraes: 100

    };


    [
        "bolsonaro",
        "lula",
        "moraes"
    ]
    .forEach(
        fighter => {

            updateHealth(
                fighter
            );


            getFighterElement(
                fighter
            )
            .classList
            .remove(
                "eliminated"
            );


            document
                .querySelector(
                    `.fighter-hud[data-fighter="${fighter}"]`
                )
                .classList
                .remove(
                    "eliminated"
                );

        }
    );

}



/* ==========================================
   QUICK VALUES
========================================== */

quickValues.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                if (
                    fighting
                ) {

                    return;

                }


                betAmount.value =
                    button.dataset.value;

            }
        );

    }
);



halfButton.addEventListener(
    "click",
    () => {

        if (fighting) {
            return;
        }


        const value =
            Number(
                betAmount.value
            );


        if (!value) {
            return;
        }


        betAmount.value =
            Math.max(
                1,
                value / 2
            );

    }
);



doubleButton.addEventListener(
    "click",
    () => {

        if (fighting) {
            return;
        }


        const value =
            Number(
                betAmount.value
            );


        if (!value) {
            return;
        }


        betAmount.value =
            Math.min(
                balance,
                value * 2
            );

    }
);



/* ==========================================
   HELPERS
========================================== */

function getFighterElement(
    fighter
) {

    return document.getElementById(

        `fighter${capitalize(fighter)}`

    );

}


function fighterName(
    id
) {

    return CONFIG
        .fighters[id]
        .name;

}


function capitalize(
    value
) {

    return (
        value
            .charAt(0)
            .toUpperCase()
        +
        value.slice(1)
    );

}


function randomFrom(
    array
) {

    return array[
        Math.floor(
            Math.random() *
            array.length
        )
    ];

}


function randomInt(
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


function delay(
    milliseconds
) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );

}



/* ==========================================
   BALANCE
========================================== */

function updateBalance() {

    balanceElement.textContent =
        balance.toFixed(2);

}



/* ==========================================
   RESULT
========================================== */

function showResult(
    message,
    type = ""
) {

    result.textContent =
        message;


    result.className =
        "result";


    if (type) {

        result.classList.add(
            type
        );

    }

}



/* ==========================================
   LOCK
========================================== */

function lockInterface(
    state
) {

    fightButton.disabled =
        state;


    betAmount.disabled =
        state;


    halfButton.disabled =
        state;


    doubleButton.disabled =
        state;


    fighterOptions.forEach(
        button => {

            button.disabled =
                state;

        }
    );


    quickValues.forEach(
        button => {

            button.disabled =
                state;

        }
    );

}



/* ==========================================
   EVENT
========================================== */

fightButton.addEventListener(
    "click",
    startFight
);



/* ==========================================
   INIT
========================================== */

updateBalance();

resetArena();