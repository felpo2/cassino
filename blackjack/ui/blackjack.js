const CONFIG = {

    blackjackPayout: 1.5,

    dealerStand: 17

};


let balance = 1000;

let playerHand = [];

let dealerHand = [];

let deck = [];

let currentBet = 0;

let activeGame = false;

let dealerHidden = true;



const playerHandElement =
    document.getElementById(
        "playerHand"
    );


const dealerHandElement =
    document.getElementById(
        "dealerHand"
    );


const playerValueElement =
    document.getElementById(
        "playerValue"
    );


const dealerValueElement =
    document.getElementById(
        "dealerValue"
    );


const balanceElement =
    document.getElementById(
        "balance"
    );


const betAmountElement =
    document.getElementById(
        "betAmount"
    );


const dealButton =
    document.getElementById(
        "dealButton"
    );


const hitButton =
    document.getElementById(
        "hitButton"
    );


const standButton =
    document.getElementById(
        "standButton"
    );


const roundMessage =
    document.getElementById(
        "roundMessage"
    );


const halfButton =
    document.getElementById(
        "halfButton"
    );


const doubleButton =
    document.getElementById(
        "doubleButton"
    );


const chipButtons =
    document.querySelectorAll(
        ".chips button"
    );


const winOverlay =
    document.getElementById(
        "winOverlay"
    );


const winLabel =
    document.getElementById(
        "winLabel"
    );


const winTitle =
    document.getElementById(
        "winTitle"
    );


const winText =
    document.getElementById(
        "winText"
    );



/* ========================================
   DECK
======================================== */

function createDeck() {

    const suits = [
        "hearts",
        "diamonds",
        "clubs",
        "spades"
    ];


    const ranks = [
        "2", "3", "4", "5",
        "6", "7", "8", "9",
        "10", "J", "Q", "K", "A"
    ];


    deck = [];


    for (const suit of suits) {

        for (const rank of ranks) {

            deck.push({
                rank,
                suit
            });

        }

    }


    shuffleDeck();

}



function shuffleDeck() {

    for (
        let i = deck.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            deck[i],
            deck[j]
        ] = [
            deck[j],
            deck[i]
        ];

    }

}



function drawCard() {

    return deck.pop();

}



/* ========================================
   VALUES
======================================== */

function getCardValue(card) {

    if (
        card.rank === "J" ||
        card.rank === "Q" ||
        card.rank === "K"
    ) {

        return 10;

    }


    if (card.rank === "A") {

        return 11;

    }


    return Number(
        card.rank
    );

}



function getHandValue(hand) {

    let total = 0;

    let aces = 0;


    hand.forEach(
        card => {

            total +=
                getCardValue(card);


            if (
                card.rank === "A"
            ) {

                aces++;

            }

        }
    );


    while (
        total > 21 &&
        aces > 0
    ) {

        total -= 10;

        aces--;

    }


    return total;

}



function isBlackjack(hand) {

    return (
        hand.length === 2 &&
        getHandValue(hand) === 21
    );

}



/* ========================================
   START
======================================== */

