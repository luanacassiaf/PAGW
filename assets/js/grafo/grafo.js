//Classe responsavel por plotar e controlar um grafo.

class Grafo {

    constructor(container) {
        //eventos.
        this.observable = new EventEmitter();

        this.container = container; //container do grafo.
        this.vertices = new vis.DataSet(); //vertices.
        this.arestas = new vis.DataSet(); //arestas.
        //Configurações.
        this.options = {
            layout: {
                randomSeed: 0,
                improvedLayout: false
            },
            nodes: {
                size: 40,
                shape: 'circle'
            },
            physics: {
                enabled: true
            }
        };
        this.grafo = null; //grafo.
    }

    on(label, callback) {
        this.observable.addListener(label, callback);
    }

    gerar(qtde) {
        for (let i = 0; i < qtde; i++) {
            this.novoVertice({
                label: `${i}`
            });
        }
    }

    novoVertice(n) {
        this.vertices.add(n);
    }

    novaAresta(a) {
        this.arestas.add(a);
    }

    removerVertice(id) {
        this.vertices.remove(id);
    }

    removerAresta(id) {
        this.arestas.remove(id);
    }

    removerArestaSelecionada() {
        this.grafo.getSelectedEdges().forEach((element, index, array) => {
            this.removerAresta(element);
        });
    }

    removerVerticeSelecionado() {
        this.grafo.getSelectedNodes().forEach((element, index, array) => {
            this.removerVertice(element);
        });
    }

    alternarDirecaoDaAresta(id) {

    }

    obterMatrizDeAdjacencia(newLine) {
        let matrix = ''; //string com a matriz de adjacencia.
        let arrayDeVertices = []; //guarda os vertices pra obter sua posição (0, ...)
        let listaDeAdjacencia = new Map(); //guarda as relecoes entre vertices.
        //Guarda os vertices.
        this.vertices.forEach((item, id) => {
            arrayDeVertices.push(id);
        });
        //Monta os pares de vertices da aresta na lista de adjacencia.
        this.arestas.forEach((item, id) => {
            let from = item.from;
            let to = item.to;
            let posFrom = arrayDeVertices.indexOf(from);
            let posTo = arrayDeVertices.indexOf(to);

            if (posFrom !== -1 && posTo !== -1) {
                //Verifica se o vertice não existe no mapa e adiciona-o;
                if (listaDeAdjacencia.get(posFrom) === undefined) {
                    listaDeAdjacencia.set(posFrom, []);
                }
                //Grafo direcionado.
                listaDeAdjacencia.get(posFrom).push(posTo);
                //TODO DIFENCIAR ISSO.
                //Grafo não direcionado.
                if (listaDeAdjacencia.get(posTo) === undefined) {
                    listaDeAdjacencia.set(posTo, []);
                }
                listaDeAdjacencia.get(posTo).push(posFrom);
            }
        });
        //Monta a matriz.
        for (let y = 0; y < arrayDeVertices.length; y++) {
            let row = '';
            for (let x = 0; x < arrayDeVertices.length; x++) {
                if(x > 0) row += ',';
                
                if(listaDeAdjacencia.get(x) !== undefined &&
                  listaDeAdjacencia.get(x).indexOf(y) !== -1) {
                    row += '1';
                } else {
                    row += '0';
                }
            }
            
            matrix += row + (newLine || '</br>');
        }

        return matrix;
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
