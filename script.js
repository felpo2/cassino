/* =========================================
   CONFIGURAÇÃO
========================================= */

let saldoCliente = 1000;
let saldoCasa = 10000;

let corSelecionada = null;

let rotacaoAtual = 0;

let girando = false;


/*
    Probabilidades do simulador.

    Vermelho = 47.5%
    Preto    = 47.5%
    Branco   = 5%

    Pagamentos:

    Vermelho = 2x
    Preto    = 2x
    Branco   = 14x

    Retorno esperado do jogador:

    47.5% × 2
    +
    47.5% × 2
    +
    5% × 14

    = 1.90

    Como a aposta inicial é retirada antes
    do pagamento, o lucro esperado da casa
    é aproximadamente 5%.
*/

const probabilidades = {
    vermelho: 0.475,
    preto: 0.475,
    branco: 0.05
};

const multiplicadores = {
    vermelho: 2,
    preto: 2,
    branco: 14
};


/* =========================================
   ELEMENTOS
========================================= */

const saldoClienteElement =
    document.getElementById("saldoCliente");

const saldoCasaElement =
    document.getElementById("saldoCasa");

const valorElement =
    document.getElementById("valor");

const roleta =
    document.getElementById("roleta");

const resultado =
    document.getElementById("resultado");

const botao =
    document.getElementById("btnGirar");

const botoesCor =
    document.querySelectorAll(".cor");


/* =========================================
   ATUALIZAR SALDOS
========================================= */

function atualizarSaldos() {

    saldoClienteElement.textContent =
        saldoCliente.toFixed(2);

    saldoCasaElement.textContent =
        saldoCasa.toFixed(2);
}


/* =========================================
   SELEÇÃO DA COR
========================================= */

botoesCor.forEach(botaoCor => {

    botaoCor.addEventListener("click", () => {

        if (girando) {
            return;
        }

        /*
            Remove seleção anterior.
        */

        botoesCor.forEach(botao => {
            botao.classList.remove("selecionada");
        });


        /*
            Seleciona a nova cor.
        */

        botaoCor.classList.add("selecionada");

        corSelecionada =
            botaoCor.dataset.cor;


        resultado.textContent =
            `Você selecionou ${corSelecionada}.`;

        resultado.className =
            "resultado";
    });
});


/* =========================================
   SORTEIO DO RESULTADO
========================================= */

function sortearCor() {

    const numero = Math.random();

    let acumulado = 0;

    for (const cor in probabilidades) {

        acumulado += probabilidades[cor];

        if (numero < acumulado) {
            return cor;
        }
    }

    /*
        Segurança contra problemas
        de arredondamento.
    */

    return "branco";
}


/* =========================================
   ESCOLHER SETOR VISUAL
========================================= */

function escolherSetor(cor) {

    /*
        Cada setor possui 18 graus.

        Vamos escolher aleatoriamente
        um setor visual da cor sorteada.

        Isso é apenas para a animação.
    */

    const setores = {

        vermelho: [
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

        preto: [
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

        branco: [
            351
        ]
    };


    const lista =
        setores[cor];

    return lista[
        Math.floor(
            Math.random() * lista.length
        )
    ];
}


/* =========================================
   GIRAR
========================================= */

function girarRoleta() {

    if (girando) {
        return;
    }


    /* -------------------------
       VALIDAÇÕES
    ------------------------- */

    if (!corSelecionada) {

        resultado.textContent =
            "Escolha uma cor primeiro.";

        return;
    }


    const valor =
        Number(valorElement.value);


    if (!valor || valor <= 0) {

        resultado.textContent =
            "Digite um valor válido.";

        return;
    }


    if (valor > saldoCliente) {

        resultado.textContent =
            "Saldo insuficiente.";

        return;
    }


    /* -------------------------
       COMEÇA A RODADA
    ------------------------- */

    girando = true;

    botao.disabled = true;


    /*
        A aposta sai do saldo
        do cliente e entra no
        saldo da casa.
    */

    saldoCliente -= valor;

    saldoCasa += valor;

    atualizarSaldos();


    resultado.textContent =
        "🎰 Girando...";

    resultado.className =
        "resultado";


    /* -------------------------
       SORTEIO
    ------------------------- */

    const resultadoCor =
        sortearCor();


    /*
        Escolhe um setor visual
        daquela cor.
    */

    const setor =
        escolherSetor(resultadoCor);


    /* -------------------------
       ANIMAÇÃO
    ------------------------- */

    const voltas = 6;


    /*
        O ponteiro está no topo.

        Subtraímos o setor para
        posicionar o setor sorteado
        no ponteiro.
    */

    const destino =
        voltas * 360 +
        (360 - setor);


    rotacaoAtual += destino;


    roleta.style.transform =
        `rotate(${rotacaoAtual}deg)`;


    /* -------------------------
       ESPERA ANIMAÇÃO
    ------------------------- */

    setTimeout(() => {

        finalizarRodada(
            resultadoCor,
            valor
        );

    }, 5000);
}


/* =========================================
   FINALIZAR RODADA
========================================= */

function finalizarRodada(
    resultadoCor,
    valor
) {

    const ganhou =
        resultadoCor === corSelecionada;


    if (ganhou) {

        /*
            Pagamento total.

            Exemplo:

            aposta = R$50
            vermelho = 2x

            retorno = R$100
        */

        const multiplicador =
            multiplicadores[resultadoCor];

        const pagamento =
            valor * multiplicador;


        /*
            O pagamento sai
            do saldo da casa.
        */

        saldoCasa -= pagamento;

        saldoCliente += pagamento;


        resultado.textContent =
            `🎉 Você ganhou! ${resultadoCor.toUpperCase()} — R$ ${pagamento.toFixed(2)}`;

        resultado.className =
            `resultado ${resultadoCor}-texto`;

    } else {

        /*
            Como a aposta já foi
            transferida para a casa,
            ela permanece na casa.
        */

        resultado.textContent =
            `❌ Saiu ${resultadoCor.toUpperCase()}. Você perdeu R$ ${valor.toFixed(2)}.`;

        resultado.className =
            `resultado ${resultadoCor}-texto`;
    }


    atualizarSaldos();


    /*
        Libera uma nova rodada.
    */

    girando = false;

    botao.disabled = false;
}


/* =========================================
   BOTÃO
========================================= */

botao.addEventListener(
    "click",
    girarRoleta
);


/* =========================================
   INICIALIZAÇÃO
========================================= */

atualizarSaldos();