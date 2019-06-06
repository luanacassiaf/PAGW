// Dijkstra.
class Dijkstra extends Grafo {

    constructor(containerId) {
        super(containerId);
    }

    onInserirNovoVertice(event) {
        this.inserirNovoVertice(event.position.x, event.position.y);
    }

    onConectarDoisVertices(vertice1, vertice2) {
        this.inserirNovaAresta(vertice1.id(), vertice2.id(), this.direcionado, 1);
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

    inserirNovaAresta(verticeId1, verticeId2, direcionado, peso) {
        super.inserirNovaAresta({ data: { peso: peso, direcionado: direcionado, source: verticeId1, target: verticeId2 } })
    }

    removerVerticeOuAresta(verticeOuAresta) {
        super.removerVerticeOuAresta(verticeOuAresta);
    }

    incrementarPesoDasArestasSelecionadas() {
        this.grafo.elements('edge:selected').forEach(function (edge) {
            const peso = edge.data("peso") || 0;
            edge.data("peso", peso + 1);
        });
        this.salvarGrafoTemporariamente();
    }

    decrementarPesoDasArestasSelecionadas() {
        this.grafo.elements('edge:selected').forEach(function (edge) {
            const peso = edge.data("peso") || 0;
            if (peso > 0) edge.data("peso", peso - 1);
        });
        this.salvarGrafoTemporariamente();
    }

    obtainContextMenuItems() {
        return [
            {
                id: 'alterar-peso',
                content: 'Alterar o peso da aresta',
                selector: 'edge',
                onClickFunction: (event) => {
                    const target = event.target || event.cyTarget;
                    const peso = parseInt(prompt("Insira o peso da aresta", target.data("peso")));
                    if (peso && peso >= 0) {
                        target.data("peso", peso);
                        this.salvarGrafoTemporariamente();
                    }
                },
                hasTrailingDivider: false
            },
        ];
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

        const dist = Array(n).fill(0xFFFFFFFF);
        const visitado = Array(n).fill(false);
        const caminho = [];
        const antecessor = Array(n).fill(false);

        function dijkstra(s, t) {
            dist[s] = 0;

            while (true) {
                let no = false; // vértice com o caminho mais curto.
                for (let i = 0; i < n; i++) {
                    if (visitado[i] === false && (no === false || dist[i] < dist[no])) {
                        no = i;
                    }
                }

                if (no === false) break;

                visitado[no] = true; // Elimina o nó.

                for (let i = 0; i < n; i++) {
                    const m = matriz[no][i];
                    if (m) {
                        const peso = m.edge.data("peso") || 0;
                        if ((dist[no] + peso) < dist[i]) {
                            dist[i] = dist[no] + peso;
                            antecessor[i] = no;
                        }
                    }
                }

                if (no === verticeFinal) break;
            }

            console.log(`distancia de ${s} até ${t}: ${dist[t]}`);
        }

        function percorrerAntecessores(v) {
            if (antecessor[v] === false) return;
            percorrerAntecessores(antecessor[v]);
            const m = matriz[antecessor[v]][v];
            caminho.push(m);
        }

        //Limpa os estilos.
        this.limparEstiloDoGrafo();

        dijkstra(verticeInicial, verticeFinal);
        percorrerAntecessores(verticeFinal);

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
