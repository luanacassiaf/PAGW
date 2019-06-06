function importarJsonComoGrafo(performClick) {
    if (performClick) {
        $("#file-input-json").click();
    } else {
        let file = $("#file-input-json")[0].files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = (e) => {
                let content = e.target.result;
                grafo.fromJson(JSON.parse(content));
            };
            reader.readAsText(file, "UTF-8");
        }
    }
}

function exportarComoImagem(type) {
    if (type == 'png') {
        exportarComoImagemPng(grafo.toPng());
    } else {
        exportarComoImagemJpg(grafo.toJpg());
    }
}

function exportarComoImagemPng(blob) {
    if (!blob || blob.size == 0) return;
    let file = new File([blob], "grafo.png", { type: "image/png" });
    saveAs(file);
}

function exportarComoImagemJpg(blob) {
    if (!blob || blob.size == 0) return;
    let file = new File([blob], "grafo.jpg", { type: "image/jpeg" });
    saveAs(file);
}

function salvarGrafoComoJson() {
    let file = new File([grafo.toJson()], "grafo.json", { type: "application/json;charset=utf-8" });
    saveAs(file);
}

function exibirExportarModal() {
    $("#matriz-adjacencia-texto").text(grafo.obterMatrizDeAdjacenciaFormatada());
    $("#lista-adjacencia-texto").text(grafo.obterListaDeAdjacenciaFormatada());
    $("#exportar-modal").modal("show");
}

$("input[type=number][has-limit]").on("change", function (e) {
    let length = grafo.tamanho();
    if ($(this).val() >= length) {
        $(this).val(Math.max(0, length - 1));
    }
});

class Grafo {

    constructor(containerId, loadFromLocalStorage = true) {
        this.containerId = containerId;
        this.uid = Date.now();
        this.modo = 0;
        this.velocidadeDaAnimacao = 500;
        this.direcionado = false;
        this.verticesSelecionadosParaConectar = [];
        this.interceptadoresDeAcao = [];
        this.grafo = cytoscape({
            container: document.getElementById(containerId),
            style: [
                {
                    selector: ":selected",
                    style: {
                        'background-color': '#4426bb',
                        'line-color': '#4426bb',
                        'target-arrow-color': '#4426bb',
                        'target-arrow-shape': function (ele) { return ele.data('direcionado') ? 'triangle' : 'none' },
                    }
                },
                {
                    selector: "node",
                    style: {
                        label: function (ele) { return ele.data('label') || "" }
                    }
                },
                {
                    selector: "edge",
                    style: {
                        label: function (ele) { return ele.data('peso') || "" },
                        "edge-text-rotation": "autorotate",
                        'curve-style': 'bezier',
                        'target-arrow-shape': function (ele) { return ele.data('direcionado') ? 'triangle' : 'none' },
                        'source-arrow-shape': 'none'
                    }
                },
                {
                    selector: '.highlighted',
                    style: {
                        'background-color': '#FF9800',
                        'line-color': '#FF9800',
                        'target-arrow-color': '#FF9800',
                        'transition-property': 'background-color, line-color, target-arrow-color',
                        'transition-duration': '0.5s'
                    }
                },
                {
                    selector: '.start-node',
                    style: {
                        'background-color': '#4CAF50'
                    }
                },
                {
                    selector: '.end-node',
                    style: {
                        'background-color': '#f44336'
                    }
                }
            ],
            minZoom: 0.5,
            maxZoom: 4,
            wheelSensitivity: 0.1
        });

        //Evento de clique.
        this.grafo.on('tap', (event) => {
            const isNode = event.target && event.target.length !== undefined && event.target.isNode();
            const isEdge = event.target && event.target.length !== undefined && event.target.isEdge();
            this.onTap(event, event.target, isNode, isEdge);
            //Modo Inserir.
            if (this.modo == 1) {
                //Evita sobrepor novos vertices e permite sua seleção.
                if (!event.target || !event.target.length) {
                    this.onInserirNovoVertice(event);
                    this.atualizarRotuloDeTodosOsVertices();
                }
            }
            //Modo Conectar.
            else if (this.modo == 2) {
                //Um vertice foi selecionado.
                if (event.target && event.target.length && event.target.isNode()) {
                    //Já tem um vertice selecionado.
                    if (this.verticesSelecionadosParaConectar.length == 1) {
                        //Conectar os vertices.
                        this.onConectarDoisVertices(this.verticesSelecionadosParaConectar[0], event.target);
                        this.verticesSelecionadosParaConectar = [];
                    } else {
                        this.verticesSelecionadosParaConectar.push(event.target);
                    }
                }
            }
            //Modo Remover.
            else if (this.modo == 3) {
                //Algo foi selecionado.
                if (event.target && event.target.length) {
                    if (event.target.isNode()) {
                        this.onRemoverVertice(event.target);
                        this.atualizarRotuloDeTodosOsVertices();
                    } else if (event.target.isEdge()) {
                        this.onRemoverAresta(event.target);
                        this.atualizarRotuloDeTodosOsVertices();
                    }
                }
            }
        });

        this.grafo.contextMenus({
            menuItems: this.obtainContextMenuItems()
        });

        if (loadFromLocalStorage && localStorage.grafo) {
            this.fromJson(JSON.parse(localStorage.grafo));
        }
    }

