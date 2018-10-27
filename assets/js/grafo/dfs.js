class Dfs extends GrafoBasico {

    constructor(container) {
        super(container);
    }

    //Executa o algoritmo DFS e colore o caminho encontrado passando as posições do vertice inicial e final.
    executar(verticeInicial, verticeFinal) {
        console.log(`Executando DFS com os vértices: ${verticeInicial}, ${verticeFinal}`);
        //
        let matriz = this.obterMatrizDeAdjacenciaBruto();
        const n = this.obterNumeroDeVertices();
        let visitado = Array(n).fill(false);
        let caminho = Array(n).fill(false); //caminho com antecessores.

        if (verticeInicial < 0 ||
                verticeInicial >= n ||
                verticeFinal < 0 ||
                verticeFinal >= n) {
            return false;
        }

        function dfs_recursivo(v) {
            visitado[v] = true;
            for (let i = 0; i < n; i++) {
                if (matriz[v][i] === true && visitado[i] === false) {
                    //Adiciona o vertice visitado no caminho.
                    caminho[i] = v;
                    //Chegou no final, para! Precisa será??
                    if (verticeFinal === i) {
                        break;
                    }
                    dfs_recursivo(i);
                }
            }
        }

        dfs_recursivo(verticeInicial);

        this.colorirCaminhoEncontrado(verticeInicial, verticeFinal, caminho);
    }

    colorirCaminhoEncontrado(verticeInicial, verticeFinal, caminho) {
        //Descolore tudo.
        this.descolorirTodasAsArestas();
        this.descolorirTodosOsVertices();
        //Colore os vértices iniciais e finais.
        this.colorirVerticeNaPosicao(verticeInicial, '#4CAF50');
        this.colorirVerticeNaPosicao(verticeFinal, '#f44336');
        //Vamos percorrer o caminho de trás pra frente.
        let vertice = verticeFinal;

        console.log(caminho);

        while (caminho[vertice] !== false) {
            let a = vertice;
            let b = caminho[vertice];
            //Colore uma aresta.
            this.colorirArestaEntreOsVerticesNasPosicoes(a, b, 'orange');
            //Colore um vértice.
            if (vertice !== verticeFinal &&
                    vertice !== verticeInicial) {
                this.colorirVerticeNaPosicao(vertice, '#FF9800');
            }
            vertice = b;
        }
    }
}
