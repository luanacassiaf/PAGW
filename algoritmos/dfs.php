<div class="row">
    <div class="col-md-12">

        <h2>Busca em Profundidade (DFS, Deep-First Search)</h2>

        <p class="text-center">
            Mussum Ipsum, cacilds vidis litro abertis. Interagi no mé, cursus quis, vehicula ac nisi. Todo mundo vê os porris que eu tomo, mas ninguém vê os tombis que eu levo! Posuere libero varius. Nullam a nisl ut ante blandit hendrerit. Aenean sit amet nisi.
            A ordem dos tratores não altera o pão duris.
        </p>
    </div>
</div>

<div class="row">
    <div class="col-md-12 mb-5">

        <div>
            <div class="grafo-wrapper view view-cascade overlay" style="height: 95vh">
                <div>
                    <div class="btn-group mt-1 ml-1" data-toggle="buttons">
                        <label class="btn btn-outline-primary form-check-label active" onclick="operacao = 0;">
                            <input class="form-check-input" type="radio" name="acao" id="acao-selecionar" autocomplete="off" checked><i class="fa fa-mouse-pointer"></i> Selecionar
                        </label>
                        <label class="btn btn-outline-success form-check-label" onclick="operacao = 1;">
                            <input class="form-check-input" type="radio" name="acao" id="acao-adicionar" autocomplete="off"><i class="fa fa-plus"></i> Adicionar
                        </label>
                        <label class="btn btn-outline-amber form-check-label" onclick="operacao = 2;">
                            <input class="form-check-input" type="radio" name="acao" id="acao-conectar" autocomplete="off"><i class="fa fa-code-fork"></i> Conectar
                        </label>
                        <label class="btn btn-outline-red form-check-label" onclick="operacao = 3;">
                            <input class="form-check-input" type="radio" name="acao" id="acao-excluir" autocomplete="off"><i class="fa fa-trash"></i> Excluir
                        </label>
                    </div>

                    <div class="btn-group">
                        <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Exportar</button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" onclick="exibirMatrizDeAdjacencia()" href="#">Matriz de Adjacência</a>
                            <a class="dropdown-item" onclick="exibirListaDeAdjacencia()" href="#">Lista de Adjacência</a>
                        </div>
                    </div>
                </div>

                <div id="grafo"> </div>
            </div>
        </div>
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
    var operacao = 0; //1 = adicionar, 2 = conectar, 3 = remover.
    var grafo = new Dfs('grafo');
    var quantidadeDeVertices = 0;

    grafo.on('vertice', (id, params) => {
        //Excluir vertice.
        if (operacao === 3) {
            grafo.removerVerticeSelecionado();
        }
    });
    grafo.on('aresta', (id, params) => {
        //Excluir aresta.
        if (operacao === 3) {
            grafo.removerArestaSelecionada();
        }
    });
    grafo.on('espacovazio', (params) => {
        //Novo vértice.
        if (operacao === 1) {
            grafo.novoVertice({
                label: `${quantidadeDeVertices++}`,
                x: params.pointer.canvas.x,
                y: params.pointer.canvas.y
            });
        }
    });
    grafo.on('novaaresta', (from, to) => {
        //Ligar vértices.
        if (operacao === 2) {
            console.log('nova aresta de ' + from + ' a ' + to);
            grafo.novaAresta({
                from: from,
                to: to
            });
        }
    });

    grafo.plotar();

    function exibirMatrizDeAdjacencia() {
        $("#textoDaMatrizDeAdjacencia").text(grafo.obterMatrizDeAdjacencia('\r\n'));
        $("#matrizDeAdjacenciaModal").modal("show");
    }

    function exibirListaDeAdjacencia() {
        $("#textoDaListaDeAdjacencia").text(grafo.obterListaDeAdjacencia('\r\n'));
        $("#listaDeAdjacenciaModal").modal("show");
    }

</script>
