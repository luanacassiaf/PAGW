<script>
$("#selecionar-menu-item").hide();
$("#adicionar-menu-item").hide();
$("#remover-menu-item").hide();
$("#conectar-menu-item").hide();
$("#exportar-imagem-menu-item").hide();
</script>

<div id="cavalo-tabuleiro-box">
	<table id="cavalo-tabuleiro">

	</table>
	</div>
	<div id="cavalo-comando-box">
	<button class="btn btn-primary" onclick="grafo.definirModo(1)">Definir Início</button>
	<button class="btn btn-primary" onclick="grafo.definirModo(2)">Definir Fim</button>
	<button class="btn btn-primary" onclick="grafo.definirModo(0)">Definir Proibido</button>
	<button class="btn btn-success" onclick="grafo.executar()"><i class="mdi-play"></i> Executar</button>
	</div>
<script>
var grafo = new Cavalo("#cavalo-tabuleiro");

function limparGrafo() {
	grafo.limpar();
}
</script>

