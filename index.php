<?php


//echo "PHP VERSION: ".phpversion();

$app = isset($_GET["app"]) && !empty($_GET["app"]) ? $_GET["app"] : "dfs";

$pastaApp = __DIR__ . "/app/";
$pastaGrafo = __DIR__ . "/grafo/";
$listaDeAplicativos = array();
$aplicativo = null;



$array1 = array("..", ".");

foreach(array_diff(scandir($pastaApp), $array1) as $dir) {
	$metaCaminho = $pastaApp . $dir . "/meta.json";

	if(file_exists($metaCaminho)) {
		$meta = json_decode(file_get_contents($metaCaminho), true);
	

		$listaDeAplicativos[$dir] = $meta;
		if($dir == $app) {
			$aplicativo = $meta;
		} 
		//echo("<script>console.log('PHP: ". var_dump($aplicativo) ."');</script>");	
		//echo $aplicativo["grafo"]; die;		
	}
}

?>

<html>
    <head>
                <meta charset="utf-8"/>
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<link rel="shortcut icon" type="image/png" href="img/favicon.png"/>
		<!-- CSS Global -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <link rel="stylesheet" href="css/mdi.css">
        <link rel="stylesheet" href="css/balloon.css">
        <link rel="stylesheet" href="css/cytoscape-context-menus.css">
		<link rel="stylesheet" href="css/theme.css">
		<!-- CSS da aplicação ou de um algoritmo em grafo -->
		<?php if($aplicativo["grafo"]): ?>
			<link rel="stylesheet" href="grafo/index.css">
		<?php endif; ?>
		<link rel="stylesheet" href="app/<?php echo $app ?>/index.css">
		<!-- JS Global -->
		<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js"></script>
    	<script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.5.0/cytoscape.min.js"></script>
    	<script src="js/cytoscape-context-menus.js"></script>
    	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
		<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
		<script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
		<script src="js/common.js"></script>
		<!-- JS da aplicação e dos algoritmos -->
		<?php if($aplicativo["grafo"]): ?>
			<script src="grafo/index.js"></script>
		<?php endif; ?>
		<script src="app/<?php echo $app ?>/index.js"></script> 
        <title>Algoritmos em Grafos e Aplicações</title>
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
						<i class="mdi-menu btn-collapse ripple ripple-circle" onclick="exibirOuOcultarMenuLateral()"></i>
					</div>
                    <!-- Logo e Título -->
                    <div class="col-md-5 col-sm-11 col-10">
						<a class="navbar-brand" href="#">
							<img class="logo" src="img/pagw-logo.png">
							<span>
								<div class="title">Algoritmos e Aplicações em Grafos</div>
							</span>
						</a>
					</div>
					<!-- Barra de Ações -->
					<div id="actionbar" class="col-md-6 actionbar">
						<?php
						
							if($aplicativo["grafo"]) {
								readfile($pastaGrafo . "toolbar.html");
							} else if(file_exists($pastaApp . "$app/toolbar.html")) {
								readfile($pastaApp . "$app/toolbar.html");
							} else {
								echo "toolbar.html não encontrado!";
							}
						?>
					</div>
                </nav>
            </header>
			<!-- Main -->
            <section id="main">
				<!-- Menu Lateral -->
                <div id="sidebar" class="sidebar shadow col-md-3">
					<!-- Itens do Menu -->
                    <ul class="sidebar-nav">
						<li class="sidebar-header">
                            ALGORITMOS E APLICAÇÕES
						</li>

						<?php foreach($listaDeAplicativos as $algoritmo => $dados): ?>
							<li class="sidebar-item" tipo>
								<a href='?app=<?php echo $algoritmo; ?>'><?php echo $dados["nome"]; ?></a>
							</li>
						<?php endforeach; ?>
					</ul>
				</div>

				<?php 
					// Exibir o grafo dos algoritmos.

					echo ("<script>console.log('Pasta: ".$pastaApp."$app/index.html"."')</script>");
					echo ("<script>console.log('Grafo: ".$aplicativo["grafo"]."')</script>");
					
					

					if($aplicativo["grafo"]) {
						include_once "./grafo/index.php";
					} else if(file_exists($pastaApp . "$app/index.html")) {
						readfile($pastaApp . "$app/index.html");
					} else {
						echo "index.html não encontrado!";
					}
				?>
            </section>
		</div>

		<!-- Github Corner -->
        <a href="https://github.com/luanacassiaf/pagw" target="_blank" class="github-corner" aria-label="View source on GitHub">
            <svg viewBox="0 0 250 250" style="fill:#28a745; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true">
            <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
            <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
            <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>
            </svg>
		</a>

	</body>
</html>
