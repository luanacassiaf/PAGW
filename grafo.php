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
					<h6>IDE</h6>
					<div id="codeeditor">
						<button id="compilar-button" class="btn btn-primary" onclick="compilarCodigoDoEditor()"><i class="mdi-play"></i> COMPILAR</button>
					</div>
					<div id="outputOrError" class="alert alert-success" style="height: 70px; margin-top: 5px; overflow: auto; font-size: 12px">
						
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
	indentWithTabs: true,
	lineWrapping: true,
	scrollbarStyle: null
});

// Salvar código do editor automaticamente a cada 5s.
setInterval(() => localStorage.codeEditorValue = editor.getValue(), 5000);

function compilarCodigoDoEditor() {
	compilar(editor.getValue(), "");
}

async function compilar(code, input) {
	try {
		$("#compilar-button").prop("disabled", true);

		const response = await axios({
			method: 'post',
			url: 'api.php?m=compiler',
			data: {
				"input": input,
				"code": code
			}
		});
		const status = response.status;
		const data = response.data;
		
		$("#outputOrError").removeClass("alert-success");
		$("#outputOrError").removeClass("alert-danger");
		
		if(data.error) {
			$("#outputOrError").addClass("alert-danger");
			$("#outputOrError").html(data.error.replace("\n", "<br/>"));
		} else {
			$("#outputOrError").addClass("alert-success");
			$("#outputOrError").html(data.output.replace("\n", "<br/>"));
		}
	} finally {
		$("#compilar-button").prop("disabled", false);
	}
}

</script>
