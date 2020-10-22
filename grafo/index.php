<div class="col-md-12 h-100" style="position: relative;">

	<div class="row">

		<div class="col-md-8 p-2">
			<div class="grafo-toolbar">
				<!-- Slider -->
				<small class="text mr-2">VELOCIDADE: </small>
				<label class="sliderbar">
					<input type="range" min="1" max="100" value="50" class="slider" onchange="grafo.definirVelocidadeDaAnimacao(this.value)">
				</label>
				<!-- Switch Button -->
				<small class="text">DIRECIONADO: </small>
				<label id="switchbox-direcao" class="switchbox">
					<input type="checkbox" onclick="grafo.aplicarDirecaoDasArestas(this.checked);">
					<span class="slider round"></span>
				</label>
			</div>
            <!-- Grafo -->
			<div id="grafo" class="grafo-panel">
			</div>
		</div>

		<div class="col-md-4 p-2">
			<?php readfile($pastaApp . "$app/index.html"); ?>
		</div>

	</div>
</div>

<!-- Modal -->
<div class="modal fade" id="exportar-modal" tabindex="-1" role="dialog">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Matriz ou Lista de Adjacência</h5>
				<button type="button" class="close" data-dismiss="modal">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<nav>
					<div class="nav nav-tabs" id="nav-tab" role="tablist">
						<a class="aba nav-item nav-link active" id="nav-matriz-adjacencia-tab" data-toggle="tab" href="#nav-matriz-adjacencia" role="tab">Matriz de Adjacência</a>

						<a class="aba nav-item nav-link" id="nav-lista-adjacencia-tab" data-toggle="tab" href="#nav-lista-adjacencia" role="tab">Lista de Adjacência</a>
					</div>
				</nav>
				<div style="display: flex; justify-content: center;" class="tab-content">
					<div class="tab-pane fade show active" id="nav-matriz-adjacencia" role="tabpanel">
						<br/>
						<pre id="matriz-adjacencia-texto"></pre>
					</div>

					<div class="tab-pane fade" id="nav-lista-adjacencia" role="tabpanel">
						<br/>
						<pre id="lista-adjacencia-texto"></pre>
					</div>
				</div>
			</div>
			
			<div class="modal-footer">
				<span class="btn btn-primary botao-salvar" id="btnSaveImg" onclick="salvarElementoComoImagem('#lista-adjacencia-texto', 'lista')">Salvar como Imagem</span>
					
				<span class="btn btn-primary botao-salvar" id="btnSavePDF" onclick="salvarElementoComoPDF('#lista-adjacencia-texto', 'lista')">Salvar como PDF</span>

				<button type="button" class="btn btn-success botao-ok" data-dismiss="modal">OK</button>
			</div>
		</div>
	</div>
</div>

<script>
	var btnImg = document.getElementById("btnSaveImg");
	var btnPDF = document.getElementById("btnSavePDF");
	var aba = document.getElementsByClassName("aba");
	var idPrimeiraAba = aba[0].id;
	console.log("Primeira: " + idPrimeiraAba);
	mudarOnClick(idPrimeiraAba);

	for(a = 0; a < aba.length; a++) {
		aba[a].addEventListener("click", selecionarAba);
	}

	function selecionarAba(event) {
			var idAbaClicada = event.target.id;
			console.log(btnImg.onclick, btnPDF.onclick);
			console.log('Aqui: ',idAbaClicada);
			mudarOnClick(idAbaClicada);
	}

	function mudarOnClick(idAbaSelecionada) {
		console.log("texto: " + idAbaSelecionada);
		if(idAbaSelecionada == "nav-lista-adjacencia-tab") { 

			var funcaoSalvarListaComoImagem = "salvarElementoComoImagem('#lista-adjacencia-texto', 'lista')";
			var onclickSalvarListaComoImagem = new Function(funcaoSalvarListaComoImagem);

			var funcaoSalvarListaComoPDF = "salvarElementoComoPDF('#lista-adjacencia-texto', 'lista')";
			var onclickSalvarListaComoPDF = new Function(funcaoSalvarListaComoPDF);

			btnImg.onclick = onclickSalvarListaComoImagem;
			btnPDF.onclick = onclickSalvarListaComoPDF;

		}else if(idAbaSelecionada == "nav-matriz-adjacencia-tab") {

			var funcaoSalvarMatrizComoImagem = "salvarElementoComoImagem('#matriz-adjacencia-texto', 'matriz')";
			var onclickSalvarMatrizComoImagem = new Function(funcaoSalvarMatrizComoImagem);

			var funcaoSalvarMatrizComoPDF = "salvarElementoComoPDF('#matriz-adjacencia-texto', 'matriz')";
			var onclickSalvarMatrizComoPDF = new Function(funcaoSalvarMatrizComoPDF);

			btnImg.onclick = onclickSalvarMatrizComoImagem;
			btnPDF.onclick = onclickSalvarMatrizComoPDF;
		}else {
			return;
		}
	}
</script>
