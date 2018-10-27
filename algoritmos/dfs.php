<div class="ml-1 d-flex">
    <div class="input-group mr-1" style="width: 130px;">
        <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">Início</span>
        </div>
        <input id="vertice-inicial-input" type="number" class="form-control" min="0" value="0"/>
    </div>
    <div class="input-group mr-1" style="width: 120px;">
        <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">Fim</span>
        </div>
        <input id="vertice-final-input" type="number" class="form-control" min="0" value="1"/>
    </div>
    <div class="btn-group">
        <button id="executar-dfs-btn" class="btn btn-success" type="button" onclick="onExecutarDfsClick()"><i class="fa fa-play"></i> Executar</button>
    </div>
</div>
<script>
    var grafo = new Dfs('grafo');

    function onExecutarDfsClick() {
        let res = grafo.executar(parseInt($("#vertice-inicial-input").val()), parseInt($("#vertice-final-input").val()));
        if (res === false) {
            alert('Não foi possível executar o algoritmo!');
        }
    }
</script>
