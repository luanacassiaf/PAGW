<?php

$algoritmo = isset($_GET['algo']) ? $_GET['algo'] : 'dfs';
$titulo = null;
$descricao = null;
$exibir = true;

function isActive($alg) {
	global $algoritmo;
	return $algoritmo == $alg ? "active" : "";
}

if($algoritmo === "dfs") {
    $titulo = "Busca em Profundidade (DFS, Deep-First Search)";
    $descricao = "Na teoria dos grafos, busca em profundidade é um algoritmo usado para realizar uma busca ou travessia numa árvore, estrutura de árvore ou grafo. Intuitivamente, o algoritmo começa num nó raiz (selecionando algum nó como sendo o raiz, no caso de um grafo) e explora tanto quanto possível cada um dos seus ramos, antes de retroceder(backtracking).";
} else {
    $exibir = true;
}

?>
<html>
    <head>
		<link rel="shortcut icon" type="image/png" href="img/favicon.png"/>
        <!-- CSS -->
        <link rel="stylesheet" href="vendor/bootstrap/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/all.css">
        <link rel="stylesheet" href="css/balloon.css">
        <link rel="stylesheet" href="css/theme.css">
        <!-- JS -->
		<script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
        <script type="text/javascript" src="js/filesaver.min.js"></script>
    	<script type="text/javascript" src="js/cytoscape.min.js"></script>
    	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
		<script defer type="text/javascript" src="vendor/bootstrap/js/bootstrap.min.js"></script>
    	<script type="text/javascript" src="js/grafo.js"></script>

        <title>PAGW - Plataforma de Aprendizagem de Grafos via Web</title>
    </head>
    <body>
        <!-- Corpo -->
        <div id="content">
            <!-- Cabeçalho -->
            <header class="shadow">
                <!-- Toolbar -->
                <nav class="navbar">
					<!-- Botão do Menu Lateral -->
					<div class="col-md-1 col-sm-1 col-2">
						<i class="fas fa-bars btn-collapse ripple ripple-circle" onclick="exibirOuOcultarMenuLateral()"></i>
					</div>
                    <!-- Logo e Título -->
                    <div class="col-md-5 col-sm-11 col-10">
						<a class="navbar-brand" href="#">
							<img class="logo" src="img/pagw-logo.png">
							<span>
								<div class="title">PAGW</div>
								<div class="subtitle">Plataforma de Aprendizagem de Grafos via Web</div>
							</span>
						</a>
					</div>
					<!-- Barra de Ações -->
					<div class="col-md-6 actionbar">
						<span balloon="Selecionar" balloon-pos="down" onclick="grafo.habilitarModoSelecionar();"><i actionbar-group="grafo" class="actionbar-item fas fa-mouse-pointer ripple ripple-circle active"></i></span>
						<span balloon="Clique em um espaço vazio para adicionar um vértice" balloon-pos="down" onclick="grafo.habilitarModoInserir();"><i actionbar-group="grafo" class="actionbar-item fas fa-plus ripple ripple-circle"></i></span>
						<span balloon="Selecione dois vértices para criar uma aresta" balloon-pos="down" onclick="grafo.habilitarModoConectar();"><i actionbar-group="grafo" class="actionbar-item fas fa-plug ripple ripple-circle"></i></span>
						<span balloon="Clique sobre um vértice ou aresta para removê-los" balloon-pos="down" onclick="grafo.habilitarModoRemover();"><i actionbar-group="grafo" class="actionbar-item fas fa-trash ripple ripple-circle"></i></span>

						<span balloon="Abrir de um arquivo" balloon-pos="down" onclick="importarJsonComoGrafo(true)"><i class="actionbar-item fas fa-folder ripple ripple-circle"></i></span>
						<span balloon="Salvar para um arquivo" balloon-pos="down" onclick="salvarGrafoComoJson()"><i class="actionbar-item fas fa-save ripple ripple-circle"></i></span>
						<span balloon="Exportar como..." balloon-pos="down" data-toggle="modal" data-target="#exportarModal" onclick="exibirExportarModal()"><i class="actionbar-item fas fa-download ripple ripple-circle"></i></span>

						<input type="file" id="file-input-json" accept="application/json" style="display: none" onchange="importarJsonComoGrafo(false)">

						<span>
							<div class="dropdown">
								<i class="actionbar-item fas fa-ellipsis-v ripple ripple-circle active" data-toggle="dropdown"></i>
								<div class="dropdown-menu dropdown-menu-right">
									<a class="dropdown-item" onclick="exportarComoImagem('png')">Exportar Como PNG</a>
									<a class="dropdown-item" onclick="exportarComoImagem('jpg')">Exportar Como JPG</a>
								</div>
							</div>
						</span>
					</div>
                </nav>
            </header>
			<!-- Main -->
            <section id="main">
				<!-- Menu Lateral -->
                <div id="sidebar1" class="sidebar shadow col-md-3">
					<!-- Itens do Menu -->
                    <ul class="sidebar-nav">
						<li class="sidebar-header">
                            ALGORITMOS
                        </li>
                        <li class="sidebar-item <?= isActive('dfs'); ?>">
                            <a href="?algo=dfs">Busca em Profundidade</a>
                        </li>
                        <li class="sidebar-item <?= isActive('bfs'); ?>">
                        <a href="?algo=bfs">Busca em Largura</a>
                        </li>
					</ul>
					<p class="text-center"><img class="badge-img" src="https://img.shields.io/github/release/tiagohm/PAGW.svg?label=versão"></p>
                </div>

                <?php if($exibir): ?>
                <?php include_once "./grafo.php"; ?>
                <?php endif; ?>
            </section>
		</div>

		<!-- Modal -->
		<div class="modal fade" id="exportarModal" tabindex="-1" role="dialog">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Exportar Como</h5>
						<button type="button" class="close" data-dismiss="modal">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<nav>
							<div class="nav nav-tabs" id="nav-tab" role="tablist">
								<a class="nav-item nav-link active" id="nav-matriz-adjacencia-tab" data-toggle="tab" href="#nav-matriz-adjacencia" role="tab">Matriz de Adjacência</a>
								<a class="nav-item nav-link" id="nav-lista-adjacencia-tab" data-toggle="tab" href="#nav-lista-adjacencia" role="tab">Lista de Adjacência</a>
							</div>
						</nav>
						<div class="tab-content">
							<div class="tab-pane fade show active" id="nav-matriz-adjacencia" role="tabpanel">
								<pre id="text-matriz-adjacencia">



								</pre>
							</div>
							<div class="tab-pane fade" id="nav-lista-adjacencia" role="tabpanel">
								<pre id="text-lista-adjacencia">



								</pre>
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-success" data-dismiss="modal">OK</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Github Corner -->
        <a href="https://github.com/tiagohm/PAGW" target="_blank" class="github-corner" aria-label="View source on GitHub">
            <svg viewBox="0 0 250 250" style="fill:#28a745; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true">
            <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
            <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
            <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>
            </svg>
		</a>

	</body>

	<script>
		function exibirOuOcultarMenuLateral() {
			let elm = $("#sidebar1");
			elm.hasClass("reveal") && elm.removeClass("reveal") || elm.addClass("reveal");
		}

		function exibirExportarModal() {
			$("#text-matriz-adjacencia").text(grafo.obterMatrizDeAdjacenciaFormatada());
			$("#text-lista-adjacencia").text(grafo.obterListaDeAdjacenciaFormatada());
		}

		function salvarGrafoComoJson() {
			let file = new File([grafo.toJson()], "<?= $algoritmo ?>.json", {type: "application/json;charset=utf-8"});
			saveAs(file);
		}

		function importarJsonComoGrafo(performClick) {
			if(performClick) {
				$("#file-input-json").click();
			} else {
				let file = $("#file-input-json")[0].files[0];
				if(file) {
					let reader = new FileReader();
					reader.onload = (e) => {
						let content = e.target.result;
						grafo.fromJson(JSON.parse(content));
					};
					reader.readAsText(file, "UTF-8");
				}
			}
		}

		function exportarComoImagem(type) {
			if(type == 'png') {
				exportarComoImagemPng(grafo.toPng());
			} else {
				exportarComoImagemJpg(grafo.toJpg());
			}
		}

		function exportarComoImagemPng(blob) {
			if(!blob || blob.size == 0) return;
			let file = new File([blob], "<?= $algoritmo ?>.png", {type: "image/png"});
			saveAs(file);
		}

		function exportarComoImagemJpg(blob) {
			if(!blob || blob.size == 0) return;
			let file = new File([blob], "<?= $algoritmo ?>.jpg", {type: "image/jpeg"});
			saveAs(file);
		}

		$(document).ready(function() {
			//Ativar/Desativar itens de um determinado grupo.
			$("i[actionbar-group]").click(function() {
				let group = $(this).attr("actionbar-group");
				$(`i[actionbar-group=${group}]`).each(function(i) {
					$(this).removeClass("active");
				});
				$(this).addClass("active");
			});
		});
	</script>
</html>
