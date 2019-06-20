var casaInicial = localStorage.oitoDamas || false;
var tamanho = 8; // 8x8
var resultado;

// https://www.codeproject.com/Articles/682129/Solving-N-Queen-Problem-by-DFS-and-BFS-and-Show-Go
function oitoDamas(y, x, n = 8) {
    const tabuleiro = criarVetor(n, 0);
    const caminhos = [];
    let cnt = 0;

    // Dado uma coluna x,
    // verifico em cada linha se:
    // já existe uma dama nesta mesma coluna e
    // se estão nas mesmas diagonais.
    function isSafe(x) {
        for (let y = 0; y < cnt; y++) {
            if (tabuleiro[y] == x ||
                Math.abs(x - tabuleiro[y]) == Math.abs(cnt - y)) {
                return false;
            }
        }
        return true;
    }

    function place(x) {
        if (x >= 0 && x < n) {
            caminhos.push({ x: x, y: cnt });
            tabuleiro[cnt++] = x;
        } else {
            console.log(`coluna ${x} errada!!!`);
        }
    }

    function unplace(x) {
        if (cnt > 0) {
            cnt--;
        }
    }

    // Já passou por todas as linha?
    function isGoal() {
        return cnt == n;
    }

    function dfs() {
        if (isGoal()) {
            return true;
        } else {
            // A condicao inicial será sempre segura,
            // pois nenhum outra peça pode ser coloca na sua linha.
            const colunaInicial = cnt == y ? x : 0;
            const tamanhoMaximo = cnt == y ? x + 1 : n;
            // Para cada coluna.
            for (let x = colunaInicial; x < tamanhoMaximo; x++) {
                if (isSafe(x)) {
                    place(x);
                    if (dfs()) {
                        return true;
                    }
                    unplace();
                }
            }
            return false;
        }
    }

    dfs();

    return {
        tabuleiro: tabuleiro,
        caminhos: caminhos,
    };
}

function selecionarCasaInicial(y, x) {
    casaInicial = { y: y, x: x };
    console.log(casaInicial);
    // Salva localmente para ser reutilizado sempre que a pagina for recarregada.
    localStorage.oitoDamas = casaInicial;
    desenharTabuleiro(resultado && resultado.tabuleiro);
}

function executar() {
    if (!casaInicial) {
        alert("Por favor, seleciona a casa inicial!");
    } else {
        resultado = oitoDamas(casaInicial.y, casaInicial.x, tamanho);
        desenharTabuleiro(resultado.tabuleiro);
    }
}

function definirTamanho(n) {
    if (n >= 0) {
        tamanho = n;
    }
}

function desenharTabuleiro(tabuleiro) {
    let res = "";

    for (let y = 0; y < tamanho; y++) {
        res += "<tr>";
        for (let x = 0; x < tamanho; x++) {
            const inicio = (casaInicial.x == x && casaInicial.y == y) ? "inicio" : "";
            const dama = inicio || tabuleiro && tabuleiro[y] == x ? "dama" : "";
            res += `<td onclick='selecionarCasaInicial(${y}, ${x})' class='${inicio} ${dama}'></td>`;
        }
        res += "</tr>\n";
    }

    $("#tabuleiro").html(res);
}