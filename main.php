<header>
  <!--Navbar-->
  <!-- https://mdbootstrap.com/components/navbar/ -->
  <nav class="navbar navbar-expand-lg navbar-dark primary-color">

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
          <a class="nav-link" href="#"><i class="fa fa-home"></i> Home</a>
        </li>

      </ul>

    </div>
  </nav>
</header>

<main>
  <div class="container-fluid mt-5">

    <?php include_once "./algoritmos/dfs.php"; ?>

  </div>
</main>