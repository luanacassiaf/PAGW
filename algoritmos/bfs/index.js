// Busca em largura.
class Bfs extends Grafo {

    constructor(containerId) {
        super(containerId);
    }

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

        const dist = Array(n).fill(false);
        const q = [];
        const caminho = [];

        //Algoritmo BFS do notebook da maratona.
        function bfs(s) {
            dist[s] = 0;
            q.push(s);

            while (q.length) {
                const u = q.shift();

                let fim = false;

                for (let v = 0; v < n && !fim; v++) {
                    const m = matriz[u][v];
                    if (dist[v] === false && m) {
                        dist[v] = dist[u] + 1;
                        q.push(v);
                        // Adiciona a aresta ao caminho.
                        caminho.push(m);
                        // Encontrou o vértice final.
                        fim = v == verticeFinal;
                    }
                }

                if (fim) break;
            }
        }

        //Limpa os estilos.
        this.limparEstiloDoGrafo();

        //Executa o BFS.
        bfs(verticeInicial);
        console.log(caminho);

        const stepper = new Stepper(caminho, 3, this.velocidadeDaAnimacao);
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