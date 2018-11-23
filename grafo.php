<div class="col-md-12 h-100" style="position: relative;">

	<div class="row">

		<div class="col-md-8 p-2">
			<div class="grafo-toolbar">

			</div>

			<div id="grafo" class="grafo-panel">

			</div>
		</div>

		<div class="col-md-4 p-2">
			<div class="card-panel">
				<h2 class="title"><?= $titulo ?></h2>
				<p class="description"><?= $descricao ?></p>
				<!-- <i class="fas fa-times"></i> -->
			</div>
			<div class="algoritmo-panel mt-2">
				<?php include_once "./$algoritmo.php"; ?>
			</div>
		</div>

	</div>
</div>
