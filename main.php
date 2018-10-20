<?php
$algoritmo = isset($_GET['algo']) ? $_GET['algo'] : 'dfs';

$titulo = "";
$descricao = "";

switch ($algoritmo) {
  case 'dfs':
    $titulo = "Busca em Profundidade (DFS, Deep-First Search)";
    $descricao = "Na teoria dos grafos, busca em profundidade é um algoritmo usado para realizar uma busca ou travessia numa árvore, estrutura de árvore ou grafo. Intuitivamente, o algoritmo começa num nó raiz (selecionando algum nó como sendo o raiz, no caso de um grafo) e explora tanto quanto possível cada um dos seus ramos, antes de retroceder(backtracking).";
    break;

  default:
    die;
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
            </ul>
        </div>
    </nav>
</header>

<div id="main" class="container-fluid mt-1">
    <?php include_once "./algoritmos/grafo.php"; ?>
</div>
