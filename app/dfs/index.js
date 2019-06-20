//Busca em Profundidade.
class Dfs extends Grafo {

    constructor(containerId) {
        super(containerId);
    }

    // Eventos.

    onInserirNovoVertice(event) {
        this.inserirNovoVertice(event.position.x, event.position.y);
    }

    onConectarDoisVertices(vertice1, vertice2) {
        this.inserirNovaAresta(vertice1.id(), vertice2.id(), this.direcionado);
    }

    onRemoverVertice(vertice) {
        this.removerVerticeOuAresta(vertice);
    }

    onRemoverAresta(aresta) {
        this.removerVerticeOuAresta(aresta);
    }

    // Ações.

    inserirNovoVertice(x, y) {
        super.inserirNovoVertice({ data: {}, x: x, y: y })
    }

    inserirNovaAresta(verticeId1, verticeId2, direcionado) {
        super.inserirNovaAresta({ data: { direcionado: direcionado, source: verticeId1, target: verticeId2 } })
    }

    removerVerticeOuAresta(verticeOuAresta) {
        super.removerVerticeOuAresta(verticeOuAresta);
    }

    executar(verticeInicial, verticeFinal) {
        //Matriz.
        const matriz = this.obterMatrizDeAdjacencia();
        const n = matriz.length;
        //Verificar os valores.
        if (verticeInicial < 0 ||
            verticeInicial >= n ||
            verticeFinal < 0 ||
            verticeFinal >= n) {
            return false;
        }

        const cor = Array(n).fill(0);
        const caminho = [];
        let fim = false;

        //Algoritmo DFS do notebook da maratona.
        function dfs(u, p) {
            cor[u] = 1; //grey.

            //Não é o vértice raiz.
            if (p >= 0) {
                const m = matriz[p][u];
                caminho.push(m);
            }

            //Vértice atual é o final.
            fim = u == verticeFinal;

            if (!fim) {
                for (let v = 0; v < n && !fim; v++) {
                    //novo vértice.
                    if (matriz[u][v] && v != p) {
                        //forward edge.
                        if (cor[v] == 0) {
                            dfs(v, u);
                        }
                    }
                    //back edge.
                    else if (cor[v] == 1) {
                        //nada.
                    }
                    //cross edge em grafos direcionados.
                    else {
                        //nada.
                    }
                }
            }

            cor[u] = 2; //black.
        }

        //Limpa os estilos.
        this.limparEstiloDoGrafo();

        //Executa o DFS.
        dfs(verticeInicial, -1);

        const stepper = new Stepper(caminho, 3, () => this.velocidadeDaAnimacao);
        stepper.executar((m, i, k) => {
            if (k == 0) {
                //Pinta o primeiro vértice com a cor verde.
                if (m.sourcePosition == verticeInicial) {
                    m.source.addClass('start-node');
                } else {
                    m.source.addClass('highlighted');
                }
            }
            else if (k == 1) {
                //Pinta a aresta.
                m.edge.addClass('highlighted');
            }
            else if (k == 2) {
                //Pinta o último vértice com a cor vermelha.
                if (m.targetPosition == verticeFinal) {
                    m.target.addClass('end-node');
                } else {
                    m.target.addClass('highlighted');
                }
            }
        });
    }
}