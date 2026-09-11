const CONFIG = {

    boardSize: 25,

    houseEdge: 0.03,

    difficulties: {

        easy: 3,

        normal: 5,

        medium: 8,

        hard: 12,

        extreme: 18,

        insane: 24

    }

};


let balance =
    1000;


let activeGame =
    false;


let selectedDifficulty =
    "easy";


let mines =
    new Set();


let revealed =
    new Set();


let currentBet =
    0;



const board =
    document.getElementById(
        "mineBoard"
    );


const balanceElement =
    document.getElementById(
        "balance"
    );


const betInput =
    document.getElementById(
        "betAmount"
    );


const multiplierElement =
    document.getElementById(
        "multiplier"
    );


const currentValueElement =
    document.getElementById(
        "currentValue"
    );


const safeCountElement =
    document.getElementById(
        "safeCount"
    );


const startButton =
    document.getElementById(
        "startButton"
    );


const cashoutButton =
    document.getElementById(
        "cashoutButton"
    );


const resultElement =
    document.getElementById(
        "result"
    );


const difficultyButtons =
    document.querySelectorAll(
        ".difficulty"
    );


const quickValues =
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


const mineCountElement =
    document.getElementById(
        "mineCount"
    );


const safeTilesElement =
    document.getElementById(
        "safeTiles"
    );


const winOverlay =
    document.getElementById(
        "winOverlay"
    );


const winMultiplier =
    document.getElementById(
        "winMultiplier"
    );


const winAmount =
    document.getElementById(
        "winAmount"
    );



/* ========================================
   BOARD
======================================== */

function createBoard() {

    board.innerHTML =
        "";


    for (
        let i = 0;
        i < CONFIG.boardSize;
        i++
    ) {

        const tile =
            document.createElement(
                "button"
            );


        tile.className =
            "mine-tile";


        tile.dataset.index =
            i;


        tile.disabled =
            !activeGame;


        tile.addEventListener(
            "click",
            () => revealTile(i)
        );


        board.appendChild(
            tile
        );

    }

}



/* ========================================
   RANDOM
======================================== */

function randomInt(
    max
) {

    if (
        crypto &&
        crypto.getRandomValues
    ) {

        const values =
            new Uint32Array(1);


        crypto.getRandomValues(
            values
        );


        return (
            values[0] %
            max
        );

    }


    return Math.floor(
        Math.random() *
        max
    );

}



/* ========================================
   MINES
======================================== */

function generateMines(
    mineCount
) {

    mines =
        new Set();


    while (
        mines.size <
        mineCount
    ) {

        mines.add(
            randomInt(
                CONFIG.boardSize
            )
        );

    }

}



/* ========================================
   START
======================================== */

function startGame() {

    if (
        activeGame
    ) {

        return;

    }


    const amount =
        Number(
            betInput.value
        );


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        showResult(
            "Digite uma aposta válida.",
            "loss"
        );

        return;

    }


    if (
        amount >
        balance
    ) {

        showResult(
            "Saldo insuficiente.",
            "loss"
        );

        return;

    }


    currentBet =
        amount;


    balance -=
        currentBet;


    updateBalance();


    const mineCount =
        CONFIG
            .difficulties[
                selectedDifficulty
            ];


    generateMines(
        mineCount
    );


    revealed =
        new Set();


    activeGame =
        true;


    createBoard();


    lockSettings(
        true
    );


    updateRoundStats();


    cashoutButton.disabled =
        true;


    showResult(
        "Escolha uma casa."
    );

}



/* ========================================
   REVEAL
======================================== */

function revealTile(
    index
) {

    if (
        !activeGame ||
        revealed.has(index)
    ) {

        return;

    }


    const tile =
        getTile(
            index
        );


    revealed.add(
        index
    );


    if (
        mines.has(index)
    ) {

        hitMine(
            tile
        );

        return;

    }


    tile.classList.add(
        "safe"
    );


    tile.disabled =
        true;


    updateRoundStats();


    cashoutButton.disabled =
        false;


    const multiplier =
        calculateMultiplier();


    const currentValue =
        currentBet *
        multiplier;


    showResult(

        `${multiplier.toFixed(2)}× — R$ ${currentValue.toFixed(2)}`,

        "win"

    );


    /*
     * Se todas as casas seguras
     * foram encontradas.
     */

    const mineCount =
        CONFIG
            .difficulties[
                selectedDifficulty
            ];


    const safeTiles =
        CONFIG.boardSize -
        mineCount;


    if (
        revealed.size ===
        safeTiles
    ) {

        cashOut();

    }

}



/* ========================================
   MINE
======================================== */

function hitMine(
    tile
) {

    tile.classList.add(
        "mine"
    );


    revealAllMines();


    activeGame =
        false;


    cashoutButton.disabled =
        true;


    showResult(

        `Bomba! Você perdeu R$ ${currentBet.toFixed(2)}.`,

        "loss"

    );


    multiplierElement.textContent =
        "0.00×";


    currentValueElement.textContent =
        "R$ 0.00";


    disableBoard();


    setTimeout(
        () => {

            lockSettings(
                false
            );

        },
        700
    );

}