async function startGame() {

    if (activeGame) {
        return;
    }


    const amount =
        Number(
            betAmountElement.value
        );


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        showMessage(
            "Digite uma aposta válida.",
            "loss"
        );

        return;

    }


    if (
        amount > balance
    ) {

        showMessage(
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


    createDeck();


    playerHand = [];

    dealerHand = [];


    dealerHidden = true;

    activeGame = true;


    lockBetControls(
        true
    );


    dealButton.disabled =
        true;


    showMessage(
        "Distribuindo cartas..."
    );


    playerHand.push(
        drawCard()
    );

    render();


    await delay(220);


    dealerHand.push(
        drawCard()
    );

    render();


    await delay(220);


    playerHand.push(
        drawCard()
    );

    render();


    await delay(220);


    dealerHand.push(
        drawCard()
    );

    render();


    const playerBJ =
        isBlackjack(
            playerHand
        );


    const dealerBJ =
        isBlackjack(
            dealerHand
        );


    if (
        playerBJ ||
        dealerBJ
    ) {

        await delay(400);

        dealerHidden =
            false;

        render();


        if (
            playerBJ &&
            dealerBJ
        ) {

            push();

            return;

        }


        if (playerBJ) {

            blackjackWin();

            return;

        }


        lose(
            "O dealer fez Blackjack."
        );

        return;

    }


    hitButton.disabled =
        false;

    standButton.disabled =
        false;


    showMessage(
        "Pedir carta ou parar?"
    );

}



/* ========================================
   HIT
======================================== */

async function hit() {

    if (!activeGame) {
        return;
    }


    hitButton.disabled =
        true;

    standButton.disabled =
        true;


    playerHand.push(
        drawCard()
    );


    render();


    await delay(320);


    const value =
        getHandValue(
            playerHand
        );


    if (
        value > 21
    ) {

        dealerHidden =
            false;

        render();


        lose(
            "Você estourou."
        );

        return;

    }


    if (
        value === 21
    ) {

        await stand();

        return;

    }


    hitButton.disabled =
        false;

    standButton.disabled =
        false;

}



/* ========================================
   STAND
======================================== */

async function stand() {

    if (!activeGame) {
        return;
    }


    hitButton.disabled =
        true;

    standButton.disabled =
        true;


    dealerHidden =
        false;


    render();


    showMessage(
        "Vez do dealer..."
    );


    await delay(500);


    while (
        getHandValue(
            dealerHand
        )
        <
        CONFIG.dealerStand
    ) {

        dealerHand.push(
            drawCard()
        );


        render();


        await delay(500);

    }


    resolveRound();

}



/* ========================================
   RESOLVE
======================================== */

function resolveRound() {

    const player =
        getHandValue(
            playerHand
        );


    const dealer =
        getHandValue(
            dealerHand
        );


    if (
        dealer > 21
    ) {

        regularWin(
            "Dealer estourou."
        );

        return;

    }


    if (
        player > dealer
    ) {

        regularWin(
            `${player} contra ${dealer}.`
        );

        return;

    }


    if (
        dealer > player
    ) {

        lose(
            `${dealer} contra ${player}.`
        );

        return;

    }


    push();

}



/* ========================================
   WIN
======================================== */

function regularWin(
    message
) {

    const payout =
        currentBet * 2;


    balance +=
        payout;


    updateBalance();


    showOverlay(
        "VITÓRIA",
        `${getHandValue(playerHand)}`,
        `+ R$ ${(payout - currentBet).toFixed(2)}`
    );


    showMessage(
        `${message} Você venceu.`,
        "win"
    );


    finishRound();

}



function blackjackWin() {

    const payout =
        currentBet *
        (
            1 +
            CONFIG.blackjackPayout
        );


    balance +=
        payout;


    updateBalance();


    showOverlay(
        "BLACKJACK",
        "21",
        `+ R$ ${(payout - currentBet).toFixed(2)}`
    );


    showMessage(
        "Blackjack! Pagamento 3:2.",
        "win"
    );


    finishRound();

}



/* ========================================
   LOSS
======================================== */

function lose(
    message
) {

    showMessage(
        `${message} Você perdeu R$ ${currentBet.toFixed(2)}.`,
        "loss"
    );


    finishRound();

}



/* ========================================
   PUSH
======================================== */

function push() {

    balance +=
        currentBet;


    updateBalance();


    showMessage(
        "Empate. Sua aposta foi devolvida."
    );


    finishRound();

}



/* ========================================
   FINISH
======================================== */

function finishRound() {

    activeGame =
        false;


    hitButton.disabled =
        true;

    standButton.disabled =
        true;


    dealButton.disabled =
        false;


    lockBetControls(
        false
    );

}



/* ========================================
   RENDER
======================================== */

function render() {

    renderHand(
        playerHandElement,
        playerHand,
        false
    );


    renderHand(
        dealerHandElement,
        dealerHand,
        dealerHidden
    );


    playerValueElement.textContent =
        playerHand.length
            ? getHandValue(
                playerHand
            )
            : 0;


    if (
        dealerHidden &&
        dealerHand.length
    ) {

        dealerValueElement.textContent =
            getCardValue(
                dealerHand[0]
            );

    }

    else {

        dealerValueElement.textContent =
            dealerHand.length
                ? getHandValue(
                    dealerHand
                )
                : "?";

    }

}



/* ========================================
   HAND
======================================== */

function renderHand(
    container,
    hand,
    hideSecond
) {

    container.innerHTML =
        "";


    hand.forEach(
        (
            card,
            index
        ) => {

            if (
                hideSecond &&
                index === 1
            ) {

                container.appendChild(
                    createBackCard()
                );

                return;

            }


            container.appendChild(
                createCardElement(
                    card
                )
            );

        }
    );

}



/* ========================================
   CARD UI
======================================== */

function createCardElement(
    card
) {

    const element =
        document.createElement(
            "div"
        );


    const red =
        (
            card.suit === "hearts" ||
            card.suit === "diamonds"
        );


    element.className =
        "playing-card";


    if (red) {

        element.classList.add(
            "red-card"
        );

    }


    const suit =
        suitSymbol(
            card.suit
        );


    element.innerHTML = `
        <div class="card-corner">
            <span class="card-rank">
                ${card.rank}
            </span>

            <span class="card-suit-small">
                ${suit}
            </span>
        </div>

        <div class="card-symbol">
            ${suit}
        </div>

        <div class="card-corner card-bottom">
            <span class="card-rank">
                ${card.rank}
            </span>

            <span class="card-suit-small">
                ${suit}
            </span>
        </div>
    `;


    return element;

}



function createBackCard() {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        "playing-card card-back";


    return element;

}



function suitSymbol(
    suit
) {

    const symbols = {

        hearts: "♥",

        diamonds: "♦",

        clubs: "♣",

        spades: "♠"

    };


    return symbols[suit];

}



/* ========================================
   MESSAGE
======================================== */

function showMessage(
    message,
    type = ""
) {

    roundMessage.textContent =
        message;


    roundMessage.className =
        "round-message";


    if (type) {

        roundMessage.classList.add(
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
   CONTROLS
======================================== */

function lockBetControls(
    locked
) {

    betAmountElement.disabled =
        locked;


    halfButton.disabled =
        locked;


    doubleButton.disabled =
        locked;


    chipButtons.forEach(
        button => {

            button.disabled =
                locked;

        }
    );

}



/* ========================================
   QUICK BET
======================================== */

chipButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                if (activeGame) {
                    return;
                }


                betAmountElement.value =
                    button.dataset.value;

            }
        );

    }
);



