/* ==========================================
   CONFIG
========================================== */

const CONFIG = {

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

        firstDropDuration: 420,

        bounceDuration: 250,

        finalDropDuration: 380

    }

};


/* ==========================================
   STATE
========================================== */

let balance = 1000;

let dropping = false;

let history = [];



/* ==========================================
   DOM
========================================== */

const canvas =
    document.getElementById("plinkoCanvas");

const ctx =
    canvas.getContext("2d");


const bucketsElement =
    document.getElementById("buckets");

const balanceElement =
    document.getElementById("balance");

const betAmountElement =
    document.getElementById("betAmount");

const dropButton =
    document.getElementById("dropButton");

const dropButtonText =
    document.getElementById("dropButtonText");

const resultElement =
    document.getElementById("result");

const historyElement =
    document.getElementById("history");

const winOverlay =
    document.getElementById("winOverlay");

const winMultiplier =
    document.getElementById("winMultiplier");

const winAmount =
    document.getElementById("winAmount");

const halfButton =
    document.getElementById("halfButton");

const doubleButton =
    document.getElementById("doubleButton");

const quickValues =
    document.querySelectorAll(
        ".quick-values button"
    );



/* ==========================================
   CANVAS
========================================== */

let width = 0;
let height = 0;

let pegPositions = [];


/* ==========================================
   BALL
========================================== */

const ball = {

    x: 0,

    y: 0,

    radius: 8,

    visible: false,

    squashX: 1,

    squashY: 1

};



/* ==========================================
   CANVAS SIZE
========================================== */

function resizeCanvas() {

    const rect =
        canvas.getBoundingClientRect();


    const dpr =
        window.devicePixelRatio || 1;


    canvas.width =
        rect.width * dpr;

    canvas.height =
        rect.height * dpr;


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    width =
        rect.width;

    height =
        rect.height;


    createPegPositions();

}


window.addEventListener(
    "resize",
    resizeCanvas
);



/* ==========================================
   PEG POSITIONS

   Agora as posições são realmente
   uma árvore triangular:

              •

            •   •

          •   •   •

        •   •   •   •

========================================== */

function createPegPositions() {

    pegPositions = [];


    /*
     * Espaço reservado para os potes.
     */

    const boardTop = 95;

    const boardBottom =
        height - 105;


    const verticalGap =
        (
            boardBottom -
            boardTop
        )
        /
        (
            CONFIG.rows - 1
        );


    /*
     * Distância horizontal entre os pinos.
     */

    const horizontalGap =
        Math.min(
            54,
            width / 11
        );


    for (
        let row = 0;
        row < CONFIG.rows;
        row++
    ) {

        const pegCount =
            row + 1;


        const y =
            boardTop +
            row * verticalGap;


        /*
         * Centraliza a linha.
         */

        const rowWidth =
            (
                pegCount - 1
            )
            *
            horizontalGap;


        const startX =
            width / 2 -
            rowWidth / 2;


        const rowPegs = [];


        for (
            let col = 0;
            col < pegCount;
            col++
        ) {

            rowPegs.push({

                x:
                    startX +
                    col * horizontalGap,

                y:
                    y

            });

        }


        pegPositions.push(
            rowPegs
        );

    }

}



/* ==========================================
   DRAW LOOP
========================================== */

function draw() {

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    drawPegs();


    if (
        ball.visible
    ) {

        drawBall();

    }


    requestAnimationFrame(
        draw
    );

}



/* ==========================================
   PEGS
========================================== */

function drawPegs() {

    pegPositions.forEach(
        row => {

            row.forEach(
                peg => {

                    ctx.beginPath();


                    ctx.arc(
                        peg.x,
                        peg.y,
                        5,
                        0,
                        Math.PI * 2
                    );


                    ctx.fillStyle =
                        "#e4e8ed";


                    ctx.shadowColor =
                        "rgba(255,255,255,.35)";


                    ctx.shadowBlur =
                        8;


                    ctx.fill();


                    ctx.shadowBlur =
                        0;

                }
            );

        }
    );

}



