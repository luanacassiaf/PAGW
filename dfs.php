<div>
	<h6>1 - Escolha o vértice inicial e final e clique em executar!</h6>
</div>

<div class="ml-1 d-flex justify-content-center align-items-center">
    <div class="input-group" style="width: 130px;">
        <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">Início</span>
        </div>
        <input limit-to-graph-size id="input-vertice-inicial" type="number" class="form-control" min="0" value="0"/>
	</div>

    <div class="input-group ml-1 mr-1" style="width: 120px;">
        <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">Fim</span>
        </div>
        <input limit-to-graph-size id="input-vertice-final" type="number" class="form-control" min="0" value="0"/>
	</div>

    <div class="btn-group">
        <button id="btn-executar" class="btn btn-success" type="button" onclick="executarAlgoritmoDfs()"><i class="fa fa-play"></i> Executar</button>
    </div>
</div>

<script>
var grafo = new Dfs('grafo');

function executarAlgoritmoDfs() {
	let verticeInicial = $("#input-vertice-inicial").val();
	let verticeFinal = $("#input-vertice-final").val();
	//Executa o algoritmo.
	grafo.executar(parseInt(verticeInicial), parseInt(verticeFinal));
}
</script>
