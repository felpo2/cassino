const CONFIG = {

    people: 6,

    multiplier: 5.4

};


let balance =
    1000;


let selectedPerson =
    null;


let playing =
    false;


let cesiumHolder =
    null;



/* ==========================================
   DOM
========================================== */

const personCards =
    document.querySelectorAll(
        ".person-card"
    );


const selectedPersonElement =
    document.getElementById(
        "selectedPerson"
    );


const balanceElement =
    document.getElementById(
        "balance"
    );


const betInput =
    document.getElementById(
        "betAmount"
    );


const scanButton =
    document.getElementById(
        "scanButton"
    );


const scanButtonText =
    document.getElementById(
        "scanButtonText"
    );


const resultElement =
    document.getElementById(
        "result"
    );


const gameMessage =
    document.getElementById(
        "gameMessage"
    );


const detectorPanel =
    document.querySelector(
        ".detector-panel"
    );


const detectorValue =
    document.getElementById(
        "detectorValue"
    );


const scanStatus =
    document.getElementById(
        "scanStatus"
    );


const radiationLevel =
    document.getElementById(
        "radiationLevel"
    );


const revealOverlay =
    document.getElementById(
        "revealOverlay"
    );


const revealPerson =
    document.getElementById(
        "revealPerson"
    );


const revealReward =
    document.getElementById(
        "revealReward"
    );