/* ==========================================
   BALL
========================================== */

function drawBall() {

    ctx.save();


    ctx.translate(
        ball.x,
        ball.y
    );


    ctx.scale(
        ball.squashX,
        ball.squashY
    );


    const gradient =
        ctx.createRadialGradient(
            -3,
            -4,
            1,

            0,
            0,
            ball.radius
        );


    gradient.addColorStop(
        0,
        "#fff1b4"
    );


    gradient.addColorStop(
        .4,
        "#ffc857"
    );


    gradient.addColorStop(
        1,
        "#d88618"
    );


    ctx.beginPath();


    ctx.arc(
        0,
        0,
        ball.radius,
        0,
        Math.PI * 2
    );


    ctx.fillStyle =
        gradient;


    ctx.shadowColor =
        "rgba(255,200,87,.8)";


    ctx.shadowBlur =
        18;


    ctx.fill();


    ctx.restore();

}



/* ==========================================
   BUCKETS
========================================== */

function createBuckets() {

    bucketsElement.innerHTML =
        "";


    CONFIG.multipliers.forEach(
        (
            multiplier,
            index
        ) => {

            const bucket =
                document.createElement(
                    "div"
                );


            bucket.classList.add(
                "bucket"
            );


            if (
                multiplier >= 3
            ) {

                bucket.classList.add(
                    "high"
                );

            }

            else if (
                multiplier > 1
            ) {

                bucket.classList.add(
                    "medium"
                );

            }

            else {

                bucket.classList.add(
                    "low"
                );

            }


            bucket.dataset.index =
                index;


            bucket.textContent =
                `${multiplier}×`;


            bucketsElement.appendChild(
                bucket
            );

        }
    );

}



/* ==========================================
   PATH

   Cada RIGHT incrementa a coluna.

   Exemplo:

   L
   R
   R
   L
   R

   coluna final = 3

========================================== */

function createPath() {

    const directions = [];

    let column = 0;


    for (
        let row = 0;
        row < CONFIG.rows;
        row++
    ) {

        const direction =
            Math.random() < 0.5
                ? "left"
                : "right";


        directions.push(
            direction
        );


        if (
            direction === "right"
        ) {

            column++;

        }

    }


    return {

        directions,

        bucketIndex:
            column

    };

}



/* ==========================================
   ANIMATE DROP
========================================== */

async function animateDrop(
    path
) {

    ball.visible = true;


    /*
     * Começa acima do primeiro pino.
     */

    const firstPeg =
        pegPositions[0][0];


    ball.x =
        firstPeg.x;


    ball.y =
        30;


    /*
     * 1 — queda inicial
     */

    await fallToPeg(
        firstPeg
    );


    /*
     * A posição lógica atual da bola
     * dentro da árvore.
     */

    let column = 0;


    /*
     * Já batemos na linha 0.
     *
     * Agora cada direção define
     * qual pino da próxima linha
     * será atingido.
     */

    for (
        let row = 0;
        row < CONFIG.rows - 1;
        row++
    ) {

        const direction =
            path.directions[row];


        if (
            direction === "right"
        ) {

            column++;

        }


        const nextPeg =
            pegPositions[
                row + 1
            ][
                column
            ];


        await bounceToPeg(

            nextPeg,

            direction

        );

    }


    /*
     * A última decisão não tem outro
     * pino porque já chegamos na
     * última linha.
     *
     * Ela define qual pote pegar.
     */

    const finalDirection =
        path.directions[
            CONFIG.rows - 1
        ];


    if (
        finalDirection === "right"
    ) {

        column++;

    }


    /*
     * Isso precisa coincidir com
     * o resultado matemático.
     */

    path.bucketIndex =
        column;


    await fallIntoBucket(
        path.bucketIndex
    );


    ball.visible =
        false;


    hitBucket(
        path.bucketIndex
    );

}



/* ==========================================
   INITIAL FALL
========================================== */

