<?php
$algoritmo = isset($_GET['algo']) ? $_GET['algo'] : 'dfs';

$titulo = "";
$descricao = "";
$show = true;

switch ($algoritmo) {
    case 'dfs':
        $titulo = "Busca em Profundidade (DFS, Deep-First Search)";
        $descricao = "Na teoria dos grafos, busca em profundidade é um algoritmo usado para realizar uma busca ou travessia numa árvore, estrutura de árvore ou grafo. Intuitivamente, o algoritmo começa num nó raiz (selecionando algum nó como sendo o raiz, no caso de um grafo) e explora tanto quanto possível cada um dos seus ramos, antes de retroceder(backtracking).";
        break;

    default:
        $show = false;
        break;
}
?>

<header>
    <!--Navbar-->
    <!-- https://mdbootstrap.com/components/navbar/ -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <!-- Navbar brand -->
        <a class="navbar-brand" href="#">Plataforma de Aprendizagem de Grafos via Web</a>
        <!-- Collapse button -->
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#nav-content" aria-controls="nav-content" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <!-- Collapsible content -->
        <div class="collapse navbar-collapse" id="nav-content">
            <!-- Links -->
            <ul class="navbar-nav mr-auto">
                <li class="nav-item active">
                    <a class="nav-link" href="#"><i class="fas fa-home"></i> Home</a>
                </li>
                <li class="nav-item">
                    <div class="btn-group">
                        <button class="btn dropdown-toggle" type="button" data-toggle="dropdown"><i class="fa fa-puzzle-piece"></i> Algoritmos</button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="?algo=dfs"><i class="fas fa-project-diagram"></i> Busca em Profundidade</a>
                            <a class="dropdown-item" href="?algo=bfs"><i class="fas fa-project-diagram"></i> Busca em Largura</a>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </nav>
</header>

<div id="main" class="container-fluid mt-1">
    <?php if($show): ?>
    <?php include_once "./algoritmos/grafo.php"; ?>
    <?php endif; ?>
</div>
