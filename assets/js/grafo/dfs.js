class Dfs extends GrafoBasico {

  constructor(container) {
    super(container);
  }

  executar(verticeInicial, verticeFinal) {
    console.log(
      `Executando DFS com os vértices: ${verticeInicial}, ${verticeFinal}`);

    let matriz = this.obterMatrizDeAdjacenciaBruto();
    const n = matriz.length;
    let visitado = Array(n).fill(0);
    let caminho = Array(n).fill(-1); //caminho com antecessores.

    if (verticeInicial < 0 ||
      verticeInicial >= n ||
      verticeFinal < 0 ||
      verticeFinal >= n) {
      return false;
    }

    //TODO: verificar se o vertice inicial e final são válidos.

    function dfs_recursivo(v) {
      visitado[v] = 1;
      for (let i = 0; i <= n; i++) {
        if (matriz[v][i] === 1 && visitado[i] === 0) {
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
    this.descolorirTodasAsArestas();
    this.descolorirTodosOsVertices();
    this.colorirVertice(verticeInicial, 'green');
    this.colorirVertice(verticeFinal, 'red');

    let vertice = verticeFinal;
    while (caminho[vertice] !== -1) {
      let a = vertice;
      let b = caminho[vertice];
      this.colorirArestaPorVertices(a, b, 'orange');
      if (vertice !== verticeFinal &&
        vertice !== verticeInicial) {
        this.colorirVertice(vertice, 'orange');
      }
      vertice = b;
    }
  }

  resetar() {
    super.resetar();
  }
}