function fallToPeg(
    peg
) {

    return animateMovement({

        startX:
            ball.x,

        startY:
            ball.y,

        targetX:
            peg.x,

        /*
         * A bolinha para um pouco
         * acima do centro do pino.
         */

        targetY:
            peg.y -
            ball.radius -
            4,

        duration:
            CONFIG.animation
                .firstDropDuration,

        arc:
            0,

        gravity:
            true

    }).then(
        () => pegImpact()
    );

}



/* ==========================================
   BOUNCE BETWEEN REAL PEGS
========================================== */

async function bounceToPeg(
    peg,
    direction
) {

    /*
     * Pequeno squash ao bater
     * no pino anterior.
     */

    await pegImpact();


    const directionForce =
        direction === "left"
            ? -1
            : 1;


    await animateMovement({

        startX:
            ball.x,

        startY:
            ball.y,

        targetX:
            peg.x,

        targetY:
            peg.y -
            ball.radius -
            4,

        duration:
            CONFIG.animation
                .bounceDuration,

        /*
         * Quanto maior, mais
         * perceptível o quique.
         */

        arc:
            22,

        directionForce

    });

}



/* ==========================================
   PEG IMPACT
========================================== */

function pegImpact() {

    return new Promise(
        resolve => {

            ball.squashX =
                1.18;

            ball.squashY =
                .82;


            setTimeout(
                () => {

                    ball.squashX =
                        .92;

                    ball.squashY =
                        1.08;

                },
                45
            );


            setTimeout(
                () => {

                    ball.squashX =
                        1;

                    ball.squashY =
                        1;


                    resolve();

                },
                95
            );

        }
    );

}



/* ==========================================
   MOVEMENT
========================================== */

function animateMovement({

    startX,
    startY,

    targetX,
    targetY,

    duration,

    arc = 0,

    directionForce = 1,

    gravity = false

}) {

    return new Promise(
        resolve => {

            const startTime =
                performance.now();


            function frame(
                now
            ) {

                const progress =
                    Math.min(
                        (
                            now -
                            startTime
                        )
                        /
                        duration,
                        1
                    );


                /*
                 * Horizontal suave.
                 */

                const horizontalEase =
                    easeInOutQuad(
                        progress
                    );


                ball.x =
                    startX
                    +
                    (
                        targetX -
                        startX
                    )
                    *
                    horizontalEase;


                /*
                 * Queda inicial usa
                 * aceleração de gravidade.
                 */

                if (
                    gravity
                ) {

                    const gravityEase =
                        progress *
                        progress;


                    ball.y =
                        startY
                        +
                        (
                            targetY -
                            startY
                        )
                        *
                        gravityEase;

                }

                else {

                    /*
                     * Movimento base
                     * entre os pinos.
                     */

                    const baseY =
                        startY
                        +
                        (
                            targetY -
                            startY
                        )
                        *
                        progress;


                    /*
                     * A bola dá um pequeno
                     * salto logo após bater
                     * no pino e depois cai.
                     */

                    const bounceArc =
                        Math.sin(
                            progress *
                            Math.PI
                        )
                        *
                        arc;


                    ball.y =
                        baseY -
                        bounceArc;

                }


                if (
                    progress < 1
                ) {

                    requestAnimationFrame(
                        frame
                    );

                }

                else {

                    ball.x =
                        targetX;

                    ball.y =
                        targetY;


                    resolve();

                }

            }


            requestAnimationFrame(
                frame
            );

        }
    );

}



/* ==========================================
   FINAL DROP
========================================== */

function fallIntoBucket(
    bucketIndex
) {

    const bucket =
        document.querySelector(

            `.bucket[data-index="${bucketIndex}"]`

        );


    const bucketRect =
        bucket.getBoundingClientRect();


    const canvasRect =
        canvas.getBoundingClientRect();


    const targetX =
        bucketRect.left
        -
        canvasRect.left
        +
        bucketRect.width / 2;


    const targetY =
        height -
        42;


    return animateMovement({

        startX:
            ball.x,

        startY:
            ball.y,

        targetX,

        targetY,

        duration:
            CONFIG.animation
                .finalDropDuration,

        arc:
            8

    });

}