halfButton.addEventListener(
    "click",
    () => {

        if (activeGame) {
            return;
        }


        const value =
            Number(
                betAmountElement.value
            );


        if (!value) {
            return;
        }


        betAmountElement.value =
            Math.max(
                1,
                value / 2
            );

    }
);



doubleButton.addEventListener(
    "click",
    () => {

        if (activeGame) {
            return;
        }


        const value =
            Number(
                betAmountElement.value
            );


        if (!value) {
            return;
        }


        betAmountElement.value =
            Math.min(
                balance,
                value * 2
            );

    }
);



/* ========================================
   OVERLAY
======================================== */

function showOverlay(
    label,
    title,
    text
) {

    winLabel.textContent =
        label;


    winTitle.textContent =
        title;


    winText.textContent =
        text;


    winOverlay.classList.remove(
        "active"
    );


    void winOverlay.offsetWidth;


    winOverlay.classList.add(
        "active"
    );

}



/* ========================================
   UTIL
======================================== */

function delay(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );

}



/* ========================================
   EVENTS
======================================== */

dealButton.addEventListener(
    "click",
    startGame
);


hitButton.addEventListener(
    "click",
    hit
);


standButton.addEventListener(
    "click",
    stand
);



/* ========================================
   INIT
======================================== */

updateBalance();

render();