    adicionarInteceptadorDeAcao(action) {
        this.interceptadoresDeAcao.push(action);
    }

    executarAcao(action) {
        if (action === "selecionar") {
            this.habilitarModoSelecionar();
        } else if (action === "adicionar") {
            this.habilitarModoInserir();
        } else if (action === "conectar") {
            this.habilitarModoConectar();
        } else if (action === "remover") {
            this.habilitarModoRemover();
        } else if (action === "limpar") {
            this.limpar();
        }

        for (const actionHandler of this.interceptadoresDeAcao) {
            actionHandler(action);
        }
    }

    salvarGrafoTemporariamente() {
        if (this.toJson) {
            localStorage.grafo = this.toJson();
        }
    }

    onTap(event, target, isNode, isEdge) {
        event.stopPropagation();
        // nada.
    }

    obtainContextMenuItems() {
        return [];
    }

    toJson() {
        let json = JSON.stringify(this.grafo.json());
        return json;
    }

    fromJson(json) {
        delete json.style;
        this.grafo.startBatch();
        this.grafo.json(json);
        this.limparEstiloDoGrafo();
        this.atualizarRotuloDeTodosOsVertices();
        this.aplicarDirecaoDasArestas(this.direcionado);
        this.grafo.nodes().unselect();
        this.grafo.edges().unselect();
        this.grafo.endBatch();
    }

    toPng() {
        return this.grafo.png({ output: 'blob', full: true });
    }

    toJpg() {
        return this.grafo.jpg({ output: 'blob', full: true });
    }

    habilitarModoSelecionar() {
        this.modo = 0;
    }

    habilitarModoInserir() {
        this.modo = 1;
    }

    habilitarModoConectar() {
        this.modo = 2;
    }

    habilitarModoRemover() {
        this.modo = 3;
    }

    definirVelocidadeDaAnimacao(velocidade) {
        this.velocidadeDaAnimacao = 1 + (1000 * velocidade / 100);
    }

    limpar() {
        this.grafo.edges().remove();
        this.grafo.nodes().remove();
        this.salvarGrafoTemporariamente();
    }

    tamanho() {
        return this.grafo.nodes().size();
    }

    limparEstiloDoGrafo() {
        this.grafo.edges().removeClass('highlighted');
        this.grafo.nodes().removeClass('start-node');
        this.grafo.nodes().removeClass('end-node');
        this.grafo.nodes().removeClass('highlighted');
    }

    inserirNovoVertice(data) {
        //Define um id único para o vértice.
        data.data.id = this.uid.toString();
        data.data.label = this.uid.toString();
        //Adiciona o novo vértice.
        this.grafo.add({
            group: "nodes",
            data: data.data,
            position: {
                x: data.x,
                y: data.y
            }
        });
        //Gera um novo id.
        this.uid++;
        this.salvarGrafoTemporariamente();
        this.grafo.nodes().removeListener("position");
        this.grafo.nodes().on("dragfreeon", this.salvarGrafoTemporariamente);
    }

    inserirNovaAresta(data) {
        //Define um id único para a aresta.
        data.data.id = this.uid.toString();
        //Adiciona a nova aresta.
        this.grafo.add({
            group: "edges",
            data: data.data
        });
        //Gerar um novo id.
        this.uid++;
        this.salvarGrafoTemporariamente();
    }

    removerVerticeOuAresta(verticeOuAresta) {
        this.grafo.remove(verticeOuAresta);
        this.salvarGrafoTemporariamente();
    }

    atualizarRotuloDeTodosOsVertices() {
        //Seta cada vértice com sua posição i.
        this.grafo.nodes().forEach((node, i) => {
            node.data('label', i.toString());
        });
    }

    alternarDirecaoDasArestas() {
        this.aplicarDirecaoDasArestas(!this.direcionado);
    }

    aplicarDirecaoDasArestas(direcionado) {
        this.direcionado = direcionado;
        this.grafo.edges().data('direcionado', direcionado);
        this.salvarGrafoTemporariamente();
    }

