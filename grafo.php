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

			<div id="grafo" class="grafo-panel">

			</div>
		</div>

		<div class="col-md-4 p-2">
			<div class="card-panel">
				<h2 class="title"><?= $titulo ?></h2>
				<p id="description" class="collapse description"><?= $descricao ?></p>
				<a data-toggle="collapse" href="#description" role="button" style="color: #FFF; font-size: 10pt; text-decoration: none;">DESCRIÇÃO...</a>
			</div>
			<div class="algoritmo-panel mt-2">
				<?php include_once "./$algoritmo.php"; ?>

				<div id="codeeditor-box">
					<h6></h6>
					<div id="codeeditor">

					</div>
				</div>
			</div>
		</div>

	</div>
</div>

<script>
// Define o valor inicial da direção ao carregar a página.
grafo.aplicarDirecaoDasArestas($("#switchbox-direcao > input").is(":checked"));

const defaultCPlusPlusCode = `#include <iostream>

int main() 
{
    std::cout << "Hello, World!";
    return 0;
}`;

const editor = CodeMirror(document.getElementById("codeeditor"), {
	value: localStorage.codeEditorValue || defaultCPlusPlusCode,
	mode:  "clike",
	lineNumbers: true,
	theme: "pastel-on-dark",
	indentWithTabs: true
});


</script>
