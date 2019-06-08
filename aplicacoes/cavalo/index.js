var modo = 0; // 0 = proibido, 1 = inicio, 2 = fim.
var casaInicio = false;
var casaFim = false;
var matriz = criarMatrix(8, 8, false);

function carregarTabuleiroDoLocalStorage() {
    try {
        if (localStorage.cavalo) {
            importarDoJson(JSON.parse(localStorage.cavalo));
        }
    } catch (e) {
        // nada.
    }
}

function definirModoCasaProibida() {
    modo = 0;
}

function definirModoCasaInicio() {
    modo = 1;
}

function definirModoCasaFim() {
    modo = 2;
}

function limparTabuleiro() {
    matriz = criarMatrix(8, 8, false);
    casaInicio = false;
    casaFim = false;
    desenharTabuleiro();
    salvarGrafoTemporariamente();
}

function definirInicio(x, y) {
    casaInicio = { x: x, y: y };
    matriz[y][x] = false;
    desenharTabuleiro();
    salvarGrafoTemporariamente();
}

function removerInicio() {
    casaInicio = false;
    desenharTabuleiro();
    salvarGrafoTemporariamente();
}

function definirFim(x, y) {
    casaFim = { x: x, y: y };
    matriz[y][x] = false;
    desenharTabuleiro();
    salvarGrafoTemporariamente();
}

function removerFim() {
    casaFim = false;
    desenharTabuleiro();
    salvarGrafoTemporariamente();
}

function definirProibido(x, y) {
    matriz[y][x] = true;
    if (casaInicio && casaInicio.x == x && casaInicio.y == y) casaInicio = false;
    if (casaFim && casaFim.x == x && casaFim.y == y) casaFim = false;
    desenharTabuleiro();
    salvarGrafoTemporariamente();
}

function removerProibido(x, y) {
    matriz[y][x] = false;
    desenharTabuleiro();
    salvarGrafoTemporariamente();
}

function definirCasa(x, y) {
    // Proibido.
    if (modo === 0) {
        if (matriz[y][x]) {
            removerProibido(x, y);
        } else {
            definirProibido(x, y);
        }
    }
    else if (modo === 1) {
        definirInicio(x, y);
        removerProibido(x, y);
    }
    else if (modo === 2) {
        definirFim(x, y);
        removerProibido(x, y);
    }
}

function desenharTabuleiro() {
    let res = "";
    for (let y = 0; y < 8; y++) {
        res += "<tr>";
        for (let x = 0; x < 8; x++) {
            let tipo = "";
            if (casaInicio &&
                casaInicio.x == x &&
                casaInicio.y == y) {
                tipo = "inicio";
            }
            else if (casaFim &&
                casaFim.x == x &&
                casaFim.y == y) {
                tipo = "fim";
            }
            else if (matriz[y][x]) {
                tipo = "proibido";
            } else {
                tipo = "livre";
            }

            res += `<td onclick='definirCasa(${x}, ${y})' px='${x}' py='${y}' dir='none' class='${tipo}'></td>\n`;
        }
        res += "</tr>\n";
    }

    $("#tabuleiro").html(res);
}

function exportarParaJson() {
    return JSON.stringify({
        tipo: "cavalo",
        inicio: casaInicio,
        fim: casaFim,
        matriz: matriz
    });
}

function importarDoJson(data) {
    if (data && data.tipo == "cavalo") {
        casaInicio = data.inicio;
        casaFim = data.fim;
        matriz = data.matriz;
    }
}

function importarDeUmArquivo(performClick) {
    if (performClick) {
        $("#file-input-json").click();
    } else {
        const file = $("#file-input-json")[0].files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                importarDoJson(JSON.parse(content));
                desenharTabuleiro();
                $("#file-input-json").val(null);
            };
            reader.readAsText(file, "UTF-8");
        }
    }
}

function exportarComoArquivo() {
    const file = new File([exportarParaJson()], "cavalo.json", { type: "application/json;charset=utf-8" });
    saveAs(file);
}

function salvarGrafoTemporariamente() {
    localStorage.cavalo = exportarParaJson();
}