/* ==========================================
   BUCKET HIT
========================================== */

function hitBucket(
    bucketIndex
) {

    const bucket =
        document.querySelector(

            `.bucket[data-index="${bucketIndex}"]`

        );


    bucket.classList.remove(
        "hit"
    );


    void bucket.offsetWidth;


    bucket.classList.add(
        "hit"
    );

}



/* ==========================================
   EASING
========================================== */

function easeInOutQuad(
    value
) {

    return value < .5

        ? 2 *
          value *
          value

        : 1 -
          Math.pow(
              -2 *
              value +
              2,
              2
          )
          / 2;

}



/* ==========================================
   PLAY
========================================== */

async function dropBall() {

    if (
        dropping
    ) {

        return;

    }


    const amount =
        Number(
            betAmountElement.value
        );


    if (
        !Number.isFinite(amount)
        ||
        amount <= 0
    ) {

        showResult(
            "Digite um valor válido.",
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


    dropping =
        true;


    lockInterface(
        true
    );


    balance -=
        amount;


    updateBalance();


    dropButtonText.textContent =
        "Caindo...";


    showResult(
        "Acompanhe a queda..."
    );


    const path =
        createPath();


    await animateDrop(
        path
    );


    const multiplier =
        CONFIG.multipliers[
            path.bucketIndex
        ];


    const payout =
        amount *
        multiplier;


    balance +=
        payout;


    updateBalance();


    updateHistory(
        multiplier
    );


    if (
        multiplier > 1
    ) {

        showWin(
            multiplier,
            payout
        );


        showResult(

            `${multiplier}× — R$ ${payout.toFixed(2)}`,

            "win"

        );

    }

    else if (
        multiplier === 1
    ) {

        showResult(
            "1× — aposta devolvida."
        );

    }

    else {

        showResult(

            `${multiplier}× — R$ ${payout.toFixed(2)}`,

            "loss"

        );

    }


    dropping =
        false;


    dropButtonText.textContent =
        "Soltar bola";


    lockInterface(
        false
    );

}



/* ==========================================
   WIN
========================================== */

function showWin(
    multiplier,
    payout
) {

    winMultiplier.textContent =
        `${multiplier}×`;


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



/* ==========================================
   HISTORY
========================================== */

function updateHistory(
    multiplier
) {

    history.unshift(
        multiplier
    );


    history =
        history.slice(
            0,
            6
        );


    historyElement.innerHTML =
        "";


    history.forEach(
        value => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "history-item";


            item.textContent =
                `${value}×`;


            historyElement.appendChild(
                item
            );

        }
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



/* ==========================================
   LOCK
========================================== */

function lockInterface(
    state
) {

    dropButton.disabled =
        state;


    betAmountElement.disabled =
        state;


    halfButton.disabled =
        state;


    doubleButton.disabled =
        state;

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
                    dropping
                ) {

                    return;

                }


                betAmountElement.value =
                    button.dataset.value;

            }
        );

    }
);



/* ==========================================
   HALF
========================================== */

halfButton.addEventListener(
    "click",
    () => {

        if (
            dropping
        ) {

            return;

        }


        const amount =
            Number(
                betAmountElement.value
            );


        if (
            !amount
        ) {

            return;

        }


        betAmountElement.value =
            Math.max(
                1,
                amount / 2
            );

    }
);



/* ==========================================
   DOUBLE
========================================== */

doubleButton.addEventListener(
    "click",
    () => {

        if (
            dropping
        ) {

            return;

        }


        const amount =
            Number(
                betAmountElement.value
            );


        if (
            !amount
        ) {

            return;

        }


        betAmountElement.value =
            Math.min(
                balance,
                amount * 2
            );

    }
);



/* ==========================================
   EVENT
========================================== */

dropButton.addEventListener(
    "click",
    dropBall
);



/* ==========================================
   INIT
========================================== */

createBuckets();

updateBalance();

resizeCanvas();

draw();