const revealLabel =
    document.getElementById(
        "revealLabel"
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
   SELECT PERSON
========================================== */

personCards.forEach(
    card => {

        card.addEventListener(
            "click",
            () => {

                if (
                    playing
                ) {

                    return;

                }


                personCards.forEach(
                    item => {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                card.classList.add(
                    "selected"
                );


                selectedPerson =
                    Number(
                        card.dataset.person
                    );


                selectedPersonElement.textContent =
                    `PESSOA ${formatPerson(selectedPerson)}`;


                showResult(
                    `Pessoa ${formatPerson(selectedPerson)} selecionada.`
                );


                gameMessage.textContent =
                    "Fonte ainda não localizada.";

            }
        );

    }
);



/* ==========================================
   START
========================================== */

async function startGame() {

    if (
        playing
    ) {

        return;

    }


    const amount =
        Number(
            betInput.value
        );


    if (
        selectedPerson === null
    ) {

        showResult(
            "Selecione uma pessoa.",
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


    playing =
        true;


    balance -=
        amount;


    updateBalance();


    lockInterface(
        true
    );


    resetRoundVisuals();


    cesiumHolder =
        randomInt(
            0,
            CONFIG.people - 1
        );


    scanButtonText.textContent =
        "VARRENDO";


    radiationLevel.textContent =
        "ANALISANDO";


    scanStatus.textContent =
        "SCAN";


    detectorPanel.classList.add(
        "active"
    );


    showResult(
        "Varredura radiológica iniciada..."
    );


    await scanSequence();


    revealResult(
        amount
    );

}



/* ==========================================
   SCAN SEQUENCE
========================================== */

async function scanSequence() {

    const order = [
        0, 1, 2,
        3, 4, 5
    ];


    for (
        const index of order
    ) {

        const card =
            getPersonCard(
                index
            );


        card.classList.add(
            "scanning"
        );


        scanStatus.textContent =
            `P${formatPerson(index)}`;


        gameMessage.textContent =
            `Analisando pessoa ${formatPerson(index)}...`;


        animateDetectorValue(
            index ===
            cesiumHolder
        );


        await delay(
            430
        );


        card.classList.remove(
            "scanning"
        );

    }


    detectorPanel.classList.remove(
        "active"
    );


    detectorValue.textContent =
        "0.00";

}



/* ==========================================
   DETECTOR VALUE
========================================== */

function animateDetectorValue(
    isHolder
) {

    let value;


    if (
        isHolder
    ) {

        value =
            (
                70 +
                Math.random() *
                80
            )
            .toFixed(2);

    }

    else {

        value =
            (
                Math.random() *
                2.5
            )
            .toFixed(2);

    }


    detectorValue.textContent =
        value;

}



/* ==========================================
   REVEAL
========================================== */

async function revealResult(
    amount
) {

    const holderCard =
        getPersonCard(
            cesiumHolder
        );


    holderCard.classList.add(
        "cesium"
    );


    radiationLevel.textContent =
        "ALERTA";


    scanStatus.textContent =
        "DETECTADO";


    gameMessage.textContent =
        `Fonte localizada na pessoa ${formatPerson(cesiumHolder)}.`;


    personCards.forEach(
        card => {

            if (
                Number(
                    card.dataset.person
                ) !==
                cesiumHolder
            ) {

                card.classList.add(
                    "wrong"
                );

            }

        }
    );


    const won =
        selectedPerson ===
        cesiumHolder;


    let payout =
        0;


    if (
        won
    ) {

        payout =
            amount *
            CONFIG.multiplier;


        balance +=
            payout;


        updateBalance();


        showResult(

            `Fonte localizada! +R$ ${payout.toFixed(2)}.`,

            "win"

        );


        showReveal(

            "FONTE LOCALIZADA",

            cesiumHolder,

            `+ R$ ${payout.toFixed(2)}`

        );

    }

    else {

        showResult(

            `A fonte estava com a pessoa ${formatPerson(cesiumHolder)}.`,

            "loss"

        );


        showReveal(

            "LOCALIZAÇÃO CONFIRMADA",

            cesiumHolder,

            "TENTATIVA INCORRETA"

        );

    }


    await delay(
        1000
    );


    playing =
        false;


    scanButtonText.textContent =
        "LOCALIZAR FONTE";


    radiationLevel.textContent =
        "ESTÁVEL";


    scanStatus.textContent =
        "AGUARDANDO";


    lockInterface(
        false
    );

}



/* ==========================================
   REVEAL SCREEN
========================================== */

function showReveal(
    label,
    person,
    message
) {

    revealLabel.textContent =
        label;


    revealPerson.textContent =
        `PESSOA ${formatPerson(person)}`;


    revealReward.textContent =
        message;


    revealOverlay
        .classList
        .remove(
            "active"
        );


    void revealOverlay.offsetWidth;


    revealOverlay
        .classList
        .add(
            "active"
        );

}



/* ==========================================
   RESET VISUAL
========================================== */

function resetRoundVisuals() {

    personCards.forEach(
        card => {

            card.classList.remove(
                "cesium",
                "wrong",
                "scanning"
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
                    playing
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
            playing
        ) {

            return;

        }


        const amount =
            Number(
                betInput.value
            );


        if (
            !amount
        ) {

            return;

        }


        betInput.value =
            Math.max(
                1,
                amount / 2
            );

    }
);



doubleButton.addEventListener(
    "click",
    () => {

        if (
            playing
        ) {

            return;

        }


        const amount =
            Number(
                betInput.value
            );


        if (
            !amount
        ) {

            return;

        }


        betInput.value =
            Math.min(
                balance,
                amount * 2
            );

    }
);



/* ==========================================
   RESULT
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
   LOCK
========================================== */

function lockInterface(
    state
) {

    scanButton.disabled =
        state;


    betInput.disabled =
        state;


    halfButton.disabled =
        state;


    doubleButton.disabled =
        state;


    personCards.forEach(
        card => {

            card.disabled =
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
   HELPERS
========================================== */

function getPersonCard(
    index
) {

    return document.querySelector(

        `.person-card[data-person="${index}"]`

    );

}


function formatPerson(
    index
) {

    return String(
        index + 1
    )
    .padStart(
        2,
        "0"
    );

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
   EVENT
========================================== */

scanButton.addEventListener(
    "click",
    startGame
);



/* ==========================================
   INIT
========================================== */

updateBalance();