/* ========================================
   CASHOUT
======================================== */

function cashOut() {

    if (
        !activeGame ||
        revealed.size === 0
    ) {

        return;

    }


    const multiplier =
        calculateMultiplier();


    const payout =
        currentBet *
        multiplier;


    balance +=
        payout;


    updateBalance();


    activeGame =
        false;


    revealAllMines();


    disableBoard();


    lockSettings(
        false
    );


    cashoutButton.disabled =
        true;


    showWin(
        multiplier,
        payout
    );


    showResult(

        `Você retirou R$ ${payout.toFixed(2)}.`,

        "win"

    );

}



/* ========================================
   MULTIPLIER
======================================== */

function calculateMultiplier() {

    const picks =
        countSafeReveals();


    if (
        picks === 0
    ) {

        return 1;

    }


    const minesCount =
        CONFIG
            .difficulties[
                selectedDifficulty
            ];


    let probability =
        1;


    for (
        let i = 0;
        i < picks;
        i++
    ) {

        probability *=
            (
                CONFIG.boardSize -
                minesCount -
                i
            )
            /
            (
                CONFIG.boardSize -
                i
            );

    }


    const fairMultiplier =
        1 /
        probability;


    return (
        fairMultiplier *
        (
            1 -
            CONFIG.houseEdge
        )
    );

}



/* ========================================
   SAFE COUNT
======================================== */

function countSafeReveals() {

    let count = 0;


    revealed.forEach(
        index => {

            if (
                !mines.has(
                    index
                )
            ) {

                count++;

            }

        }
    );


    return count;

}



/* ========================================
   ROUND STATS
======================================== */

function updateRoundStats() {

    const safePicks =
        countSafeReveals();


    const multiplier =
        safePicks === 0
            ? 1
            : calculateMultiplier();


    multiplierElement.textContent =
        `${multiplier.toFixed(2)}×`;


    currentValueElement.textContent =
        `R$ ${(currentBet * multiplier).toFixed(2)}`;


    safeCountElement.textContent =
        safePicks;

}



/* ========================================
   ALL MINES
======================================== */

function revealAllMines() {

    mines.forEach(
        index => {

            const tile =
                getTile(
                    index
                );


            if (
                !tile.classList
                    .contains("mine")
            ) {

                tile.classList.add(
                    "mine",
                    "hidden-mine"
                );

            }

        }
    );

}



/* ========================================
   TILE
======================================== */

function getTile(
    index
) {

    return board.querySelector(

        `.mine-tile[data-index="${index}"]`

    );

}



/* ========================================
   DISABLE
======================================== */

function disableBoard() {

    document
        .querySelectorAll(
            ".mine-tile"
        )
        .forEach(
            tile => {

                tile.disabled =
                    true;

            }
        );

}



/* ========================================
   SETTINGS
======================================== */

function lockSettings(
    locked
) {

    betInput.disabled =
        locked;


    startButton.disabled =
        locked;


    difficultyButtons.forEach(
        button => {

            button.disabled =
                locked;

        }
    );


    quickValues.forEach(
        button => {

            button.disabled =
                locked;

        }
    );

}



/* ========================================
   DIFFICULTY
======================================== */

difficultyButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                if (
                    activeGame
                ) {

                    return;

                }


                difficultyButtons.forEach(
                    item => {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                button.classList.add(
                    "selected"
                );


                selectedDifficulty =
                    button.dataset
                        .difficulty;


                updateDifficultyInfo();

            }
        );

    }
);



function updateDifficultyInfo() {

    const minesCount =
        CONFIG
            .difficulties[
                selectedDifficulty
            ];


    mineCountElement.textContent =
        minesCount;


    safeTilesElement.textContent =
        CONFIG.boardSize -
        minesCount;

}



/* ========================================
   WIN OVERLAY
======================================== */

function showWin(
    multiplier,
    payout
) {

    winMultiplier.textContent =
        `${multiplier.toFixed(2)}×`;


    winAmount.textContent =
        `+ R$ ${payout.toFixed(2)}`;


    winOverlay.classList.remove(
        "active"
    );


    void winOverlay.offsetWidth;


    winOverlay.classList.add(
        "active"
    );

}



/* ========================================
   RESULT
======================================== */

function showResult(
    message,
    type = ""
) {

    resultElement.textContent =
        message;


    resultElement.className =
        "result-message";


    if (
        type
    ) {

        resultElement.classList.add(
            type
        );

    }

}



/* ========================================
   BALANCE
======================================== */

function updateBalance() {

    balanceElement.textContent =
        balance.toFixed(2);

}



/* ========================================
   QUICK BET
======================================== */

quickValues.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                if (
                    activeGame
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

        const amount =
            Number(
                betInput.value
            );


        if (
            !amount ||
            activeGame
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

        const amount =
            Number(
                betInput.value
            );


        if (
            !amount ||
            activeGame
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



/* ========================================
   EVENTS
======================================== */

startButton.addEventListener(
    "click",
    startGame
);


cashoutButton.addEventListener(
    "click",
    cashOut
);



/* ========================================
   INIT
======================================== */

createBoard();

updateBalance();

updateDifficultyInfo();

updateRoundStats();