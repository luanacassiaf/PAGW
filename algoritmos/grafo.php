<div class="row p-1 h-100" style="position: relative;">

    <div class="description-panel col-md-12">
        <h2 class="title"><?= $titulo ?></h2>
        <p class="text-center content"><?= $descricao ?></p>
        <div style="display: flex; align-items: center; justify-content: center;">
            <ul class="nav nav-pills" role="tablist">
                <li class="nav-item">
                    <a id="selecionar-btn" class="nav-link active primary" data-toggle="tab" href="#" role="tab" onclick="onSelecionarClick()"><i class="fas fa-mouse-pointer mr-1"></i> Selecionar</a>
                </li>
                <li class="nav-item" balloon="Clique em um espaço vazio para adicionar um vértice" balloon-pos="down">
                    <a id="adicionar-btn" class="nav-link success" data-toggle="tab" href="#" role="tab" onclick="onAdicionarVerticeClick()"><i class="fas fa-plus mr-1"></i> Adicionar</a>
                </li>
                <li class="nav-item" balloon="Selecione dois vértices para criar uma aresta" balloon-pos="down">
                    <a id="conectar-btn" class="nav-link warning" data-toggle="tab" href="#" role="tab" onclick="onConectarVerticesClick()"><i class="fas fa-plug mr-1"></i> Conectar</a>
                </li>
                <li class="nav-item" balloon="Clique sobre um vértice ou aresta para removê-lo" balloon-pos="down">
                    <a id="remover-btn" class="nav-link danger" data-toggle="tab" href="#" role="tab" onclick="onRemoverClick()"><i class="fas fa-trash mr-1"></i> Remover</a>
                </li>
            </ul>
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
    grafo.criarArestaEntreVerticesNasPosicoes(0, 1);
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
                grafo.criarVertice((v) => {
                    v.x = params.pointer.canvas.x;
                    v.y = params.pointer.canvas.y;
                });
                break;
        }
    });
    grafo.on('vertice', (id, params) => {
        switch (operacao) {
            case 2:
                if (primeiroVertice === null) {
                    primeiroVertice = id;
                } else {
                    grafo.criarArestaEntreVertices(primeiroVertice, id);
                    primeiroVertice = null;
                }
                break;
            case 3:
                grafo.removerVerticeSelecionado();
                grafo.atualizarLabelDeTodosOsVertices();
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
