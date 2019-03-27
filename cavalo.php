<script>
criarAcao("definir-proibido", "Definir Proibido", "cavalo", "alpha-p-box", true);
criarAcao("definir-fim", "Definir Fim", "cavalo", "alpha-f-box");
criarAcao("definir-inicio", "Definir Início", "cavalo", "alpha-i-box");
ocultarAcao("selecionar");
ocultarAcao("adicionar");
ocultarAcao("remover");
ocultarAcao("conectar");
ocultarAcao("exportar-matriz");
ocultarAcao("exportar-imagem");
</script>

<div class="col-md-12 h-100" style="position: relative;">
	<div class="row">
		<div class="col-md-8 p-2">
			<div class="grafo-toolbar">
			</div>

			<div id="cavalo-tabuleiro-box">
				<table id="cavalo-tabuleiro">
				</table>
			</div>
		</div>

		<div class="col-md-4 p-2">
			<div class="card-panel">
				<h2 class="title"><?= $titulo ?></h2>
				<p id="description" class="collapse description"><?= $descricao ?></p>
				<a data-toggle="collapse" href="#description" role="button" style="color: #FFF; font-size: 10pt; text-decoration: none;">DESCRIÇÃO...</a>
			</div>
			<div class="algoritmo-panel mt-2">
				<div>
					<h6>1 - Escolher a Casa Início. Clique em <i class="mdi-alpha-i-box"></i> e selecione uma casa no tabuleiro. </h6>
					<h6>2 - Escolher a Casa Final. Clique em <i class="mdi-alpha-f-box"></i> e selecione uma casa no tabuleiro.</h6>
					<h6>3 - Escolher as Casas Proibidas. Clique em <i class="mdi-alpha-p-box"></i> e selecione as casas no tabuleiro.</h6>
					<h6>4 - Clique em executar!</h6>
				</div>
				<button class="btn btn-success" onclick="grafo.executar()"><i class="mdi-play"></i> Executar</button>
			</div>
		</div>
	</div>
</div>

<script>
var grafo = new Cavalo("#cavalo-tabuleiro");

function onAction(action) {
	if(action === "definir-inicio") {
		grafo.definirModo(1);
	} else if(action === "definir-fim") {
		grafo.definirModo(2);
	} else if(action === "definir-proibido") {
		grafo.definirModo(0);
	}
}

function limparGrafo() {
	grafo.limpar();
}
</script>