    obterMatrizDeAdjacencia() {
        //criar uma lista de vértices.
        const vertices = this.grafo.nodes().map((node) => node.id());
        //Cria a matriz.
        const n = vertices.length;
        const matriz = Array(n).fill(false).map(() => Array(n).fill(false));
        //pegar todas as arestas.
        this.grafo.edges().forEach((edge, i) => {
            //Preenche a matriz.
            let sourcePos = vertices.indexOf(edge.source().id());
            let targetPos = vertices.indexOf(edge.target().id());
            //Direcionado.
            matriz[sourcePos][targetPos] = { edge: edge, source: edge.source(), target: edge.target(), sourcePosition: sourcePos, targetPosition: targetPos };
            //Não Direcionado.
            if (!this.direcionado) {
                matriz[targetPos][sourcePos] = { edge: edge, source: edge.target(), target: edge.source(), sourcePosition: targetPos, targetPosition: sourcePos };
            }
        });
        return matriz;
    }

    obterListaDeAdjacencia() {
        //criar uma lista de vértices.
        const vertices = this.grafo.nodes().map((node) => node.id());
        //Cria a matriz.
        const n = vertices.length;
        const matriz = Array(n).fill(false).map(() => Array(0));
        //pegar todas as arestas.
        this.grafo.edges().forEach((edge, i) => {
            //Preenche a matriz.
            let sourcePos = vertices.indexOf(edge.source().id());
            let targetPos = vertices.indexOf(edge.target().id());
            //Direcionado.
            matriz[sourcePos].push({ edge: edge, source: edge.source(), target: edge.target(), position: targetPos, sourcePosition: sourcePos, targetPosition: targetPos });
            //matriz[sourcePos].sort();
            //Não Direcionado.
            if (!this.direcionado) {
                matriz[targetPos].push({ edge: edge, source: edge.target(), target: edge.source(), position: sourcePos, sourcePosition: sourcePos, targetPosition: targetPos });
                //matriz[targetPos].sort();
            }
        });
        return matriz;
    }

    obterMatrizDeAdjacenciaFormatada() {
        const matriz = this.obterMatrizDeAdjacencia();
        let res = '';
        for (let y = 0; y < matriz.length; y++) {
            if (y > 0) res += '\r\n';

            for (let x = 0; x < matriz[y].length; x++) {
                if (x > 0) res += ', ';
                res += matriz[y][x] ? '1' : '0';
            }
        }
        return res;
    }

    obterListaDeAdjacenciaFormatada() {
        const lista = this.obterListaDeAdjacencia();
        let res = '';
        for (let y = 0; y < lista.length; y++) {
            if (y > 0) res += '\r\n';

            res += y + ' ⟶ ';

            for (let x = 0; x < lista[y].length; x++) {
                if (x > 0) res += ' ⟶ ';
                res += lista[y][x].position;
            }
        }
        return res;
    }

    executar() {
        //nada.
    }
}

class Stepper {

    constructor(etapas, quantidadeDeSubEtapas, delay) {
        this.etapas = etapas;
        this.quantidadeDeSubEtapas = quantidadeDeSubEtapas;
        this.delay = delay;
    }

    executar(action, startDelay) {
        let etapa = 0;
        let subetapa = 0;
        let percorrerEtapas = () => {
            if (etapa < this.etapas.length) {
                action(this.etapas[etapa], etapa, subetapa);
                subetapa++;
                if ((subetapa % this.quantidadeDeSubEtapas) == 0) {
                    subetapa = 0;
                    etapa++;
                }
                setTimeout(percorrerEtapas, this.delay);
            }
        };

        setTimeout(percorrerEtapas, startDelay || this.delay);
    }
}

class Cavalo {

    constructor(tabuleiroId, loadFromLocalStorage = true) {
        this.tabuleiroId = tabuleiroId;
        this.matriz = Array(8).fill(false).map(() => Array(8).fill(false));
        this.fim = false;
        this.inicio = false;
        this.modo = 0; // 0 = proibido, 1 = inicio, 2 = fim.
        this.interceptadoresDeAcao = [];

        try {
            if (loadFromLocalStorage && localStorage.cavalo) {
                this.fromJson(JSON.parse(localStorage.cavalo));
            }
        } catch (e) {
            // nada.
        }

        this.gerarTabuleiro();
    }

    adicionarInteceptadorDeAcao(action) {
        this.interceptadoresDeAcao.push(action);
    }

    executarAcao(action) {
        if (action === "definir-inicio") {
            this.definirModo(1);
        } else if (action === "definir-fim") {
            this.definirModo(2);
        } else if (action === "definir-proibido") {
            this.definirModo(0);
        } else if (action === "limpar") {
            this.limpar();
        }

        for (const actionHandler of this.interceptadoresDeAcao) {
            actionHandler(action);
        }
    }