function executarCavalo() {
    // Verifica se tem início e fim definidos.
    if (casaInicio == false) {
        alert("Você não selecionou uma Casa Início");
        return;
    }

    if (casaFim == false) {
        alert("Você não selecionou uma Casa Final");
        return;
    }

    // https://www.geeksforgeeks.org/minimum-steps-reach-target-knight/
    function cavaloBFS(matriz, inicio, fim) {
        // Posições válidas do cavalo.
        const dx = [-2, -1, 1, 2, -2, -1, 1, 2];
        const dy = [-1, -2, -2, -1, 1, 2, 2, 1];
        // Fila para armazenar as posições do cavalo no tabuleiro.
        const q = [];
        // Posição inicial do cavalo.
        q.push({ x: inicio.x, y: inicio.y });
        // Matriz de posições e distancias visitadas.
        const visitado = Array(8).fill(false).map(x => Array(8).fill(false));
        const dist = Array(8).fill(0).map(x => Array(8).fill(0));
        visitado[inicio.y][inicio.x] = true;
        const antecessores = Array(8).fill(false).map(x => Array(8).fill(false));
        const antecessores2 = [];

        function posicaoValida(x, y) {
            return x >= 0 && x < 8 && y >= 0 && y < 8;
        }

        function chegouAoFim(x, y) {
            return x === fim.x && y === fim.y;
        }

        // Pra baixo ou pra cima.
        function gerarAntecessoresBC(x, y, dx, dy) {
            const ix = dx > 0 ? -1 : 1;
            const iy = dy > 0 ? -1 : 1;
            const dirx = dx > 0 ? "d" : "e";
            const diry = dy > 0 ? "b" : "c";
            let px = x;
            let py = y;
            while (true) {
                antecessores2.push({ x: px + ix, y: py, dir: dirx });
                px += ix;
                dx += ix;
                if (dx === 0) break;
            }
            while (true) {
                antecessores2.push({ x: px, y: py + iy, dir: diry });
                py += iy;
                dy += iy;
                if (dy === 0) break;
            }
        }

        // Pra esquerda ou direita.
        function gerarAntecessoresED(x, y, dx, dy) {
            const ix = dx > 0 ? -1 : 1;
            const iy = dy > 0 ? -1 : 1;
            const dirx = dx > 0 ? "d" : "e";
            const diry = dy > 0 ? "b" : "c";
            let px = x;
            let py = y;
            while (true) {
                antecessores2.push({ x: px, y: py + iy, dir: diry });
                py += iy;
                dy += iy;
                if (dy === 0) break;
            }
            while (true) {
                antecessores2.push({ x: px + ix, y: py, dir: dirx });
                px += ix;
                dx += ix;
                if (dx === 0) break;
            }
        }

        function gerarAntecessores(x, y) {
            if (antecessores[y][x]) {
                const { cx, cy, ax, ay, dx, dy } = antecessores[y][x];

                if (Math.abs(dy) > Math.abs(dx)) {
                    gerarAntecessoresBC(x, y, dx, dy);
                } else {
                    gerarAntecessoresED(x, y, dx, dy);
                }

                const ultimo = antecessores2[antecessores2.length - 4];
                if (ultimo) {
                    ultimo.m = true;
                }

                gerarAntecessores(ax, ay);
            }
        }

        while (q.length) {
            const u = q.shift();

            // Chegou ao fim.
            if (chegouAoFim(u.x, u.y)) {
                break;
            }

            let fim = false;

            for (let i = 0; i < 8 && !fim; i++) {
                const x = u.x + dx[i];
                const y = u.y + dy[i];

                if (posicaoValida(x, y) && !visitado[y][x] && !matriz[y][x]) {
                    visitado[y][x] = true;
                    q.push({ x: x, y: y });
                    dist[y][x] = dist[u.y][u.x] + 1;
                    antecessores[y][x] = { ax: u.x, ay: u.y, dx: dx[i], dy: dy[i], cx: x, cy: y, d: dist[y][x] };
                    fim = chegouAoFim(x, y);
                }
            }

            if (fim) break;
        }

        gerarAntecessores(fim.x, fim.y);

        return {
            antecessores: antecessores2,
            dist: dist
        };
    }

    const { antecessores, dist } = cavaloBFS(matriz, casaInicio, casaFim);

    // console.log(antecessores);

    function inverterDirecaoDoCaminho(dir) {
        if (dir == "e") return "d";
        if (dir == "d") return "e";
        if (dir == "b") return "c";
        if (dir == "c") return "b";
        return dir;
    }

    function gerarCaminho(i, x, y) {
        if (antecessores[i]) {
            const { x: ax, y: ay, dir, m } = antecessores[i];
            const a = gerarCaminho(i + 1, ax, ay);
            const cell = $(`#tabuleiro td[px=${ax}][py=${ay}]`);
            cell.addClass(dir);
            if (a) cell.addClass(inverterDirecaoDoCaminho(a.dir));
            if (m) cell.attr("m", dist[ay][ax]);
        }

        return antecessores[i];
    }

    // Fim.
    const a = gerarCaminho(0, casaFim.x, casaFim.y);
    const cell = $(`#tabuleiro td[px=${casaFim.x}][py=${casaFim.y}]`);
    if (a) {
        cell.addClass(inverterDirecaoDoCaminho(a.dir));
        cell.attr("m", dist[casaFim.y][casaFim.x]);
    } else {
        alert("Não existe um caminho!");
    }
}

$(document).ready(() => {
    carregarTabuleiroDoLocalStorage();
    desenharTabuleiro();
});