<div class="row p-1 h-100" style="position: relative;">

    <div class="description-panel col-md-12">
        <h2 class="title"><?= $titulo ?></h2>
        <p class="text-center content"><?= $descricao ?></p>
        <div style="display: flex; align-items: center; justify-content: center;">
          <div class="btn-group" data-toggle="buttons">
              <label id="selecionar-btn" class="btn btn-primary form-check-label active" onclick="onSelecionarClick()">
                  <input class="form-check-input" type="radio" name="acao" id="selecionar-input" autocomplete="off" checked><i class="fas fa-mouse-pointer"></i> <span>Selecionar</span>
              </label>
              <label id="adicionar-btn" balloon="Clique em um espaço vazio para adicionar um vértice" balloon-pos="down" class="btn btn-success form-check-label" onclick="onAdicionarVerticeClick()">
                  <input class="form-check-input" type="radio" name="acao" id="adicionar-input" autocomplete="off"><i class="fas fa-plus"></i> <span>Adicionar</span>
              </label>
              <label id="conectar-btn" balloon="Selecione dois vértices para criar uma aresta" balloon-pos="down" class="btn btn-warning form-check-label" onclick="onConectarVerticesClick()">
                  <input class="form-check-input" type="radio" name="acao" id="conectar-input" autocomplete="off"><i class="fas fa-plug"></i> <span>Conectar</span>
              </label>
              <label id="remover-btn" balloon="Clique sobre um vértice ou aresta para removê-lo" balloon-pos="down" class="btn btn-danger form-check-label" onclick="onRemoverClick()">
                  <input class="form-check-input" type="radio" name="acao" id="excluir-input" autocomplete="off"><i class="fas fa-trash"></i> <span>Remover</span>
              </label>
          </div>

          <div class="ml-1">
              <div class="btn-group">
                  <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><i class="fa fa-upload"></i> Exportar</button>
                  <div class="dropdown-menu">
                      <a class="dropdown-item" onclick="exibirMatrizDeAdjacencia()" href="#"><i class="fa fa-table"></i> Matriz de Adjacência</a>
                      <a class="dropdown-item" onclick="exibirListaDeAdjacencia()" href="#"><i class="fa fa-th-list"></i> Lista de Adjacência</a>
                  </div>
              </div>
          </div>
        </div>
    </div>

    <div id="grafo" class="grafo-panel">

    </div>

    <div class="algoritmo-panel">
      <?php include_once "./algoritmos/$algoritmo.php"; ?>
    </div>
</div>

<!-- Modal -->
<div class="modal fade" id="matrizDeAdjacenciaModal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Matriz de Adjacência</h5>
                <button type="button" class="close" data-dismiss="modal">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <pre id="textoDaMatrizDeAdjacencia">



                </pre>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="listaDeAdjacenciaModal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Lista de Adjacência</h5>
                <button type="button" class="close" data-dismiss="modal">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <pre id="textoDaListaDeAdjacencia">



                </pre>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>

<script>
var operacao = 0;
var primeiroVertice = null; //primeiro vertice da aresta a criar.

grafo.gerar(2);
grafo.novaArestaEntreVertices(0, 1);
grafo.plotar();

function exibirMatrizDeAdjacencia() {
    $("#textoDaMatrizDeAdjacencia").text(grafo.obterMatrizDeAdjacencia('\r\n'));
    $("#matrizDeAdjacenciaModal").modal("show");
}

function exibirListaDeAdjacencia() {
    $("#textoDaListaDeAdjacencia").text(grafo.obterListaDeAdjacencia('\r\n'));
    $("#listaDeAdjacenciaModal").modal("show");
}

function onSelecionarClick() {
  primeiroVertice = null;
  operacao = 0;
}

function onAdicionarVerticeClick() {
  primeiroVertice = null;
  operacao = 1;
}

function onConectarVerticesClick() {
  primeiroVertice = null;
  operacao = 2;
}

function onRemoverClick() {
  primeiroVertice = null;
  operacao = 3;
}

grafo.on('espacovazio', (params) => {
    switch (operacao) {
        case 1:
          grafo.novoVertice({
              x: params.pointer.canvas.x,
              y: params.pointer.canvas.y
          });
          break;
    }
});
grafo.on('vertice', (id, params) => {
    switch(operacao) {
      case 2:
        if (primeiroVertice === null) {
            primeiroVertice = id;
        }
        else {
            grafo.novaArestaEntreVertices(primeiroVertice, id);
            primeiroVertice = null;
        }
        break;
      case 3:
      grafo.removerVerticeSelecionado();
      break;
    }
});
grafo.on('aresta', (id, params) => {
    switch (operacao) {
        case 3:
        grafo.removerArestaSelecionada();
        break;
    }
});
</script>