    definirModo(modo) {
        this.modo = modo;
    }

    definirInicio(x, y) {
        this.inicio = { x: x, y: y };
        this.matriz[y][x] = false;
        this.gerarTabuleiro();
        this.salvarGrafoTemporariamente();
    }

    removerInicio(x, y) {
        this.inicio = false;
        this.gerarTabuleiro();
        this.salvarGrafoTemporariamente();
    }

    definirFim(x, y) {
        this.fim = { x: x, y: y };
        this.matriz[y][x] = false;
        this.gerarTabuleiro();
        this.salvarGrafoTemporariamente();
    }

    removerFim(x, y) {
        this.fim = false;
        this.gerarTabuleiro();
        this.salvarGrafoTemporariamente();
    }

    definirProibido(x, y) {
        this.matriz[y][x] = true;
        if (this.inicio && this.inicio.x == x && this.inicio.y == y) this.inicio = false;
        if (this.fim && this.fim.x == x && this.fim.y == y) this.fim = false;
        this.gerarTabuleiro();
        this.salvarGrafoTemporariamente();
    }

    removerProibido(x, y) {
        this.matriz[y][x] = false;
        this.gerarTabuleiro();
        this.salvarGrafoTemporariamente();
    }

    definir(x, y) {
        // Proibido.
        if (this.modo === 0) {
            if (this.matriz[y][x]) {
                this.removerProibido(x, y);
            } else {
                this.definirProibido(x, y);
            }
        }
        else if (this.modo === 1) {
            this.definirInicio(x, y);
            this.removerProibido(x, y);
        }
        else if (this.modo === 2) {
            this.definirFim(x, y);
            this.removerProibido(x, y);
        }
    }

    limpar() {
        this.matriz = Array(8).fill(false).map(() => Array(8).fill(false));
        this.inicio = false;
        this.fim = false;
        this.gerarTabuleiro();
        this.salvarGrafoTemporariamente();
    }

    gerarTabuleiro() {
        let res = "";
        for (let y = 0; y < 8; y++) {
            res += "<tr>";
            for (let x = 0; x < 8; x++) {
                // Marcado com proibido.
                if (this.inicio &&
                    this.inicio.x == x &&
                    this.inicio.y == y) {
                    res += `<td onclick='grafo.definir(${x}, ${y})' px='${x}' py='${y}' dir='none' class='inicio'></td>`;
                }
                else if (this.fim &&
                    this.fim.x == x &&
                    this.fim.y == y) {
                    res += `<td onclick='grafo.definir(${x}, ${y})' px='${x}' py='${y}' dir='none' class='fim'></td>`;
                }
                else if (this.matriz[y][x]) {
                    res += `<td onclick='grafo.definir(${x}, ${y})' px='${x}' py='${y}' dir='none' class='proibido'></td>`;
                } else {
                    res += `<td onclick='grafo.definir(${x}, ${y})' px='${x}' py='${y}' dir='none' class='livre'></td>`;
                }
            }
            res += "</tr>\n";
        }

        $(this.tabuleiroId).html(res);
    }

    toJson() {
        return JSON.stringify({
            inicio: this.inicio,
            fim: this.fim,
            matriz: this.matriz
        });
    }

    fromJson(data) {
        this.inicio = data.inicio;
        this.fim = data.fim;
        this.matriz = data.matriz;
        this.gerarTabuleiro();
    }

    salvarGrafoTemporariamente() {
        if (this.toJson) {
            localStorage.cavalo = this.toJson();
        }
    }

    executar() {
        // Verifica se tem início e fim definidos.
        if (this.inicio == false) {
            alert("Você não selecionou uma Casa Início");
            return;
        }
        if (this.fim == false) {
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

        const { antecessores, dist } = cavaloBFS(this.matriz, this.inicio, this.fim);

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
                const cell = $(`#cavalo-tabuleiro td[px=${ax}][py=${ay}]`);
                cell.addClass(dir);
                if (a) cell.addClass(inverterDirecaoDoCaminho(a.dir));
                if (m) cell.attr("m", dist[ay][ax]);
            }

            return antecessores[i];
        }

        // Fim.
        const a = gerarCaminho(0, this.fim.x, this.fim.y);
        const cell = $(`#cavalo-tabuleiro td[px=${this.fim.x}][py=${this.fim.y}]`);
        if (a) {
            cell.addClass(inverterDirecaoDoCaminho(a.dir));
            cell.attr("m", dist[this.fim.y][this.fim.x]);
        } else {
            alert("Não existe um caminho!");
        }
    }
}
