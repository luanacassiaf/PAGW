function importarDeUmArquivo(performClick) {
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

function exportarParaArquivo() {
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

        this.aplicarDirecaoDasArestas($("#switchbox-direcao > input").is(":checked"));
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
                setTimeout(percorrerEtapas, this.delay());
            }
        };

        setTimeout(percorrerEtapas, startDelay || this.delay());
    }
}

