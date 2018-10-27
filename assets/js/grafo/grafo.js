class Grafo {

    constructor(container) {
        this.observable = new EventEmitter();
        this.container = container;
        this.vertices = new vis.DataSet();
        this.arestas = new vis.DataSet();
        //Configurações.
        this.options = {
            layout: {
                randomSeed: 0,
                improvedLayout: false
            },
            nodes: {
                size: 18,
                shape: 'dot',
                borderWidth: 2,
                shadow: false,
                color: '#9E9E9E',
                font: {
                    size: 16,
                    color: '#FFF'
                }
            },
            edges: {
                width: 2,
                smooth: {
                    type: 'continuous',
                    roundness: 0
                },
                color: {
                    color: '#9E9E9E',
                    highlight: '#757575'
                }
            },
            physics: {
                enabled: false
            }
        };
        this.grafo = null;
        this.verticeArray = Array(32).fill(false);
        this.matriz = Array(32).fill(null).map(() => Array(32).fill(false));
    }

    //Registra um callback.
    on(label, callback) {
        this.observable.addListener(label, callback);
    }

    obterPosicaoDisponivel() {
        return this.obterNumeroDeVertices();
    }

    obterNumeroDeVertices() {
        return this.vertices.length;
    }

    obterNumeroDeArestas() {
        return this.arestas.length;
    }

    //Gerar n vertices.
    gerar(n) {
        for (let i = 0; i < n; i++) {
            this.criarVertice();
        }
    }

    //Obtém o id do vertice numa determinada posição.
    obterIdDoVerticeNaPosicao(pos) {
        console.log(`obterIdDoVerticeNaPosicao(${pos})`);
        let vertices = this.vertices.get();
        for (let i = 0; i < vertices.length; i++) {
            if (i == pos) {
                return vertices[i].id;
            }
        }
        return false;
    }

    //Obtém a posição do vertice com determinado id.
    obterPosicaoDoVerticeComId(id) {
        console.log(`obterPosicaoDoVerticeComId(${id})`);
        let vertices = this.vertices.get();
        for (let i = 0; i < vertices.length; i++) {
            if (vertices[i].id == id) {
                return i;
            }
        }
        return false;
    }

    atualizarLabelDeTodosOsVertices() {
        let vertices = this.vertices.get();
        for (let i = 0; i < vertices.length; i++) {
            this.vertices.update({id: vertices[i].id, label: `${i}`});
        }
    }

    //Obtém a aresta entre os vertices nas posições a e b.
    obterArestasEntreOsVerticesNasPosicoes(posa, posb) {
        console.log(`obterArestaEntreOsVerticesNasPosicoes(${posa}, ${posb})`);
        let ida = this.obterIdDoVerticeNaPosicao(posa);
        let idb = this.obterIdDoVerticeNaPosicao(posb);
        let arestas = this.arestas.get({
            filter: function (item) {
                return (item.from === ida && item.to === idb) ||
                        (item.from === idb && item.to === ida);
            }
        });
        return arestas.length > 0 ? arestas : false;
    }

    //Obtém a aresta com determinado id.
    obterAresta(id) {
        return this.arestas.get({
            filter: function (item) {
                return (item.id === id);
            }
        })[0] || false;
    }

    //Obtém a vértice com determinado id.
    obterVertice(id) {
        return this.vertices.get({
            filter: function (item) {
                return (item.id === id);
            }
        })[0] || false;
    }

    //Cria um novo vértice e chama um callback passando seu dados.
    criarVertice(action) {
        let v = {};
        typeof action === 'function' && action(v);
        let pos = this.obterPosicaoDisponivel();
        v.label = `${pos}`;
        this.vertices.add(v);
        this.verticeArray[pos] = v.id;
        console.log(`criarVertice(${JSON.stringify(v)})`);
    }

    //Cria um novo aresta a partir do id de 2 vértices e chama um callback passando seu dados.
    criarAresta(from, to, action) {
        let a = {};
        typeof action === 'function' && action(a);
        a.from = from;
        a.to = to;
        this.arestas.add(a);
        return a;
    }

    //Cria uma nova aresta entre 2 vertices com determinado id e chama um callback passando seus dados.
    criarArestaEntreVertices(from, to, action) {
        let a = this.criarAresta(from, to, action);
        console.log(`criarArestaEntreVertices(${JSON.stringify(a)})`);
    }

    //Cria uma nova aresta entre 2 vertices com determinada posição e chama um callback passando seus dados.
    criarArestaEntreVerticesNasPosicoes(from, to, action) {
        let ida = this.obterIdDoVerticeNaPosicao(from);
        let idb = this.obterIdDoVerticeNaPosicao(to);
        let a = this.criarAresta(ida, idb, action);
        console.log(`criarArestaEntreVerticesNasPosicoes(${JSON.stringify(a)})`);
    }

    //Remove vértice com determinado id.
    removerVertice(id) {
        console.log(`removerVertice(${id})`);
        this.vertices.remove(id);
    }

    //Remove um vertice com determinada posição.
    removerVerticeNaPosicao(pos) {
        console.log(`removerVerticeNaPosicao(${pos})`);
        let id = this.obterIdDoVerticeNaPosicao(pos);
        this.vertices.remove(id);
    }

    //Remove aresta com determinado id.
    removerAresta(id) {
        let a = this.obterAresta(id);
        if (a) {
            this.arestas.remove(id);
            console.log(`removerAresta(${JSON.stringify(a)})`);
        }
    }

    //Remove a aresta atualmente selecionada.
    removerArestaSelecionada() {
        this.grafo.getSelectedEdges().forEach((id, index, array) => {
            this.removerAresta(id);
        });
    }

    //Remove o vertice atualmente selecionado e suas arestas.
    removerVerticeSelecionado() {
        this.removerArestaSelecionada();
        this.grafo.getSelectedNodes().forEach((id, index, array) => {
            this.removerVertice(id);
        });
    }

    //Colore o vertice com uma determinada cor.
    colorirVerticeNaPosicao(pos, cor) {
        console.log(`colorirVerticeNaPosicao(${pos})`);
        let id = this.obterIdDoVerticeNaPosicao(pos);
        this.colorirVertice(id, cor);
    }

    //Colore o vertice com uma determinada cor.
    colorirVertice(id, cor) {
        console.log(`colorirVertice(${id})`);
        this.vertices.update({
            id: id,
            color: cor
        });
    }

    //Colore o vertice com a cor padrão.
    descolorirVerticeNaPosicao(pos) {
        console.log(`descolorirVerticeNaPosicao(${pos})`);
        let id = this.obterIdDoVerticeNaPosicao(pos);
        this.descolorirVertice(id);
    }

    //Colore o vertice com a cor padrão.
    descolorirVertice(id) {
        console.log(`descolorirVertice(${id})`);
        this.vertices.update({
            id: id,
            color: '#9E9E9E'
        });
    }

    //Colore todos os vertices com a cor padrão.
    descolorirTodosOsVertices() {
        this.vertices.forEach((item, id) => {
            this.descolorirVertice(id);
        });
    }

    //Colore a aresta entre dois vertices nas posições a e b com uma cor.
    colorirArestaEntreOsVerticesNasPosicoes(posa, posb, cor) {
        console.log(`colorirArestaEntreOsVerticesNasPosicoes(${posa}, ${posb}, ${cor})`);
        let aresta = this.obterArestasEntreOsVerticesNasPosicoes(posa, posb)[0];
        if (aresta) {
            this.colorirAresta(aresta.id, cor);
        }
    }

    //Colore a aresta com determinado id com uma cor.
    colorirAresta(id, cor) {
        console.log(`colorirAresta(${id}, ${cor})`);
        this.arestas.update({
            id: id,
            color: {
                color: cor,
                highlight: cor
            }
        });
    }

    //Colore a aresta entre os vértices nas posições a e b com uma cor.
    descolorirArestaEntreOsVerticesNasPosicoes(posa, posb) {
        console.log(`descolorirArestaEntreOsVerticesNasPosicoes(${posa}, ${posb})`);
        let aresta = this.obterArestasEntreOsVerticesNasPosicoes(posa, posb)[0];
        if (aresta) {
            this.descolorirAresta(aresta.id);
        }
    }

    //Colore a aresta com determinado id.
    descolorirAresta(id) {
        console.log(`descolorirAresta(${id})`);
        this.arestas.update({
            id: id,
            color: {
                color: '#9E9E9E',
                highlight: '#757575'
            }
        });
    }

    //Colore todas as arestas com a cor padrão.
    descolorirTodasAsArestas() {
        this.arestas.forEach((item, id) => {
            this.descolorirAresta(id);
        });
    }

    //matriz de inteiros.
    obterMatrizDeAdjacenciaBruto() {
        let length = this.vertices.length;
        let matrizBruta = Array(length).fill(null).map(() => Array(length).fill(false));
        //Monta a matriz.
        for (let y = 0; y < length; y++) {
            for (let x = 0; x < length; x++) {
                //Existe uma aresta?
                let aresta = this.obterArestasEntreOsVerticesNasPosicoes(x, y);
                if (aresta) {
                    matrizBruta[x][y] = true;
                }
                aresta = this.obterArestasEntreOsVerticesNasPosicoes(y, x);
                if (aresta) {
                    matrizBruta[y][x] = true;
                }
            }
        }
        return matrizBruta;
    }

    obterMatrizDeAdjacencia(newLine) {
        let matriz = ''; //string com a matriz de adjacencia.
        let length = this.vertices.length;
        let matrizBruta = this.obterMatrizDeAdjacenciaBruto();
        //Monta a matriz.
        for (let y = 0; y < length; y++) {
            //Cria uma linha.
            let row = '';
            for (let x = 0; x < length; x++) {
                //Tem mais de uma coluna.
                if (x > 0) {
                    row += ',';
                }
                //Adiciona '0' ou '1'.
                if (matrizBruta[x][y] === true) {
                    row += '1';
                } else {
                    row += '0';
                }
            }
            //Adiciona a nova linha.
            matriz += row + (newLine || '</br>');
        }
        return matriz;
    }

    obterListaDeAdjacencia(newLine) {
        let matriz = ''; //string com a matriz de adjacencia.
        let length = this.vertices.length;
        let matrizBruta = this.obterMatrizDeAdjacenciaBruto();
        //Monta a matriz.
        for (let y = 0; y < this.vertices.length; y++) {
            //Cria uma linha.
            let row = '';
            for (let x = 0; x < this.vertices.length; x++) {
                if (matrizBruta[x][y] === true) {
                    //Tem mais de uma coluna.
                    if (row !== '') {
                        row += ',';
                    }
                    row += x;
                }
            }
            //Adiciona a nova linha.                
            matriz += row + (newLine || '</br>');
        }

        return matriz;
    }

    plotar() {
        //container do grafo.
        let elm = document.getElementById(this.container);
        //Dados: vertices e arestas.
        let data = {
            nodes: this.vertices,
            edges: this.arestas
        };
        //O grafo.
        this.grafo = new vis.Network(elm, data, this.options);
        //Evento de clique sobre a area do grafo.
        this.grafo.on("click", (params) => {
            let nodes = params.nodes;
            let edges = params.edges;
            let verticeSelecionado = null;
            let arestaSelecionada = null;
            //Se clicou no vértice...
            if (nodes.length > 0) {
                verticeSelecionado = nodes[0]; //id do vertice.
                this.observable.emit('vertice', verticeSelecionado, params);
            }
            //Se clicou na aresta...
            else if (edges.length > 0) {
                arestaSelecionada = edges[0]; //id da aresta.
                this.observable.emit('aresta', arestaSelecionada, params);
            }
            //Clicou no espaço vazio.
            else {
                this.observable.emit('espacovazio', params);
            }
        });
    }
}
